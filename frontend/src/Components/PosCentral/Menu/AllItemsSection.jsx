import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AllItemsSection = ({ selectedCategory, setSelectedCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/menu/finishedgoods', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched finished goods:', data);

        if (!Array.isArray(data)) {
          throw new Error('Expected an array of items');
        }

        setItems(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredData(items);
    } else {
      const filtered = items.filter((item) => {
        return item.categoryName === selectedCategory.name;
      });
      setFilteredData(filtered);
    }

    console.log('Filtered data length:', filteredData.length);
    if (tableContainerRef.current) {
      console.log('TableContainer height:', tableContainerRef.current.offsetHeight);
    }
  }, [selectedCategory, items, filteredData]);

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase().trim();
    setSearchTerm(value);

    if (!value) {
      setFilteredData(selectedCategory ? items.filter((item) => item.categoryName === selectedCategory.name) : items);
      return;
    }

    const filtered = items.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(value);
      const idMatch = item.id.toLowerCase().includes(value);
      const categoryMatch = !selectedCategory || item.categoryName === selectedCategory.name;
      return (nameMatch || idMatch) && categoryMatch;
    });

    setFilteredData(filtered);
  };

  const clearFilter = () => {
    setSearchTerm('');
    setFilteredData(items);
    setSelectedCategory(null);
  };

  if (loading) {
    return <Typography>Loading items...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  const isScrollable = filteredData.length >= 6;

  return (
    <Box
      sx={{
        mt: 4,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" sx={{ color: '#fff' }}>
        All Items {selectedCategory ? `in ${selectedCategory.name}` : ''}
      </Typography>

      {/* Filter Buttons and Search Bar Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexShrink: 0 }}>
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
            onClick={clearFilter}
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
              borderRadius: '2px',
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
      <Box
        sx={{
          mt: 4,
          flex: 1,
          height: isScrollable ? 'auto' : 'fit-content', // Shrink to fit content when not scrollable
          maxHeight: isScrollable ? '300px' : 'none', // Fixed height only when scrollable
          overflow: isScrollable ? 'auto' : 'visible', // Scroll only when needed
        }}
      >
        <TableContainer
          ref={tableContainerRef}
          sx={{
            backgroundColor: '#000',
            height: isScrollable ? 'auto' : 'fit-content', // Shrink to fit content when not scrollable
          }}
        >
          <Table
            sx={{
              minWidth: 650,
              borderCollapse: 'collapse',
              tableLayout: 'auto',
            }}
            aria-label="product table"
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: '#333', color: '#f15a22' }}>
                <TableCell
                  sx={{
                    border: '1px solid #444',
                    padding: '12px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#333',
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#333',
                  }}
                >
                  Product ID
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#333',
                  }}
                >
                  Stock
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#333',
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#333',
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    backgroundColor: '#333',
                  }}
                >
                  Availability
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow
                  key={row.id || row._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#444',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ color: 'white', border: '1px solid #444', padding: '12px', whiteSpace: 'nowrap' }}>
                    {row.name}
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px', whiteSpace: 'nowrap' }}>
                    {row.id}
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px', whiteSpace: 'nowrap' }}>
                    {row.stock}
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px', whiteSpace: 'nowrap' }}>
                    {row.categoryName}
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px', whiteSpace: 'nowrap' }}>
                    {row.price}
                  </TableCell>
                  <TableCell align="left" sx={{ color: 'white', border: '1px solid #444', padding: '12px', whiteSpace: 'nowrap' }}>
                    {row.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </TableCell>
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