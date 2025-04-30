import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';

const AllItemsSection = ({ selectedCategory, setSelectedCategory, setLoadingItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const tableContainerRef = useRef(null);
  const theme = useTheme();
  
  // Custom breakpoints to handle different screen sizes
  const isExtraSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMedium = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isTabletLandscape = useMediaQuery('(min-width:768px) and (max-width:1024px) and (orientation: landscape)');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
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
        setLoadingItems(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
        setLoadingItems(false);
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
        const nameMatch = item.name?.toLowerCase().includes(value);
        const idMatch = item.id?.toLowerCase().includes(value);
        return nameMatch || idMatch;
      });
    }

    if (showOutOfStock) {
      filtered = filtered.filter((item) => item.stock === 0);
    }

    setFilteredData(filtered);
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
    return <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }, color: 'error' }}>Error: {error}</Typography>;
  }

  // Determine table height based on screen size
  const getTableHeight = () => {
    if (isExtraSmall) return '180px';
    if (isTabletLandscape) return '220px';
    if (isSmall) return '240px';
    if (isMedium) return '280px';
    return '300px';
  };

  const isScrollable = filteredData.length >= 5;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Filter Buttons and Search Bar Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: { xs: 1, sm: 1.5, md: 2 },
          gap: { xs: 1, sm: 1.5 },
          flexShrink: 0,
          flexWrap: isTabletLandscape ? 'wrap' : 'nowrap',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            gap: { xs: 0.5, sm: 0.75, md: 1 },
            width: { xs: '100%', sm: isTabletLandscape ? '100%' : 'auto' },
            mb: isTabletLandscape ? 1 : 0,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f15a22',
              color: 'white',
              borderRadius: 2,
              padding: isTabletLandscape ? '6px 10px' : { xs: '6px 10px', sm: '8px 12px', md: '10px 14px' },
              fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
              minWidth: isTabletLandscape ? '100px' : { xs: '90px', sm: '110px', md: '120px' },
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
              padding: isTabletLandscape ? '6px 10px' : { xs: '6px 10px', sm: '8px 12px', md: '10px 14px' },
              fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
              minWidth: isTabletLandscape ? '100px' : { xs: '90px', sm: '110px', md: '120px' },
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
          size={isExtraSmall || isTabletLandscape ? "small" : "medium"}
          sx={{
            width: { xs: '100%', sm: isTabletLandscape ? '100%' : '220px', md: '250px', lg: '300px' },
            borderRadius: 2,
            backgroundColor: '#333',
            '& .MuiInputBase-root': {
              color: 'white',
              borderColor: '#444',
              fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
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
              fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
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
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <TableContainer
          ref={tableContainerRef}
          sx={{
            backgroundColor: '#000',
            maxHeight: isScrollable ? getTableHeight() : 'none',
            overflowY: 'auto',
            overflowX: 'auto',
            flex: 1,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            width: '100%',
          }}
        >
          <Table
            sx={{
              minWidth: isTabletLandscape ? 650 : { xs: 300, sm: 500, md: 650 },
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
            }}
            aria-label="product table"
            size={isExtraSmall || isTabletLandscape ? "small" : "medium"}
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
                    padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: isTabletLandscape ? '0.75rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '0.95rem' },
                    backgroundColor: '#333',
                    width: { xs: '25%', sm: '25%', md: '30%' },
                  }}
                >
                  Product Name
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: isTabletLandscape ? '0.75rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '0.95rem' },
                    backgroundColor: '#333',
                    width: { xs: '15%', sm: '15%', md: '15%' },
                  }}
                >
                  Product ID
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: isTabletLandscape ? '0.75rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '0.95rem' },
                    backgroundColor: '#333',
                    width: { xs: '20%', sm: '20%', md: '20%' },
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: isTabletLandscape ? '0.75rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '0.95rem' },
                    backgroundColor: '#333',
                    width: { xs: '15%', sm: '15%', md: '15%' },
                  }}
                >
                  Price
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    border: '1px solid #444',
                    padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                    color: '#f15a22',
                    fontWeight: 'bold',
                    fontSize: isTabletLandscape ? '0.75rem' : { xs: '0.65rem', sm: '0.75rem', md: '0.85rem', lg: '0.95rem' },
                    backgroundColor: '#333',
                    width: { xs: '25%', sm: '25%', md: '20%' },
                  }}
                >
                  Availability
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <TableRow
                    key={row.id || row._id || index}
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
                        padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                        fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.8rem', lg: '0.9rem' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: '80px', sm: '120px', md: '200px' },
                      }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: 'white',
                        border: '1px solid #444',
                        padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                        fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.8rem', lg: '0.9rem' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {row.id}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: 'white',
                        border: '1px solid #444',
                        padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                        fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.8rem', lg: '0.9rem' },
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {row.categoryName}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: 'white',
                        border: '1px solid #444',
                        padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                        fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.8rem', lg: '0.9rem' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.price}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        color: row.stock > 0 ? 'white' : '#ff4444',
                        border: '1px solid #444',
                        padding: isTabletLandscape ? '6px 8px' : { xs: '6px 8px', sm: '8px 10px', md: '10px 14px' },
                        fontSize: isTabletLandscape ? '0.7rem' : { xs: '0.65rem', sm: '0.7rem', md: '0.8rem', lg: '0.9rem' },
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {row.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    sx={{
                      color: 'white',
                      border: '1px solid #444',
                      padding: '12px 16px',
                      textAlign: 'center',
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    }}
                  >
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default AllItemsSection;