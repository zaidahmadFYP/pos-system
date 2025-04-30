import React, { useEffect, useState, useContext } from 'react';
import { Box, Paper, Typography, Snackbar, Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserForm from './UserForm';
import UserDrawer from './UserDrawer';
import { UserContext } from '../../context/UserContext'; 

const Login = () => {
  const [users, setUsers] = useState([]); // Store users from backend
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();
  const { setEmployeeName } = useContext(UserContext);

  // Fetch users from backend when component mounts
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001'; 
    axios
      .get(`${apiUrl}/api/users`, {
        params: {
          role: { $in: ['Cashier', 'Manager'] }, // Filter users by role
        },
      })
      .then((response) => {
        setUsers(response.data); // Set users from API response
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

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
    if (!selectedUser || !password) return;

    setLoading(true);

    setTimeout(() => {
      if (password === selectedUser.plainPassword) {
        setLoading(false);
        setSnackbarMessage('Successful Login!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);

        // Set employeeName in context
        const employeeName = selectedUser.displayName || selectedUser.name || 'Unknown User';
        setEmployeeName(employeeName);

        setTimeout(() => {
          navigate('/loop');
        }, 500);
      } else {
        setLoading(false);
        setSnackbarMessage('Invalid Password! Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }, 1000);
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
                sx={{ color: '#fff', marginBottom: '24px', fontWeight: '300' }}
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
                  '&:hover': { backgroundColor: '#f15a22' },
                }}
                onClick={toggleDrawer}
              >
                Select User
              </Button>
            </>
          )}
        </Paper>
      </Box>

      <UserDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        users={users}
        onSelectUser={handleUserSelect}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
