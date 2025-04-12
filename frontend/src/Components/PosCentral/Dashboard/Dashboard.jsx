import React, { useState, useEffect } from 'react';
import { Box, Grid, Snackbar, Alert, CircularProgress, Typography } from '@mui/material';
import MetricCard from './MetricCards';
import PopularItem from './PopularItem';
import SalesChart from './SalesChart';

const Dashboard = () => {
  const [dailySales, setDailySales] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [tableOccupancy, setTableOccupancy] = useState("25 Tables"); // Placeholder
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
        // Fetch transactions
        const transactionsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/orders`
        );
        if (!transactionsResponse.ok) {
          throw new Error(`Failed to fetch transactions (Status: ${transactionsResponse.status})`);
        }
        const transactions = await transactionsResponse.json();

        // Calculate Daily Sales (current day)
        const today = new Date().toISOString().split("T")[0];
        const todaySales = transactions
          .filter((transaction) => transaction.date.startsWith(today))
          .reduce((sum, transaction) => sum + transaction.total, 0);
        setDailySales(todaySales);

        // Calculate Monthly Revenue (current month)
        const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-04"
        const monthSales = transactions
          .filter((transaction) => transaction.date.startsWith(currentMonth))
          .reduce((sum, transaction) => sum + transaction.total, 0);
        setMonthlyRevenue(monthSales);

        // Table Occupancy (placeholder, as no API provides this)
        // If you have an API or logic to calculate table occupancy, it can be added here
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
        overflow: 'hidden',
        bgcolor: '#000000',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <CircularProgress sx={{ color: '#f15a22' }} />
        </Box>
      ) : error ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
          <Typography sx={{ color: 'red' }}>{error}</Typography>
        </Box>
      ) : (
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
          }}
        >
          {/* First Row - Metric Cards */}
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Daily Sales"
              value={`$${dailySales.toFixed(2)}`}
              date={todayDate}
              type="sales"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Monthly Revenue"
              value={`$${monthlyRevenue.toFixed(2)}`}
              date={monthRange()}
              type="revenue"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MetricCard
              title="Table Occupancy"
              value={tableOccupancy}
              date="Current Status"
              type="tables"
            />
          </Grid>

          {/* Second Row - Full-width Popular Dish */}
          <Grid item xs={12}>
            <PopularItem title="Popular Dish" />
          </Grid>

          {/* Third Row - Sales Chart */}
          <Grid item xs={12}>
            <SalesChart />
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;