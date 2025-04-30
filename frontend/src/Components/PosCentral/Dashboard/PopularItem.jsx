import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
} from '@mui/material';
import { RestaurantMenu } from '@mui/icons-material';

const PopularItem = ({ title }) => {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularItems = async () => {
      setLoading(true);
      setError(null);

      try {
        const transactionsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/orders`
        );
        if (!transactionsResponse.ok) {
          throw new Error(`Failed to fetch transactions (Status: ${transactionsResponse.status})`);
        }
        const transactions = await transactionsResponse.json();

        const itemQuantities = {};
        transactions.forEach((transaction) => {
          transaction.items.forEach((item) => {
            if (itemQuantities[item.itemId]) {
              itemQuantities[item.itemId] += item.itemQuantity;
            } else {
              itemQuantities[item.itemId] = item.itemQuantity;
            }
          });
        });

        const sortedItems = Object.entries(itemQuantities)
          .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
          .slice(0, 6)
          .map(([itemId]) => itemId);

        const finishedGoodsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/menu/finishedgoods`
        );
        if (!finishedGoodsResponse.ok) {
          throw new Error(`Failed to fetch finished goods (Status: ${finishedGoodsResponse.status})`);
        }
        const finishedGoods = await finishedGoodsResponse.json();

        const popularItemsData = sortedItems
          .map((itemId) => {
            const item = finishedGoods.find((fg) => fg.id === itemId || fg._id === itemId);
            if (!item) return null;
            return {
              name: item.name,
              serving: '01 person',
              price: `$${item.price.toFixed(2)}`,
              status: item.stock > 0 ? 'In Stock' : 'Out of Stock',
            };
          })
          .filter((item) => item !== null);

        setPopularItems(popularItemsData);
      } catch (err) {
        console.error("Error fetching popular items:", err.message);
        setError("Failed to load popular items.");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularItems();
  }, []);

  return (
    <Card
      sx={{
        bgcolor: '#2a2a2a',
        p: { xs: 1, sm: 1.5, md: 2, lg: 3 },
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
        },
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: { xs: 0.5, sm: 1, md: 2 } }}>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#f15a22',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
          }}
        >
          See All
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
          <CircularProgress sx={{ color: '#f15a22', size: { xs: 24, sm: 30, md: 36 } }} />
        </Box>
      ) : error ? (
        <Typography
          sx={{
            color: 'red',
            textAlign: 'center',
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
          }}
        >
          {error}
        </Typography>
      ) : (
        <List
          sx={{
            p: 0,
            maxHeight: { xs: 60, sm: 70, md: 80, lg: 90 },
            overflowY: 'auto',
            width: '100%',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#f15a22',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#333',
            },
          }}
        >
          {popularItems.length > 0 ? (
            popularItems.map((dish, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: '#333',
                  mb: 0.5,
                  borderRadius: 2,
                  padding: { xs: 0.5, sm: 1, md: 2 },
                  '&:hover': {
                    backgroundColor: '#444',
                  },
                  alignItems: 'center',
                  minHeight: { xs: 60, sm: 70, md: 80, lg: 90 },
                }}
              >
                <ListItemIcon>
                  <Box
                    sx={{
                      bgcolor: 'rgba(241, 90, 34, 0.2)',
                      borderRadius: '50%',
                      width: { xs: 32, sm: 40, md: 48 },
                      height: { xs: 32, sm: 40, md: 48 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #f15a22',
                    }}
                  >
                    <RestaurantMenu
                      sx={{ color: '#f15a22', fontSize: { xs: 20, sm: 24, md: 28 } }}
                    />
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#fff',
                        fontWeight: 500,
                        fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                      }}
                    >
                      {dish.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#999',
                        fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                      }}
                    >
                      Serving: {dish.serving}
                    </Typography>
                  }
                  sx={{ flex: '1 1 auto' }}
                />

                <Box
                  sx={{
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    minWidth: { xs: 60, sm: 80, md: 100 },
                  }}
                >
                  <Chip
                    label={dish.status}
                    size="small"
                    sx={{
                      bgcolor: dish.status === 'In Stock' ? '#4caf50' : '#f44336',
                      color: '#fff',
                      mb: 0.5,
                      borderRadius: '20px',
                      fontWeight: 600,
                      fontSize: { xs: '0.625rem', sm: '0.75rem', md: '0.875rem' },
                      padding: { xs: '1px 4px', sm: '2px 8px', md: '4px 10px' },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                    }}
                  >
                    {dish.price}
                  </Typography>
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography
              sx={{
                color: '#999',
                textAlign: 'center',
                fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
              }}
            >
              No popular items found.
            </Typography>
          )}
        </List>
      )}
    </Card>
  );
};

export default PopularItem;