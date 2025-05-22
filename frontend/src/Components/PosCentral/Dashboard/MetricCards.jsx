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

          const today = new Date();
          const last8Days = Array.from({ length: 8 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date.toISOString().split("T")[0];
          }).reverse();

          const salesByDay = last8Days.map((day) => {
            const daySales = transactions
              .filter((transaction) => transaction.date.startsWith(day))
              .reduce((sum, transaction) => sum + transaction.total, 0);
            return daySales;
          });

          const maxSales = Math.max(...salesByDay, 1);
          const normalizedData = salesByDay.map((sales) => (sales / maxSales) * 100);
          setMiniChartData(normalizedData);
        } catch (err) {
          console.error("Error fetching mini chart data:", err.message);
          setMiniChartData([...Array(8)].map(() => Math.random() * 100));
        }
      } else {
        setMiniChartData([...Array(8)].map(() => Math.random() * 100));
      }
    };

    fetchMiniChartData();
  }, [type]);

  const getIcon = () => {
    switch (type) {
      case 'sales':
        return <AttachMoney sx={{ 
          color: '#FFEB3B', 
          fontSize: { 
            xs: 24, 
            md: 28, 
            lg: 32 
          } 
        }} />;
      case 'revenue':
        return <CalendarMonth sx={{ 
          color: '#FFEB3B', 
          fontSize: { 
            xs: 24, 
            md: 28, 
            lg: 32 
          } 
        }} />;
      case 'tables':
        return <TableBar sx={{ 
          color: '#FFEB3B', 
          fontSize: { 
            xs: 24, 
            md: 28, 
            lg: 32 
          } 
        }} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        bgcolor: '#2a2a2a',
        p: { 
          xs: 1.5, 
          md: 2, 
          lg: 2.5 
        },
        height: '100%',
        minHeight: { 
          xs: 160, 
          md: 180, 
          lg: 200 
        },
        borderRadius: 2,
        position: 'relative',
        boxShadow: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
        border: '1px solid rgba(248, 187, 208, 0.2)',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#333',
        },
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ 
        position: 'absolute', 
        right: { 
          xs: 8, 
          md: 12, 
          lg: 16 
        }, 
        top: { 
          xs: 8, 
          md: 12, 
          lg: 16 
        } 
      }}>
        <Box
          sx={{
            bgcolor: 'rgba(248, 187, 208, 0.1)',
            borderRadius: '50%',
            p: { 
              xs: 0.5, 
              md: 0.75, 
              lg: 1 
            },
            display: 'flex',
          }}
        >
          {getIcon()}
        </Box>
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: '#fff',
          mb: 0.5,
          fontWeight: 600,
          fontSize: { 
            xs: '1rem', 
            md: '1.125rem', 
            lg: '1.25rem' 
          },
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          color: '#fff',
          mb: 1,
          fontWeight: 700,
          fontSize: { 
            xs: '1.5rem', 
            md: '1.75rem', 
            lg: '2rem' 
          },
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: '#999',
          fontStyle: 'italic',
          fontSize: { 
            xs: '0.75rem', 
            md: '0.8125rem', 
            lg: '0.875rem' 
          },
        }}
      >
        {date}
      </Typography>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          gap: { 
            xs: 0.5, 
            md: 0.75, 
            lg: 1 
          },
          height: { 
            xs: 30, 
            md: 35, 
            lg: 40 
          },
          alignItems: 'flex-end',
          width: '100%',
        }}
      >
        {miniChartData.map((height, i) => (
          <Box
            key={i}
            sx={{
              flex: 1,
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