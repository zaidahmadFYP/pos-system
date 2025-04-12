import React, { useState, useEffect } from 'react';
import { Card, Box, Typography } from '@mui/material';
import { AttachMoney, CalendarMonth, TableBar } from '@mui/icons-material';

const MetricCard = ({ title, value, date, type }) => {
  const [miniChartData, setMiniChartData] = useState([]);

  useEffect(() => {
    const fetchMiniChartData = async () => {
      if (type === 'sales') {
        try {
          const transactionsResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/transactions/orders`
          );
          if (!transactionsResponse.ok) {
            throw new Error(`Failed to fetch transactions (Status: ${transactionsResponse.status})`);
          }
          const transactions = await transactionsResponse.json();

          // Get the last 8 days
          const today = new Date();
          const last8Days = Array.from({ length: 8 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toISOString().split("T")[0];
          }).reverse();

          // Calculate sales for each of the last 8 days
          const salesByDay = last8Days.map((day) => {
            const daySales = transactions
              .filter((transaction) => transaction.date.startsWith(day))
              .reduce((sum, transaction) => sum + transaction.total, 0);
            return daySales;
          });

          // Normalize the sales data to fit the mini chart (0-100%)
          const maxSales = Math.max(...salesByDay, 1); // Avoid division by zero
          const normalizedData = salesByDay.map((sales) => (sales / maxSales) * 100);
          setMiniChartData(normalizedData);
        } catch (err) {
          console.error("Error fetching mini chart data:", err.message);
          // Fallback to random data if fetch fails
          setMiniChartData([...Array(8)].map(() => Math.random() * 100));
        }
      } else {
        // For "Monthly Revenue" and "Table Occupancy", use random data for now
        setMiniChartData([...Array(8)].map(() => Math.random() * 100));
      }
    };

    fetchMiniChartData();
  }, [type]);

  const getIcon = () => {
    switch (type) {
      case 'sales':
        return <AttachMoney sx={{ color: '#FFEB3B' }} />;
      case 'revenue':
        return <CalendarMonth sx={{ color: '#FFEB3B' }} />;
      case 'tables':
        return <TableBar sx={{ color: '#FFEB3B' }} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        bgcolor: '#2a2a2a',
        p: 2,
        height: 'auto',
        borderRadius: 2,
        position: 'relative',
        boxShadow: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
        border: '1px solid rgba(248, 187, 208, 0.2)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#333',
        },
      }}
    >
      <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
        <Box
          sx={{
            bgcolor: 'rgba(248, 187, 208, 0.1)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
          }}
        >
          {getIcon()}
        </Box>
      </Box>
      <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
        {date}
      </Typography>
      {/* Mini Chart */}
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          gap: 1,
          height: 40,
          alignItems: 'flex-end',
        }}
      >
        {miniChartData.map((height, i) => (
          <Box
            key={i}
            sx={{
              width: '15%',
              bgcolor: '#4caf50',
              height: `${height}%`,
              borderRadius: 1,
              transition: 'height 0.6s ease',
              '&:hover': {
                height: '100%',
              },
            }}
          />
        ))}
      </Box>
    </Card>
  );
};

export default MetricCard;