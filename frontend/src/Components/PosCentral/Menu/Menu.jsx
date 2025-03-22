import React, { useState } from 'react';
import { Box, Typography, IconButton, Badge, Divider, Avatar } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AllItemsSection from './AllItemsSection';
import CategoryTiles from './CategoryTile';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#000000',
        height: '100vh', // Full viewport height
        color: 'white',
        overflow: 'hidden', // Prevent scrolling
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Profile and Notification at the top right */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', alignItems: 'center' }}>
        <IconButton>
          <Badge badgeContent={0} color="error">
            <NotificationsIcon sx={{ color: '#f15a22' }} />
          </Badge>
        </IconButton>
        <Divider orientation="vertical" flexItem sx={{ mt: 2.5, height: 20, mx: 1, backgroundColor: '#f15a22' }} />
        <IconButton>
          <Avatar
            alt="Profile"
            src="https://via.placeholder.com/40"
            sx={{
              width: 40,
              height: 40,
              border: '2px solid #f15a22',
            }}
          />
        </IconButton>
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5">Menu</Typography>
      </Box>

      {/* Categories Heading */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Categories</Typography>
      </Box>

      {/* Category Tiles */}
      <CategoryTiles setSelectedCategory={setSelectedCategory} selectedCategory={selectedCategory} />

      {/* All Items Section */}
      <AllItemsSection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
    </Box>
  );
};

export default Menu;