import React from 'react';
import { Box, Grid } from '@mui/material';
import MetricCard from './MetricCards';
import PopularItem from './PopularItem';
import SalesChart from './SalesChart';

const Dashboard = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh', // Ensure full viewport height
        overflow: 'hidden', // Disable scrolling on the main container
        bgcolor: '#000000',
        p: 2,
        display: 'flex',
        flexDirection: 'column', // Stack content vertically
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1, // Allow the grid to fill available space
        }}
      >
        {/* First Row - Metric Cards */}
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Daily Sales"
            value="$2k"
            date="9 February 2024"
            type="sales"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Monthly Revenue"
            value="$55k"
            date="1 Jan - 1 Feb"
            type="revenue"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard
            title="Table Occupancy"
            value="25 Tables"
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
    </Box>
  );
};

export default Dashboard;
