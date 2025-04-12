import React from 'react';
import { Box, Paper } from '@mui/material';

const LeftColumn = () => (
  <Box sx={{ flex: '0 0 600px', p: 2, textAlign: 'left', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Paper
      sx={{
        width: 600,
        height: 600,
        backgroundColor: '#1f1f1f',
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <img
        src="/images/loop_banner.png"
        alt="Content"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(255, 255, 255, 0.1)',
        }}
      />
    </Paper>
  </Box>
);

export default LeftColumn;