import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Orders = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleToggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const buttonStyle = {
    backgroundColor: '#FFA500',
    width: 85,
    height: 85,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center', // Ensure text is centered
    wordWrap: 'break-word', // Ensures the text wraps within the button if needed
    whiteSpace: 'normal', // Ensures multiline text wrapping if necessary
    fontSize: '0.75rem', // Adjust font size to prevent overflow
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh', color: 'white', position: 'relative' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5">Orders</Typography>
      </Box>

      {/* Buttons in a Column Layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative', alignItems: 'flex-start' }}>
        <Button 
          variant="contained" 
          sx={buttonStyle}
          onClick={handleToggleMenu}
        >
          Quick Menu
        </Button>

        {/* Arrow appears only wshen the menu is shown */}
        {showMenu && (
          <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', left: 100, top: 25 }}>
            <ArrowForwardIcon sx={{ fontSize: '2rem' }} />
          </Box>
        )}

        <Button 
          variant="contained" 
          sx={buttonStyle}
        >
          Actions
        </Button>
      </Box>

      {/* Conditionally Render Menu in a 3x6 Grid Layout next to the Quick Menu button */}
      {showMenu && (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',  // 3 columns in the grid
          gap: 2,
          mt: 0,
          position: 'absolute',
          left: 170, // Adjust to position next to the Quick Menu button
          top: 87, // Align the grid with the Quick Menu button
          zIndex: 1, // Ensure buttons are above other elements
        }}>
          <Button variant="contained" sx={buttonStyle}>Starters</Button>
          <Button variant="contained" sx={buttonStyle}>Pizza Deals</Button>
          <Button variant="contained" sx={buttonStyle}>Burgerz</Button>
          <Button variant="contained" sx={buttonStyle}>Cheezy Treat</Button>
          <Button variant="contained" sx={buttonStyle}>Special Pizza</Button>
          <Button variant="contained" sx={buttonStyle}>Side Order</Button>
          <Button variant="contained" sx={buttonStyle}>Somewhat Sooper</Button>
          <Button variant="contained" sx={buttonStyle}>Pasta</Button>
          <Button variant="contained" sx={buttonStyle}>Somewhat Amazing</Button>
          <Button variant="contained" sx={buttonStyle}>Somewhat Local</Button>
          <Button variant="contained" sx={buttonStyle}>Sweetness</Button>
          <Button variant="contained" sx={buttonStyle}>Sandwiches and Platters</Button>
          <Button variant="contained" sx={buttonStyle}>Wraps</Button>
          <Button variant="contained" sx={buttonStyle}>Drinks</Button>
          <Button variant="contained" sx={buttonStyle}>Addons</Button>
          <Button variant="contained" sx={buttonStyle}>Previous Menu</Button>
          <Button variant="contained" sx={buttonStyle}>Innovation Kitchen</Button>
          <Button variant="contained" sx={buttonStyle}>Dessert</Button>
        </Box>
      )}
    </Box>
  );
};

export default Orders;
