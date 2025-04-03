import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';

const RightColumn = ({ toggleDrawer, refreshKey }) => {
  const [hasPosReport, setHasPosReport] = useState(false);
  const [hasStartingAmount, setHasStartingAmount] = useState(false);
  const [hasFloatEntry, setHasFloatEntry] = useState(false);

  const checkPosReport = async () => {
    const employeeName = localStorage.getItem('employeeName');
    if (employeeName) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=active`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }

        const data = await response.json();
        console.log('Fetched PosReport data:', data);
        if (data.length > 0) {
          const startingAmountSet = data[0].startingAmount > 0;
          const floatEntrySet = data[0].floatEntry > 0;
          console.log('Starting Amount:', data[0].startingAmount, 'Float Entry:', data[0].floatEntry);
          setHasPosReport(true);
          setHasStartingAmount(startingAmountSet);
          setHasFloatEntry(floatEntrySet);
        } else {
          console.log('No active PosReport found');
          setHasPosReport(false);
          setHasStartingAmount(false);
          setHasFloatEntry(false);
        }
      } catch (error) {
        console.error('Error checking posReport:', error.message);
        setHasPosReport(false);
        setHasStartingAmount(false);
        setHasFloatEntry(false);
      }
    } else {
      console.log('No employeeName in localStorage');
    }
  };

  useEffect(() => {
    console.log('Refreshing with refreshKey:', refreshKey);
    checkPosReport();
  }, [refreshKey]);

  const tasks = [
    'STARTING AMOUNT',
    'SYSTEM HEALTH CHECK',
    'PRINT X REPORT',
    'PRINT Z REPORT',
    'DATABASE CONNECTION STATUS',
    'FLOAT ENTRY',
    'OPEN DRAWER',
  ];

  return (
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
          TASKS
        </Typography>
        <Divider sx={{ borderColor: '#808080', margin: '3px auto', width: '0.65' }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {tasks.map((task) => {
            let isDisabled = false;
            if (task === 'STARTING AMOUNT') {
              isDisabled = hasStartingAmount;
            } else if (task === 'FLOAT ENTRY') {
              isDisabled = !hasPosReport || hasFloatEntry;
            }

            return (
              <Button
                key={task}
                onClick={toggleDrawer(task)}
                disabled={isDisabled}
                sx={{
                  backgroundColor: isDisabled ? '#666' : '#f15a22',
                  color: 'white',
                  padding: '20px',
                  textTransform: 'none',
                  borderRadius: 2,
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  minHeight: '120px',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: isDisabled ? '#666' : '#d14c1b',
                    boxShadow: !isDisabled ? '0 4px 10px rgba(0, 0, 0, 0.3)' : 'none',
                    transform: !isDisabled ? 'scale(1.1)' : 'none',
                  },
                  transition: 'transform 0.15s ease-in-out',
                  opacity: isDisabled ? 0.6 : 1,
                }}
              >
                {task}
              </Button>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

export default RightColumn;