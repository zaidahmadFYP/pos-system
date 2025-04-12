import React from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';

const CenterColumn = ({ toggleDrawer, handleNavigation }) => (
  <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
    <Paper
      sx={{
        backgroundColor: '#1f1f1f',
        borderRadius: 3,
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        height: '100%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography variant="h5" sx={{ color: '#f15a22', fontWeight: 'bold', fontFamily: 'Cocon' }}>
        POS ACTIONS
      </Typography>
      <Divider sx={{ borderColor: '#808080', margin: '3px auto', width: '0.65' }} />
      {[
        { label: 'SELECT HARDWARE STATION', action: toggleDrawer('SELECT HARDWARE STATION') },
        { label: 'SHOW JOURNAL', action: () => handleNavigation('show-journal') }, // Updated path
        { label: 'SUSPEND TRANSACTION', action: () => handleNavigation('suspend-transaction') }, // Updated path
        { label: 'RECALL TRANSACTION', action: () => handleNavigation('recall-transaction') }, // Updated path
      ].map(({ label, action }) => (
        <Button
          key={label}
          onClick={action}
          sx={{
            backgroundColor: '#f15a22',
            color: 'white',
            padding: '16px',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': { backgroundColor: '#d14c1b', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', transform: 'scale(1.1)' },
            fontWeight: 'bold',
            minWidth: '200px',
            transition: 'transform 0.15s ease-in-out',
          }}
        >
          {label}
        </Button>
      ))}
    </Paper>
  </Box>
);

export default CenterColumn;