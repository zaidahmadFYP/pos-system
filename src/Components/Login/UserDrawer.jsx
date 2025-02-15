import React from 'react';
import { Drawer, Box, Typography } from '@mui/material';
import UserCard from './UserCard';

const UserDrawer = ({ open, toggleDrawer, users, onSelectUser }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer}
      sx={{
        width: '30%',
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '30%',
          backgroundColor: '#121212',
          color: '#fff',
          borderRadius: '12px 0 0 12px',
          transition: 'transform 0.2s ease-in-out',
        },
      }}
    >
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h6" sx={{ color: '#fff', marginBottom: '20px' }}>
          Select User:
        </Typography>

        {users.map((user) => (
          <UserCard key={user.email} user={user} onSelect={onSelectUser} />
        ))}
      </Box>
    </Drawer>
  );
};

export default UserDrawer;
