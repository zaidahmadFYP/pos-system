import React, { useState } from 'react';
import { Box, Typography, IconButton, Badge, Divider, Avatar, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AllItemsSection from './AllItemsSection';
import CategoryTiles from './CategoryTile';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true); // Track CategoryTiles loading
  const [loadingItems, setLoadingItems] = useState(true); // Track AllItemsSection loading

  // Show loading circle if either component is loading
  const isLoading = loadingCategories || loadingItems;

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#000000',
        height: '100vh',
        color: 'white',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // For positioning the loading overlay
      }}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Semi-transparent black overlay
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensure it’s above other content
          }}
        >
          <CircularProgress sx={{ color: '#f15a22' }} size={60} />
        </Box>
      )}

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
      <CategoryTiles
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        setLoadingCategories={setLoadingCategories} // Pass callback to update loading state
      />

      {/* All Items Section */}
      <AllItemsSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setLoadingItems={setLoadingItems} // Pass callback to update loading state
      />
    </Box>
  );
};

export default Menu;