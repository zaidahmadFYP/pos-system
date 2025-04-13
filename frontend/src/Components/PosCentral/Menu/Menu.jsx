import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import AllItemsSection from './AllItemsSection/AllItemsSection';
import CategoryTiles from './CategoryTile/CategoryTile';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingItems, setLoadingItems] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  // Track window resize for responsive control
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine sizes based on viewport width
  const getResponsiveSize = () => {
    if (windowWidth < 600) return 'xs';
    if (windowWidth < 960) return 'sm';
    if (windowWidth <= 1366) return 'md-compact';
    return 'md';
  };

  const size = getResponsiveSize();
  const isLoading = loadingCategories || loadingItems;
  const isCompactHeight = windowHeight <= 768;

  // Dynamic padding based on screen size
  const getPadding = () => {
    switch (size) {
      case 'xs': return 1;
      case 'sm': return 1.5;
      case 'md-compact': return 2;
      default: return 2.5;
    }
  };

  // Dynamic font sizes
  const getFontSize = (type) => {
    switch (type) {
      case 'title':
        return size === 'xs' ? '1.1rem' : 
               size === 'sm' ? '1.25rem' : 
               size === 'md-compact' ? '1.4rem' : '1.5rem';
      case 'subtitle':
        return size === 'xs' ? '0.9rem' : 
               size === 'sm' ? '1rem' : 
               size === 'md-compact' ? '1.1rem' : '1.25rem';
      default:
        return size === 'md-compact' ? '0.9rem' : '0.95rem';
    }
  };

  // Reduced vertical spacing to fit content
  const getVerticalSpacing = (type) => {
    if (isCompactHeight) {
      switch (type) {
        case 'header': return size === 'xs' ? 1 : size === 'sm' ? 1.5 : 2;
        case 'categories': return size === 'xs' ? 0.5 : 1;
        case 'section': return size === 'xs' ? 1 : 1.5;
        default: return 1;
      }
    } else {
      switch (type) {
        case 'header': return size === 'xs' ? 1.5 : size === 'sm' ? 2 : 2.5;
        case 'categories': return size === 'xs' ? 1 : size === 'sm' ? 1.5 : 2;
        case 'section': return size === 'xs' ? 1.5 : 2;
        default: return 1.5;
      }
    }
  };

  return (
    <Box
      sx={{
        p: getPadding(),
        backgroundColor: '#000000',
        height: '100vh', // Fixed height
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        maxWidth: '100vw',
        overflow: 'hidden', // Prevent scrolling
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <CircularProgress 
            sx={{ color: '#f15a22' }} 
            size={size === 'xs' ? 40 : size === 'sm' || size === 'md-compact' ? 50 : 60} 
          />
        </Box>
      )}

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: getVerticalSpacing('header'),
          width: '100%',
          borderBottom: '2px solid #333333',
          paddingBottom: 0.5,
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            fontSize: getFontSize('title'),
            fontWeight: 'bold',
            color: '#f15a22',
          }}
        >
          Menu
        </Typography>
      </Box>

      {/* Categories heading */}
      <Box sx={{ mb: getVerticalSpacing('categories') }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: getFontSize('subtitle'),
            fontWeight: 'medium',
            borderLeft: '3px solid #f15a22',
            paddingLeft: 1,
          }}
        >
          Categories
        </Typography>
      </Box>

      {/* Category tiles */}
      <Box sx={{ mb: getVerticalSpacing('section') }}>
        <CategoryTiles
          setSelectedCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          setLoadingCategories={setLoadingCategories}
          screenSize={size}
          isCompactHeight={isCompactHeight}
        />
      </Box>

      {/* All Items heading */}
      <Box sx={{ mb: getVerticalSpacing('categories') }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontSize: getFontSize('subtitle'),
            fontWeight: 'medium',
            borderLeft: '3px solid #f15a22',
            paddingLeft: 1,
          }}
        >
          All Items {selectedCategory ? `in ${selectedCategory.name}` : ''}
        </Typography>
      </Box>

      {/* Items section */}
      <Box 
        sx={{ 
          flex: 1, // Take remaining space
          bgcolor: 'rgba(30, 30, 30, 0.3)',
          borderRadius: 1,
          p: size === 'xs' ? 1 : size === 'sm' ? 1.5 : 2,
          overflow: 'hidden', // Prevent internal scrolling
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AllItemsSection
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setLoadingItems={setLoadingItems}
          screenSize={size}
          isCompactHeight={isCompactHeight}
        />
      </Box>
    </Box>
  );
};

export default Menu;