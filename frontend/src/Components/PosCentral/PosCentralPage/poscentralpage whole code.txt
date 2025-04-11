import React from 'react';
import { Box, Typography, Paper, Button, Divider } from '@mui/material';

const PosCentralPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#121212',
        p: 3, // Margin equivalent
        color: 'white',
        overflowY: 'auto', // Enable vertical scrolling
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: 'auto', ml: 1, mr: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 2.1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f15a22', fontFamily:'TanseekModernW20-bold' }}>
            POS CENTRAL HUB
          </Typography>
        </Box>



        {/* 3 Column Layout */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Column 1 (Left) */}
          <Box sx={{ flex: '0 0 600px', p: 2, textAlign: 'left', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {/* Paper Component in the Center of Column 1 */}
            <Paper
              sx={{
                width: 600,
                height: 600,
                backgroundColor: '#1f1f1f',
                borderRadius: 3, // Rounded corners
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Adding a shadow effect
              }}
            >
              {/* Image in the Paper */}
              <img
                src="/images/loop_banner.png" // Make sure to place the image in the public/images folder
                alt="Content"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: '0px 4px 20px rgba(255, 255, 255, 0.1)', // Adding subtle white shadow
                }}
              />
            </Paper>
          </Box>

          {/* Column 2 (Center) */}
          <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
            {/* Paper component containing POS ACTIONS and buttons */}
            <Paper
              sx={{
                backgroundColor: '#1f1f1f',
                borderRadius: 3, // Rounded corners
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                height: '100%', // Stretch paper to take full height of column
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Adding shadow to the paper
              }}
            >
              {/* POS ACTIONS Heading inside the Paper */}
              <Typography variant="h5" sx={{ color: '#f15a22', fontWeight: 'bold', fontFamily:'Cocon' }}>
                POS ACTIONS
              </Typography>

              <Divider sx={{ borderColor: '#808080', margin: '3px auto', width: '0.65' }} />

              {/* POS Actions Buttons */}
              <Button
                sx={{
                  backgroundColor: '#f15a22',
                  color: 'white',
                  padding: '16px',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#d14c1b',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)', // Hover shadow effect
                    transform: 'scale(1.1)', // Expanding effect
                  },
                  fontWeight: 'bold',
                  minWidth: '200px', // Ensuring buttons are consistently sized
                  transition: 'transform 0.15s ease-in-out', // Transition for smooth expand effect
                }}
              >
                SELECT HARDWARE STATION
              </Button>
              <Button
                sx={{
                  backgroundColor: '#f15a22',
                  color: 'white',
                  padding: '16px',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#d14c1b',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.1)',
                  },
                  fontWeight: 'bold',
                  minWidth: '200px',
                  transition: 'transform 0.15s ease-in-out',
                }}
              >
                SHOW JOURNAL
              </Button>
              <Button
                sx={{
                  backgroundColor: '#f15a22',
                  color: 'white',
                  padding: '16px',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#d14c1b',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.1)',
                  },
                  fontWeight: 'bold',
                  minWidth: '200px',
                  transition: 'transform 0.15s ease-in-out',
                }}
              >
                SUSPEND TRANSACTION
              </Button>
              <Button
                sx={{
                  backgroundColor: '#f15a22',
                  color: 'white',
                  padding: '16px',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#d14c1b',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    transform: 'scale(1.1)',
                  },
                  fontWeight: 'bold',
                  minWidth: '200px',
                  transition: 'transform 0.15s ease-in-out',
                }}
              >
                RECALL TRANSACTION
              </Button>
            </Paper>
          </Box>

          {/* Column 3 (Right) */}
          <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
            {/* Paper component containing TASKS and buttons */}
            <Paper
              sx={{
                backgroundColor: '#1f1f1f',
                borderRadius: 3, // Rounded corners
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                height: '100%',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)', // Adding shadow to paper
              }}
            >
              {/* TASKS Heading inside the Paper */}
              <Typography variant="h5" sx={{ color: '#f15a22', fontWeight: 'bold', fontFamily:'Cocon' }}>
                TASKS
              </Typography>

              <Divider sx={{ borderColor: '#808080', margin: '3px auto', width: '0.65' }} />

              {/* 2 Column Layout for Tasks */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)', // 2 equal columns
                  gap: 2,
                }}
              >
                {/* Task Buttons */}
                <Button
                  sx={{
                    backgroundColor: '#f15a22',
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
                      backgroundColor: '#d14c1b',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transform: 'scale(1.1)', // Expanding effect
                    },
                    transition: 'transform 0.15s ease-in-out',
                  }}
                >
                  STARTING AMOUNT
                </Button>
                <Button
                  sx={{
                    backgroundColor: '#f15a22',
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
                      backgroundColor: '#d14c1b',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.15s ease-in-out',
                  }}
                >
                  SYSTEM HEALTH CHECK
                </Button>
                <Button
                  sx={{
                    backgroundColor: '#f15a22',
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
                      backgroundColor: '#d14c1b',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.15s ease-in-out',
                  }}
                >
                  PRINT X REPORT
                </Button>
                <Button
                  sx={{
                    backgroundColor: '#f15a22',
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
                      backgroundColor: '#d14c1b',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.15s ease-in-out',
                  }}
                >
                  PRINT Z REPORT
                </Button>
                <Button
                  sx={{
                    backgroundColor: '#f15a22',
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
                      backgroundColor: '#d14c1b',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.15s ease-in-out',
                  }}
                >
                  DATABASE CONNECTION STATUS
                </Button>
                <Button
                  sx={{
                    backgroundColor: '#f15a22',
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
                      backgroundColor: '#d14c1b',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.15s ease-in-out',
                  }}
                >
                  FLOAT ENTRY
                </Button>
                <Button
                  sx={{
                    backgroundColor: '#f15a22',
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
                      backgroundColor: '#d14c1b',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'transform 0.15s ease-in-out',
                  }}
                >
                  OPEN DRAWER
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PosCentralPage;
