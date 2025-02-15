import React from 'react';
import { Box, Grid } from '@mui/material';
import MetricCard from './MetricCards';
import PopularItem from './PopularItem';
import SalesChart from './SalesChart';

const Dashboard = () => {
  return (
    <Box
      sx={{
        height: 'auto', // Full viewport height
        overflow: 'hidden', // Disable both vertical and horizontal scrolling
        bgcolor: '#000000',
        p: 2,
        display: 'flex',
        flexDirection: 'column', // Ensure the content is stacked vertically
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          flexGrow: 1, // Make the grid container grow to fill the available space
          overflow: 'hidden', // Prevent scrolling inside the grid
        }}
      >
        {/* First Row - Metric Cards */}
        <Grid item xs={12} md={4} sx={{ height: 'auto' }}>
          <MetricCard
            title="Daily Sales"
            value="$2k"
            date="9 February 2024"
            type="sales"
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: 'auto' }}>
          <MetricCard
            title="Monthly Revenue"
            value="$55k"
            date="1 Jan - 1 Feb"
            type="revenue"
          />
        </Grid>
        <Grid item xs={12} md={4} sx={{ height: 'auto' }}>
          <MetricCard
            title="Table Occupancy"
            value="25 Tables"
            date="Current Status"
            type="tables"
          />
        </Grid>

        {/* Second Row - Full-width Popular Dish */}
        <Grid item xs={12} sx={{ height: 'auto' }}>
          <PopularItem title="Popular Dish" />
        </Grid>

        {/* Third Row - Sales Chart */}
        <Grid item xs={12} sx={{ height: 'auto' }}>
          <SalesChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
