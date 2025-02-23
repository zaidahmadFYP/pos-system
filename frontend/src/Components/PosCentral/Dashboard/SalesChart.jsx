import React from 'react';
import { Card, Box, Typography, ToggleButton, ToggleButtonGroup, Button } from '@mui/material';
import { Download } from '@mui/icons-material';
import { Line } from 'react-chartjs-2'; // Using Chart.js for the graph
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SalesChart = () => {
  const [view, setView] = React.useState('monthly');

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Sales',
        data: [65, 59, 80, 81, 56, 55, 40], // Example data
        borderColor: '#f15a22',
        backgroundColor: 'rgba(241, 90, 34, 0.2)',
        tension: 0.4,
      },
    ],
  };

  return (
    <Card
      sx={{
        bgcolor: '#1a1a1a',
        p: 2,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        color: '#fff',
        maxWidth: 10000, // Adjust the max width of the card
        height: 400, // Set a fixed height for the card
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
            onChange={(e, newView) => setView(newView)}
            sx={{
              '& .MuiToggleButton-root': {
                color: '#fff',
                fontWeight: 500,
                '&.Mui-selected': {
                  bgcolor: '#f15a22', // Using the new color
                  color: '#fff',
                  '&:hover': {
                    bgcolor: '#e14f1e', // A darker shade on hover
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
            sx={{
              color: '#fff',
              borderColor: '#f15a22', // Using the new color for the border
              '&:hover': {
                borderColor: '#fff',
                backgroundColor: '#f15a22', // Using the new color for hover effect
              },
              fontWeight: 600,
              padding: '6px 12px',
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Graph Placeholder */}
      <Box
        sx={{
          flex: 1, // Allow the chart container to take available space
          width: '100%',
          height: '200px', // Adjust the height of the chart container
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex', // Center the chart vertically and horizontally
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Line data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
      </Box>
    </Card>
  );
};

export default SalesChart;
