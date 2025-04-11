import React from 'react';
import { Box, Typography } from '@mui/material';

const Header = () => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, ml: 2.1 }}>
    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f15a22', fontFamily: 'TanseekModernW20-bold' }}>
      POS CENTRAL HUB
    </Typography>
  </Box>
);

export default Header;