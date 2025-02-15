import React, { useState } from 'react';
import { Box, Paper, Typography, Snackbar, Alert, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import UserForm from './UserForm';
import UserDrawer from './UserDrawer';

const users = [
  { name: 'Omer Shahzad', email: 'omershahzad1000@loop.com', password: 'omer123' },
  { name: 'Zaid Ahmad', email: 'zaidahmad123@loop.com', password: 'zaid123' },
  { name: 'Muhammad Shariq Shoaib', email: 'shariqshoaib10@loop.com', password: 'shariq123' },
  { name: 'Muhammad Adeel Sarwar', email: 'adeelsarwar90@loop.com', password: 'adeel123' },
];

const Login = () => {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const navigate = useNavigate(); // Hook for navigation

  const toggleDrawer = () => setOpen(!open);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setPassword('');
    setOpen(false);
  };

  const handleChangeUser = () => {
    setSelectedUser(null);
    setPassword('');
    toggleDrawer();
  };

  const handleLogin = () => {
    // First, show Snackbar for successful login
    setSnackbarOpen(true);

    // Simulate login delay
    setLoading(true);
    setTimeout(() => {
      setLoading(false); // Stop loading after simulated delay
      setTimeout(() => {
        navigate('/loop'); // Navigate to the main page after a successful login
      }, 500); // Small delay to ensure the snackbar is visible
    }, 2000); // Simulate network request delay of 2 seconds
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url("/images/signin_background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: open ? 'blur(5px)' : 'none',
        transition: 'filter 0.3s ease',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            backgroundColor: '#1f1f1f',
            borderRadius: '24px',
            padding: '32px 48px',
            width: '560px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontFamily: 'Cocon',
              color: '#f15a22',
              fontWeight: 'bold',
              marginBottom: '16px',
            }}
          >
            LOOP POS
          </Typography>

          {selectedUser ? (
            <UserForm
              selectedUser={selectedUser}
              password={password}
              setPassword={setPassword}
              onChangeUser={handleChangeUser}
              handleLogin={handleLogin}
              loading={loading}
            />
          ) : (
            <>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  color: '#fff',
                  marginBottom: '24px',
                  fontWeight: '300',
                }}
              >
                Please select a user to continue
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#f15a22',
                  color: '#000',
                  fontWeight: 'bold',
                  padding: '14px',
                  borderRadius: '24px',
                  '&:hover': {
                    backgroundColor: '#f15a22',
                  },
                }}
                onClick={toggleDrawer}
              >
                Select User
              </Button>
            </>
          )}
        </Paper>
      </Box>

      <UserDrawer open={open} toggleDrawer={toggleDrawer} users={users} onSelectUser={handleUserSelect} />

      {/* Snackbar for successful login */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Successful Login!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
