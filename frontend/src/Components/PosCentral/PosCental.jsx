import React from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';

const PosCentral = () => {
  return (
    <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#000' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Outlet /> {/* This will render the nested routes */}
      </Box>
    </Box>
  );
};

export default PosCentral;