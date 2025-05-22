import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';

const PosCentral = () => {
  const sidebarWidth = { xs: 80, sm: 100 }; // Sidebar width
  const spacing = { xs: 8, sm: 12 }; // Reduced spacing for a more "normal" gap

  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#000' }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: {
            xs: `${sidebarWidth.xs + spacing.xs}px`, // Add reduced spacing to the sidebar width
            sm: `${sidebarWidth.sm + spacing.sm}px`,
          },
          width: {
            xs: `calc(100% - ${sidebarWidth.xs + spacing.xs}px)`, // Adjust width to account for spacing
            sm: `calc(100% - ${sidebarWidth.sm + spacing.sm}px)`,
          },
          height: '100vh',
          overflow: 'hidden', // Prevent scrolling in the main content
          paddingLeft: { xs: 0, sm: 1 }, // Reduced padding for visual spacing
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default PosCentral;