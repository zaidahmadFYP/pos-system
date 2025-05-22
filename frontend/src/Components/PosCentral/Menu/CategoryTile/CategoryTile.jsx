import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Typography, ButtonBase, useMediaQuery, useTheme } from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CakeIcon from '@mui/icons-material/Cake';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StarIcon from '@mui/icons-material/Star';

const iconMap = {
  'Starters': <RestaurantIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Pizza Deals': <LocalPizzaIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Burgerz': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Cheezy Treats': <EmojiFoodBeverageIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Special Pizza': <LocalPizzaIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Side Order': <RestaurantMenuIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Somewhat Sooper': <StarIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Pasta': <DinnerDiningIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Somewhat Local': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Sweetness': <CakeIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Platters & Wraps': <DinnerDiningIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Drinks': <LocalDrinkIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Addons': <RestaurantMenuIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Desserts': <CakeIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Amazing': <StarIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Grocery': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Beverages': <LocalDrinkIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Personal Care': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Household Items': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Electronics': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Stationery': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Health & Wellness': <FastfoodIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
};

const CategoryTiles = ({ setSelectedCategory = () => {}, selectedCategory, setLoadingCategories }) => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const theme = useTheme();
  
  // Define a specific breakpoint for 1366px width
  const isSmallScreen = useMediaQuery('(max-width:1366px)');
  // Define even smaller screen
  const isVerySmallScreen = useMediaQuery('(max-width:1100px)');
  
  // Determine tile size based on screen size
  const getTileSize = () => {
    if (isVerySmallScreen) return 90; // Very small screens
    if (isSmallScreen) return 110;    // For 1366x768
    return 150;                      // Default/larger screens
  };
  
  const tileSize = getTileSize();
  
  // Scale icon size proportionally to tile size
  const getIconSize = () => {
    return Math.round((tileSize / 150) * 40); // 40 is the original icon size
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true); // Set loading to true at the start of the fetch
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/menu/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched categories:', data);

        if (!Array.isArray(data)) {
          throw new Error('Expected an array of categories');
        }

        setCategories(data);
        setLoadingCategories(false); // Set loading to false when done
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoadingCategories(false); // Set loading to false on error
      }
    };

    fetchCategories();
  }, [setLoadingCategories]);

  const handleTileClick = (category) => {
    console.log('Clicked category:', category);
    console.log('Current selectedCategory:', selectedCategory);
    const categoryId = category.categoryId || category._id || category.id;
    const selectedCategoryId = selectedCategory ? (selectedCategory.categoryId || selectedCategory._id || selectedCategory.id) : null;
    if (selectedCategory && selectedCategoryId === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (categories.length === 0) {
    return <Typography>No categories available.</Typography>;
  }

  // Create responsive icons based on screen size
  const getResponsiveIcon = (iconName) => {
    const originalIcon = iconMap[iconName] || <FastfoodIcon sx={{ fontSize: 30, color: '#f15a22' }} />;
    // Clone the icon with updated size
    return React.cloneElement(originalIcon, {
      sx: { ...originalIcon.props.sx, fontSize: getIconSize() }
    });
  };

  // Adjust spacing based on screen size
  const getSpacing = () => {
    if (isVerySmallScreen) return 1;
    if (isSmallScreen) return 1.5;
    return 2; // Original spacing
  };

  return (
    <Box sx={{ flexShrink: 0 }}>
      <Grid container spacing={getSpacing()}>
        {categories.map((category) => {
          console.log('Rendering category:', category);
          console.log('Comparing with selectedCategory:', selectedCategory);
          const categoryId = category.categoryId || category._id || category.id;
          const selectedCategoryId = selectedCategory ? (selectedCategory.categoryId || selectedCategory._id || selectedCategory.id) : null;
          const isSelected = selectedCategory && selectedCategoryId === categoryId;
          console.log('Category ID:', categoryId, 'Selected Category ID:', selectedCategoryId, 'Is this category selected?', isSelected);

          return (
            <Grid item key={categoryId || Math.random()}>
              <ButtonBase
                onClick={() => handleTileClick(category)}
                sx={{
                  width: tileSize,
                  height: tileSize,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  borderRadius: '16px',
                  transition: 'transform 0.15s ease-in-out',
                  border: isSelected ? '2px solid #f15a22' : 'none',
                  '&:hover': {
                    transform: isSmallScreen ? 'scale(1.05)' : 'scale(1.1)', // Smaller scale effect on small screens
                    cursor: 'pointer',
                    zIndex: 1,
                  },
                }}
              >
                <Paper
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#333',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    borderRadius: '16px',
                  }}
                >
                  <Box sx={{ 
                    position: 'absolute', 
                    top: isSmallScreen ? 5 : 10, 
                    right: isSmallScreen ? 5 : 10 
                  }}>
                    {getResponsiveIcon(category.name)}
                  </Box>
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: isSmallScreen ? 20 : 25, 
                    left: isSmallScreen ? 5 : 10, 
                    right: isSmallScreen ? 5 : 10 
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'white',
                        fontSize: `${0.9 * (tileSize / 150)}rem`, // Scale font size relative to tile size
                        lineHeight: 1.2,
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {category.name || 'Unnamed Category'}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    position: 'absolute', 
                    bottom: isSmallScreen ? 3 : 5, 
                    left: isSmallScreen ? 5 : 10 
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#808080', 
                        fontSize: `${0.8 * (tileSize / 150)}rem` // Scale font size relative to tile size 
                      }}
                    >
                      {category.items ? category.items.length : 0} items
                    </Typography>
                  </Box>
                </Paper>
              </ButtonBase>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CategoryTiles;