import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


// Initial data for the table
const initialTableData = [
  { name: 'Detergent Powder', id: '#0012345', stock: '50 packs', category: 'Household Items', price: '$10.00', availability: 'In Stock' },
  { name: 'Toothpaste', id: '#0012346', stock: '30 pieces', category: 'Personal Care', price: '$3.00', availability: 'In Stock' },
  { name: 'Rice 5kg', id: '#0012347', stock: '100 bags', category: 'Grocery', price: '$15.00', availability: 'In Stock' },
  { name: 'LED Bulb', id: '#0012348', stock: '25 units', category: 'Electronics', price: '$8.00', availability: 'In Stock' },
  { name: 'LED Bulb', id: '#0012348', stock: '25 units', category: 'Electronics', price: '$8.00', availability: 'In Stock' },
  { name: 'LED Bulb', id: '#0012348', stock: '25 units', category: 'Electronics', price: '$8.00', availability: 'In Stock' },
];

const AllItemsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(initialTableData);

  // Function to handle search
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase().trim();
    setSearchTerm(event.target.value);

    if (!value) {
      setFilteredData(initialTableData);
      return;
    }

    const filtered = initialTableData.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(value);
      const idMatch = item.id.toLowerCase().replace('#', '').includes(value.replace('#', ''));
      return nameMatch || idMatch;
    });

    setFilteredData(filtered);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ color: '#fff' }}>
        All Items
      </Typography>

      {/* Filter Buttons and Search Bar Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        {/* Filter Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f15a22',
              color: 'white',
              borderRadius: 2,
              padding: '13px 9px',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#e14d0a',
              },
            }}
          >
            All Products
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f15a22',
              color: 'white',
              borderRadius: 2,
              padding: '4px 10px',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#e14d0a',
              },
            }}
          >
            Discounted Items
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f15a22',
              color: 'white',
              borderRadius: 2,
              padding: '4px 10px',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#e14d0a',
              },
            }}
          >
            New Arrivals
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f15a22',
              color: 'white',
              borderRadius: 2,
              padding: '4px 10px',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#e14d0a',
              },
            }}
          >
            Out of Stock
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f15a22',
              color: 'white',
              borderRadius: 2,
              padding: '4px 10px',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#e14d0a',
              },
            }}
          >
            Best Sellers
          </Button>
        </Box>

        {/* Search Bar */}
        <TextField
          label="Search by Product ID or Name"
          variant="outlined"
          placeholder="Enter product name or ID..."
          sx={{
            width: '300px',
            borderRadius: 2,
            backgroundColor: '#333',
            '& .MuiInputBase-root': {
              color: 'white',
              borderColor: '#444',
            },
            '& .MuiOutlinedInput-root': {
              borderColor: '#444',
              '& fieldset': {
                borderColor: '#444',
              },
              '&:hover fieldset': {
                borderColor: '#FFFFFF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FFFFFF',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
              '&.Mui-focused': {
                color: '#FFFFFF',
              },
            },
          }}
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      {/* Table Section */}
      <Box sx={{ mt: 4, maxHeight: 400, overflowY: 'auto' }}>
        <TableContainer>
          <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="product table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#333', color: '#f15a22' }}>
                <TableCell sx={{ border: '1px solid #444', padding: '12px', color: '#f15a22', fontWeight: 'bold' }}>Product Name</TableCell>
                <TableCell align="left" sx={{ border: '1px solid #444', padding: '12px', color: '#f15a22', fontWeight: 'bold' }}>Product ID</TableCell>
                <TableCell align="left" sx={{ border: '1px solid #444', padding: '12px', color: '#f15a22', fontWeight: 'bold' }}>Stock</TableCell>
                <TableCell align="left" sx={{ border: '1px solid #444', padding: '12px', color: '#f15a22', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell align="left" sx={{ border: '1px solid #444', padding: '12px', color: '#f15a22', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell align="left" sx={{ border: '1px solid #444', padding: '12px', color: '#f15a22', fontWeight: 'bold' }}>Availability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#444',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ color: 'white', border: '1px solid #444', padding: '12px' }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px' }}>{row.id}</TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px' }}>{row.stock}</TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px' }}>{row.category}</TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px' }}>{row.price}</TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px' }}>{row.availability}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AllItemsSection;
