import React from 'react';
import { TextField, Button, InputAdornment, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const UserForm = ({ selectedUser, password, setPassword, onChangeUser, handleLogin, loading }) => {

  // Handle the Enter key press to trigger login
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin(); // Trigger login on Enter
    }
  };

  return (
    <>
      <TextField
        label="Username"
        value={selectedUser.name}
        disabled
        fullWidth
        sx={{
          marginBottom: '16px',
          backgroundColor: '#2b2b2b',
          '& .MuiInputBase-input': {
            color: '#fff !important',
          },
          '& .MuiInputLabel-root': {
            color: '#fff !important',
          },
          '& .Mui-disabled': {
            '-webkit-text-fill-color': '#fff !important',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <LockIcon sx={{ color: '#fff' }} />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { color: '#fff' },
          shrink: true,
        }}
      />

      <TextField
        label="Email"
        value={selectedUser.email}
        disabled
        fullWidth
        sx={{
          marginBottom: '16px',
          backgroundColor: '#2b2b2b',
          '& .MuiInputBase-input': {
            color: '#fff !important',
          },
          '& .MuiInputLabel-root': {
            color: '#fff !important',
          },
          '& .Mui-disabled': {
            '-webkit-text-fill-color': '#fff !important',
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <LockIcon sx={{ color: '#fff' }} />
            </InputAdornment>
          ),
        }}
        InputLabelProps={{
          style: { color: '#fff' },
          shrink: true,
        }}
      />

      <TextField
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown} // Listen for Enter key press
        type="password"
        fullWidth
        sx={{
          marginBottom: '16px',
          backgroundColor: '#2b2b2b',
          '& .MuiInputBase-input': {
            color: '#fff !important',
          },
          '& .MuiInputLabel-root': {
            color: '#fff !important',
          },
        }}
        InputProps={{
          style: { color: '#fff' },
        }}
        InputLabelProps={{
          style: { color: '#fff' },
          shrink: true,
        }}
      />

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
        onClick={handleLogin}
        disabled={loading} // Disable the button while loading
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#fff' }} />
        ) : (
          'LOGIN'
        )}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          marginTop: '12px',
          color: '#f15a22',
          fontWeight: 'bold',
          borderColor: '#f15a22',
          borderRadius: '24px',
          '&:hover': {
            borderColor: '#f15a22',
            backgroundColor: '#f15a22',
            color: '#000',
          },
        }}
        onClick={onChangeUser}
      >
        Change User
      </Button>
    </>
  );
};

export default UserForm;
