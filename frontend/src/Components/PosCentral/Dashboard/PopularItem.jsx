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
import { RestaurantMenu } from '@mui/icons-material'; // Added icon for dishes

const PopularItem = ({ title }) => {
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularItems = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Fetch transactions to determine popular items
        const transactionsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/transactions/orders`
        );
        if (!transactionsResponse.ok) {
          throw new Error(`Failed to fetch transactions (Status: ${transactionsResponse.status})`);
        }
        const transactions = await transactionsResponse.json();

        // Step 2: Aggregate item quantities to find the most popular items
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

        // Sort items by quantity sold and take the top 6
        const sortedItems = Object.entries(itemQuantities)
          .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
          .slice(0, 6)
          .map(([itemId]) => itemId);

        // Step 3: Fetch finished goods to get item details
        const finishedGoodsResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/menu/finishedgoods`
        );
        if (!finishedGoodsResponse.ok) {
          throw new Error(`Failed to fetch finished goods (Status: ${finishedGoodsResponse.status})`);
        }
        const finishedGoods = await finishedGoodsResponse.json();

        // Step 4: Map popular items to their details
        const popularItemsData = sortedItems
          .map((itemId) => {
            const item = finishedGoods.find((fg) => fg.id === itemId || fg._id === itemId);
            if (!item) return null;
            return {
              name: item.name,
              serving: '01 person', // Static for now, as serving size isn't in the API
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
        p: 3,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: '#f8bbd0', cursor: 'pointer', fontWeight: 500 }}
        >
          See All
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress sx={{ color: '#f15a22' }} />
        </Box>
      ) : error ? (
        <Typography sx={{ color: 'red', textAlign: 'center' }}>{error}</Typography>
      ) : (
        <List sx={{ p: 0, maxHeight: 120, overflowY: 'auto' }}>
          {popularItems.length > 0 ? (
            popularItems.map((dish, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor: '#333',
                  mb: 2,
                  borderRadius: 2,
                  padding: 2,
                  '&:hover': {
                    backgroundColor: '#444',
                  },
                }}
              >
                {/* Icon instead of Image */}
                <ListItemIcon>
                  <Box
                    sx={{
                      bgcolor: 'rgba(241, 90, 34, 0.2)', // Background color matching the theme
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #f15a22',
                    }}
                  >
                    <RestaurantMenu sx={{ color: '#f15a22', fontSize: 28 }} />
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ color: '#fff', fontWeight: 500 }}>
                      {dish.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: '#999' }}>
                      Serving: {dish.serving}
                    </Typography>
                  }
                />

                <Box sx={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
                  <Chip
                    label={dish.status}
                    size="small"
                    sx={{
                      bgcolor: dish.status === 'In Stock' ? '#4caf50' : '#f44336',
                      color: '#fff',
                      mb: 1,
                      borderRadius: '20px',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
                    {dish.price}
                  </Typography>
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography sx={{ color: '#999', textAlign: 'center' }}>
              No popular items found.
            </Typography>
          )}
        </List>
      )}
    </Card>
  );
};

export default PopularItem;