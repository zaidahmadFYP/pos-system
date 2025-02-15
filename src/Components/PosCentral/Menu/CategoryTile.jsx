import React from 'react';
import { Grid, Paper, Box, Typography, ButtonBase } from '@mui/material';
import GroceryIcon from '@mui/icons-material/Store'; // Grocery icon
import BeveragesIcon from '@mui/icons-material/LocalDrink'; // Beverages icon
import PersonalCareIcon from '@mui/icons-material/Spa'; // Personal Care icon 
import HouseholdItemsIcon from '@mui/icons-material/LocalLaundryService'; // Household Items icon
import ElectronicsIcon from '@mui/icons-material/Devices'; // Electronics icon
import StationeryIcon from '@mui/icons-material/Create'; // Stationery icon
import HealthIcon from '@mui/icons-material/HealthAndSafety'; // Health & Wellness icon

const tileData = [
  { title: 'Grocery', icon: <GroceryIcon sx={{ fontSize: 40, color: '#f15a22' }} />, items: 20 },
  { title: 'Beverages', icon: <BeveragesIcon sx={{ fontSize: 40, color: '#f15a22' }} />, items: 20 },
  { title: 'Personal Care', icon: <PersonalCareIcon sx={{ fontSize: 40, color: '#f15a22' }} />, items: 20 },
  { title: 'Household Items', icon: <HouseholdItemsIcon sx={{ fontSize: 40, color: '#f15a22' }} />, items: 20 },
  { title: 'Electronics', icon: <ElectronicsIcon sx={{ fontSize: 40, color: '#f15a22' }} />, items: 20 },
  { title: 'Stationery', icon: <StationeryIcon sx={{ fontSize: 40, color: '#f15a22' }} />, items: 20 },
  { title: 'Health & Wellness', icon: <HealthIcon sx={{ fontSize: 40, color: '#f15a22' }} />, items: 20 },
];

const CategoryTiles = () => {
  return (
    <Grid container spacing={2}>
      {tileData.map((tile, index) => (
        <Grid item key={index}>
          <ButtonBase
            onClick={() => alert(`Clicked on ${tile.title}`)} 
            sx={{
              width: 180,
              height: 180,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              borderRadius: '16px',
              transition: 'transform 0.15s ease-in-out', 
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
              {/* Icon */}
              <Box sx={{ position: 'absolute', top: 15, right: 15 }}>
                {tile.icon}
              </Box>

              {/* Heading */}
              <Box sx={{ position: 'absolute', bottom: 30, left: 10 }}>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {tile.title}
                </Typography>
              </Box>

              {/* Sub-heading for 20 items */}
              <Box sx={{ position: 'absolute', bottom: 10, left: 10 }}>
                <Typography variant="body2" sx={{ color: '#808080' }}>
                  {tile.items} items
                </Typography>
              </Box>
            </Paper>
          </ButtonBase>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryTiles;
