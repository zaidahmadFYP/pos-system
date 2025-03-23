import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const AllItemsSection = ({ selectedCategory, setSelectedCategory, setLoadingItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true); // Set loading to true at the start of the fetch
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/menu/finishedgoods`, {
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
        setLoadingItems(false); // Set loading to false when done
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoadingItems(false); // Set loading to false on error
      }
    };

    fetchItems();
  }, [setLoadingItems]);

  useEffect(() => {
    let filtered = [...items];

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.categoryName === selectedCategory.name);
    }

    if (searchTerm) {
      const value = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const nameMatch = item.name.toLowerCase().includes(value);
        const idMatch = item.id.toLowerCase().includes(value);
        return nameMatch || idMatch;
      });
    }

    if (showOutOfStock) {
      filtered = filtered.filter((item) => item.stock === 0);
    }

    setFilteredData(filtered);

    console.log('Filtered data length:', filtered.length);
    if (tableContainerRef.current) {
      console.log('TableContainer height:', tableContainerRef.current.offsetHeight);
    }
  }, [selectedCategory, items, searchTerm, showOutOfStock]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearFilter = () => {
    setSearchTerm('');
    setShowOutOfStock(false);
    setSelectedCategory(null);
  };

  const toggleOutOfStock = () => {
    setShowOutOfStock((prev) => !prev);
  };

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
              backgroundColor: showOutOfStock ? '#e14d0a' : '#f15a22',
              color: 'white',
              borderRadius: 2,
              padding: '4px 10px',
              marginRight: 1,
              '&:hover': {
                backgroundColor: '#e14d0a',
              },
            }}
            onClick={toggleOutOfStock}
          >
            {showOutOfStock ? 'Show All' : 'Out of Stock'}
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
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TableContainer
          ref={tableContainerRef}
          sx={{
            backgroundColor: '#000',
            maxHeight: isScrollable ? '300px' : 'none',
            overflowY: 'auto',
            flex: 1,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
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
              <TableRow
                sx={{
                  backgroundColor: '#333',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              >
                <TableCell
                  sx={{
                    border: '1px solid #444',
                    padding: '12px 16px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: '#333',
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px 16px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: '#333',
                  }}
                >
                  Product ID
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px 16px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: '#333',
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px 16px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: '#333',
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: '12px 16px',
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    backgroundColor: '#333',
                  }}
                >
                  Availability
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row, index) => (
                <TableRow
                  key={row.id || row._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#1a1a1a' : '#222',
                    '&:hover': {
                      backgroundColor: '#444',
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{
                      color: 'white',
                      border: '1px solid #444',
                      padding: '12px 16px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.95rem',
                    }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: 'white',
                      border: '1px solid #444',
                      padding: '12px 16px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.95rem',
                    }}
                  >
                    {row.id}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: 'white',
                      border: '1px solid #444',
                      padding: '12px 16px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.95rem',
                    }}
                  >
                    {row.categoryName}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: 'white',
                      border: '1px solid #444',
                      padding: '12px 16px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.95rem',
                    }}
                  >
                    {row.price}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      color: row.stock > 0 ? 'white' : '#ff4444',
                      border: '1px solid #444',
                      padding: '12px 16px',
                      whiteSpace: 'nowrap',
                      fontSize: '0.95rem',
                    }}
                  >
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