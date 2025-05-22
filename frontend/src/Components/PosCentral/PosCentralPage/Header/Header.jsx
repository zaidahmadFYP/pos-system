import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
    <Typography
      variant="h4"
      sx={{
        fontSize: `calc(${getFontSize()} * 1.2)`,
        fontWeight: 'medium',
        borderLeft: '3px solid #f15a22',
        paddingLeft: 1,
        color: 'white',
        marginBottom: 3.9,
      }}
    >
      POS CENTRAL HUB
    </Typography>
  </Box>
);

// Dynamic font size function from the original code
const getFontSize = () => {
  const size = getResponsiveSize();
  switch (size) {
    case 'xs': return '0.9rem';
    case 'sm': return '1rem';
    case 'md-compact': return '1.1rem';
    default: return '1.25rem';
  }
};

// Helper function to determine screen size
const getResponsiveSize = () => {
  const windowWidth = window.innerWidth;
  if (windowWidth < 600) return 'xs';
  if (windowWidth < 960) return 'sm';
  if (windowWidth <= 1366) return 'md-compact';
  return 'md';
};

export default Header;