import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Typography, ButtonBase } from '@mui/material';
import GroceryIcon from '@mui/icons-material/Store';
import BeveragesIcon from '@mui/icons-material/LocalDrink';
import PersonalCareIcon from '@mui/icons-material/Spa';
import HouseholdItemsIcon from '@mui/icons-material/LocalLaundryService';
import ElectronicsIcon from '@mui/icons-material/Devices';
import StationeryIcon from '@mui/icons-material/Create';
import HealthIcon from '@mui/icons-material/HealthAndSafety';

const iconMap = {
  'Grocery': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Beverages': <BeveragesIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Personal Care': <PersonalCareIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Household Items': <HouseholdItemsIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Electronics': <ElectronicsIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Stationery': <StationeryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Health & Wellness': <HealthIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Starters': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Pizza Deals': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Burgerz': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Cheezy Treats': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Special Pizza': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Side Order': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Somewhat Sooper': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Pasta': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Somewhat Local': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Sweetness': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Platters & Wraps': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Drinks': <BeveragesIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Addons': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Desserts': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
  'Amazing': <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />,
};

const CategoryTiles = ({ setSelectedCategory = () => {}, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/menu/categories', {
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
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleTileClick = (category) => {
    console.log('Clicked category:', category);
    console.log('Current selectedCategory:', selectedCategory);
    // Toggle selection: if the same category is clicked, deselect it
    const categoryId = category.categoryId || category._id || category.id;
    const selectedCategoryId = selectedCategory ? (selectedCategory.categoryId || selectedCategory._id || selectedCategory.id) : null;
    if (selectedCategory && selectedCategoryId === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  if (loading) {
    return <Typography>Loading categories...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (categories.length === 0) {
    return <Typography>No categories available.</Typography>;
  }

  return (
    <Box sx={{ overflow: 'hidden', flexShrink: 0 }}>
      <Grid container spacing={2}>
        {categories.map((category) => {
          // Log the category and selectedCategory for debugging
          console.log('Rendering category:', category);
          console.log('Comparing with selectedCategory:', selectedCategory);
          // Handle different possible ID properties
          const categoryId = category.categoryId || category._id || category.id;
          const selectedCategoryId = selectedCategory ? (selectedCategory.categoryId || selectedCategory._id || selectedCategory.id) : null;
          const isSelected = selectedCategory && selectedCategoryId === categoryId;
          console.log('Category ID:', categoryId, 'Selected Category ID:', selectedCategoryId, 'Is this category selected?', isSelected);

          return (
            <Grid item key={categoryId || Math.random()}>
              <ButtonBase
                onClick={() => handleTileClick(category)}
                sx={{
                  width: 150,
                  height: 150,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  borderRadius: '16px',
                  transition: 'transform 0.15s ease-in-out',
                  border: isSelected ? '2px solid #f15a22' : 'none',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    cursor: 'pointer',
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
                  <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                    {iconMap[category.name] || <GroceryIcon sx={{ fontSize: 30, color: '#f15a22' }} />}
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: 25, left: 10, right: 10 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'white',
                        fontSize: '0.9rem',
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
                  <Box sx={{ position: 'absolute', bottom: 5, left: 10 }}>
                    <Typography variant="body2" sx={{ color: '#808080', fontSize: '0.8rem' }}>
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