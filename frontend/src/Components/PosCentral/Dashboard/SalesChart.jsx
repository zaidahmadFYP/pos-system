import React, { useState, useEffect } from 'react';
import { Card, Box, Typography, ToggleButton, ToggleButtonGroup, Button, CircularProgress } from '@mui/material';
import { Download } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [view, setView] = useState('monthly');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        borderColor: '#f15a22',
        backgroundColor: 'rgba(241, 90, 34, 0.2)',
        tension: 0.4,
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawSalesData, setRawSalesData] = useState([]); // For export

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);

      try {
        const transactionsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/orders`
        );
        if (!transactionsResponse.ok) {
          throw new Error(`Failed to fetch transactions (Status: ${transactionsResponse.status})`);
        }
        const transactions = await transactionsResponse.json();

        // Process data based on the selected view
        let labels = [];
        let salesData = [];

        if (view === 'daily') {
          // Last 7 days
          const today = new Date();
          labels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
          }).reverse();

          salesData = labels.map((label) => {
            const date = new Date(label);
            const dateString = date.toISOString().split("T")[0];
            return transactions
              .filter((transaction) => transaction.date.startsWith(dateString))
              .reduce((sum, transaction) => sum + transaction.total, 0);
          });
        } else if (view === 'weekly') {
          // Last 7 weeks
          const today = new Date();
          labels = Array.from({ length: 7 }, (_, i) => {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - (i * 7));
            return `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
          }).reverse();

          salesData = labels.map((label, index) => {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - ((6 - index) * 7));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const startDateString = startOfWeek.toISOString().split("T")[0];
            const endDateString = endOfWeek.toISOString().split("T")[0];

            return transactions
              .filter((transaction) => {
                const transactionDate = new Date(transaction.date);
                const transactionDateString = transaction.date.split("T")[0];
                return transactionDateString >= startDateString && transactionDateString <= endDateString;
              })
              .reduce((sum, transaction) => sum + transaction.total, 0);
          });
        } else if (view === 'monthly') {
          // Last 7 months
          const today = new Date();
          labels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setMonth(today.getMonth() - i);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }).reverse();

          salesData = labels.map((label) => {
            const date = new Date(label);
            const monthString = date.toISOString().slice(0, 7); // e.g., "2025-04"
            return transactions
              .filter((transaction) => transaction.date.startsWith(monthString))
              .reduce((sum, transaction) => sum + transaction.total, 0);
          });
        }

        setChartData({
          labels,
          datasets: [
            {
              label: 'Sales',
              data: salesData,
              borderColor: '#f15a22',
              backgroundColor: 'rgba(241, 90, 34, 0.2)',
              tension: 0.4,
            },
          ],
        });

        // Store raw sales data for export
        setRawSalesData(labels.map((label, index) => ({
          period: label,
          sales: salesData[index],
        })));
      } catch (err) {
        console.error("Error fetching sales data:", err.message);
        setError("Failed to load sales chart data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [view]);

  const handleExport = () => {
    // Export chart data as CSV
    const csvContent = [
      ["Period", "Sales"],
      ...rawSalesData.map((data) => [data.period, data.sales]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales_data_${view}.csv`;
    link.click();
  };

  return (
    <Card
      sx={{
        bgcolor: '#1a1a1a',
        p: 2,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        maxWidth: 10000,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => newView && setView(newView)}
            sx={{
              '& .MuiToggleButton-root': {
                color: '#fff',
                fontWeight: 500,
                '&.Mui-selected': {
                  bgcolor: '#f15a22',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#e14f1e',
                  },
                },
                transition: 'background-color 0.3s ease, transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              },
            }}
          >
            <ToggleButton value="monthly">Monthly</ToggleButton>
            <ToggleButton value="daily">Daily</ToggleButton>
            <ToggleButton value="weekly">Weekly</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{
              color: '#fff',
              borderColor: '#f15a22',
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: '#f15a22',
              },
              fontWeight: 600,
              padding: '6px 12px',
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          width: '100%',
          height: '200px',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: '#f15a22' }} />
        ) : error ? (
          <Typography sx={{ color: 'red' }}>{error}</Typography>
        ) : (
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
        )}
      </Box>
    </Card>
  );
};

export default SalesChart;