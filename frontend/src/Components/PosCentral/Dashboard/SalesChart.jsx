import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isLgScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
  // Custom media query for the specific screen size mentioned (1366x776)
  const isLaptopScreen = useMediaQuery('(min-width:1280px) and (max-width:1440px) and (max-height:800px)');
  
  const [view, setView] = useState('weekly');
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
  const [rawSalesData, setRawSalesData] = useState([]);

  // Calculate chart height based on screen size - reduced for laptop screens with height constraints
  const getChartHeight = () => {
    if (isLaptopScreen) return 280; // Reduced height for 1366x776 screens
    if (isXsScreen) return 220;
    if (isSmScreen) return 260;
    if (isMdScreen) return 320;
    return 380;
  };
  
  // Calculate font sizes based on screen size
  const getFontSizes = () => {
    if (isXsScreen) {
      return {
        heading: '0.875rem',
        button: '0.625rem',
        legendLabel: 8,
        tooltipTitle: 9,
        tooltipBody: 8,
        axisLabel: 8
      };
    }
    if (isSmScreen) {
      return {
        heading: '1rem',
        button: '0.75rem',
        legendLabel: 10,
        tooltipTitle: 10,
        tooltipBody: 9,
        axisLabel: 9
      };
    }
    if (isMdScreen || isLaptopScreen) { // Apply md font sizes to laptop screen size as well
      return {
        heading: '1.125rem',
        button: '0.8rem',
        legendLabel: 11,
        tooltipTitle: 11,
        tooltipBody: 10,
        axisLabel: 10
      };
    }
    return {
      heading: '1.25rem',
      button: '0.875rem',
      legendLabel: 12,
      tooltipTitle: 12,
      tooltipBody: 11,
      axisLabel: 11
    };
  };

  const fontSizes = getFontSizes();
  const chartHeight = getChartHeight();

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

        let labels = [];
        let salesData = [];

        if (view === 'daily') {
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
          const today = new Date();
          labels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setMonth(today.getMonth() - i);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          }).reverse();

          salesData = labels.map((label) => {
            const date = new Date(label);
            const monthString = date.toISOString().slice(0, 7);
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
        p: { xs: 1, sm: 1.5, md: 1.5, lg: 2 }, // Reduced padding for all sizes
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        height: isLaptopScreen ? 'calc(100% - 16px)' : { xs: 'auto', md: '100%' }, // Reduced height for laptop screens
        maxHeight: isLaptopScreen ? 'calc(100% - 16px)' : { xs: 'none', md: '100%' }, // Reduced max-height for laptop screens
        mb: isLaptopScreen ? 2 : 0, // Add bottom margin for laptop screens
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: { xs: 0.5, sm: 0.75 }, // Further reduced margin
          gap: { xs: 0.5, sm: 0 },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontSize: fontSizes.heading,
            mb: { xs: 0.5, sm: 0 }
          }}
        >
          Overview
        </Typography>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: { xs: 0.5, sm: 1 },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(e, newView) => newView && setView(newView)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: '#fff',
                fontWeight: 500,
                fontSize: fontSizes.button,
                padding: { xs: '2px 4px', sm: '3px 6px', md: '4px 8px' },
                '&.Mui-selected': {
                  bgcolor: '#f15a22',
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#e14f1e',
                  },
                },
                '&:hover': {
                  bgcolor: 'rgba(241, 90, 34, 0.1)',
                },
              },
            }}
          >
            <ToggleButton value="weekly">Weekly</ToggleButton>
            <ToggleButton value="daily">Daily</ToggleButton>
            <ToggleButton value="monthly">Monthly</ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{
              color: '#fff',
              borderColor: '#f15a22',
              fontSize: fontSizes.button,
              padding: { xs: '2px 4px', sm: '3px 6px', md: '4px 8px' },
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: 'rgba(241, 90, 34, 0.1)',
              },
              fontWeight: 600,
              minWidth: { xs: '100%', sm: 'auto' },
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
          height: chartHeight,
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 0,
          m: 0,
        }}
      >
        {loading ? (
          <CircularProgress sx={{ color: '#f15a22' }} />
        ) : error ? (
          <Typography
            sx={{ color: 'red', fontSize: fontSizes.button }}
          >
            {error}
          </Typography>
        ) : (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: !isXsScreen,
                  position: 'top',
                  align: 'end',
                  labels: {
                    color: '#fff',
                    font: {
                      size: fontSizes.legendLabel,
                    },
                    boxWidth: isXsScreen ? 10 : 12,
                    padding: isXsScreen ? 2 : 4, // Further reduced padding
                  },
                },
                tooltip: {
                  titleFont: {
                    size: fontSizes.tooltipTitle,
                  },
                  bodyFont: {
                    size: fontSizes.tooltipBody,
                  },
                  padding: isXsScreen ? 4 : 6,
                  displayColors: !isXsScreen,
                },
              },
              scales: {
                x: {
                  ticks: {
                    color: '#cccccc',
                    font: {
                      size: fontSizes.axisLabel,
                    },
                    maxRotation: isXsScreen || isLaptopScreen ? 60 : 45, // Increased rotation for laptop screens to save space
                    minRotation: isXsScreen || isLaptopScreen ? 60 : 45,
                    autoSkip: true,
                    maxTicksLimit: isXsScreen ? 4 : isSmScreen || isLaptopScreen ? 5 : 7, // Limited ticks for laptop screens
                    padding: isXsScreen ? 2 : 3, // Further reduced padding
                  },
                  grid: {
                    display: false,
                    drawBorder: false,
                  },
                  border: {
                    display: false,
                  },
                },
                y: {
                  ticks: {
                    color: '#cccccc',
                    font: {
                      size: fontSizes.axisLabel,
                    },
                    callback: (value) => `${(value / 1000).toFixed(0)}k`,
                    padding: isXsScreen ? 2 : 3, // Further reduced padding
                    maxTicksLimit: isXsScreen || isLaptopScreen ? 5 : 8, // Limited ticks for laptop screens
                  },
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    drawBorder: false,
                    tickLength: 0,
                  },
                  border: {
                    display: false
                  },
                  beginAtZero: true,
                },
              },
              elements: {
                point: {
                  radius: isXsScreen || isLaptopScreen ? 2 : 3, // Smaller points for laptop screens
                  hoverRadius: isXsScreen || isLaptopScreen ? 3 : 5,
                },
                line: {
                  borderWidth: isXsScreen || isLaptopScreen ? 1.5 : 2,
                }
              },
              interaction: {
                mode: 'index',
                intersect: false,
              },
              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }
              }
            }}
          />
        )}
      </Box>
    </Card>
  );
};

export default SalesChart;