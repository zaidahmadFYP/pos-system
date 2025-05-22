import React, { useState, useEffect } from 'react';
import { Box, Grid, Snackbar, Alert, CircularProgress, Typography } from '@mui/material';
import MetricCard from './MetricCards';
import PopularItem from './PopularItem';
import SalesChart from './SalesChart';

const Dashboard = () => {
  const [dailySales, setDailySales] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [tableOccupancy, setTableOccupancy] = useState("25 Tables");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const fetchDashboardData = async () => {
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

        const today = new Date().toISOString().split("T")[0];
        const todaySales = transactions
          .filter((transaction) => transaction.date.startsWith(today))
          .reduce((sum, transaction) => sum + transaction.total, 0);
        setDailySales(todaySales);

        const currentMonth = new Date().toISOString().slice(0, 7);
        const monthSales = transactions
          .filter((transaction) => transaction.date.startsWith(currentMonth))
          .reduce((sum, transaction) => sum + transaction.total, 0);
        setMonthlyRevenue(monthSales);

        setTableOccupancy("25 Tables");
      } catch (err) {
        console.error("Error fetching dashboard data:", err.message);
        setError("Failed to load dashboard data. Please try again.");
        setSnackbarMessage("Failed to load dashboard data. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const monthRange = () => {
    const start = new Date();
    start.setDate(1);
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
    return `${start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        overflowY: 'auto',
        bgcolor: '#000000',
        p: { xs: 1, sm: 1.5, md: 2, lg: 3, xl: 4 },
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress sx={{ color: '#f15a22', size: { xs: 24, sm: 30, md: 36 } }} />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Typography sx={{ 
            color: 'red', 
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem', lg: '1.5rem' } 
          }}>
            {error}
          </Typography>
        </Box>
      ) : (
        <Grid
          container
          spacing={{ xs: 0.5, sm: 1, md: 1.5, lg: 2, xl: 3 }} 
          sx={{
            flexGrow: 1,
            width: '100%',
            m: 0,
          }}
        >
          {/* First row - Metric Cards */}
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Daily Sales"
              value={`$${dailySales.toFixed(2)}`}
              date={todayDate}
              type="sales"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Monthly Revenue"
              value={`$${monthlyRevenue.toFixed(2)}`}
              date={monthRange()}
              type="revenue"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <MetricCard
              title="Table Occupancy"
              value={tableOccupancy}
              date="Current Status"
              type="tables"
            />
          </Grid>

          {/* Second row - Popular Items */}
          <Grid item xs={12}>
            <PopularItem title="Popular Dish" />
          </Grid>

          {/* Third row - Sales Chart */}
          <Grid item xs={12}>
            <SalesChart />
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ 
            width: { xs: '90%', sm: 'auto' },
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;