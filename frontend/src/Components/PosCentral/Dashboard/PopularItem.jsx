import React from 'react';
import {
  Card,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';

const PopularItem = ({ title }) => {
  const dishes = [
    {
      name: 'Chicken Parmesan',
      serving: '01 person',
      price: '$55.00',
      status: 'In Stock',
      image: '/images/item.webp', // Replace with the path to your image in the public/images directory
    },
    {
      name: 'Chicken Parmesan',
      serving: '01 person',
      price: '$55.00',
      status: 'In Stock',
      image: '/images/item.webp', // Replace with the path to your image in the public/images directory
    },
    {
      name: 'Chicken Parmesan',
      serving: '01 person',
      price: '$55.00',
      status: 'In Stock',
      image: '/images/item.webp', // Replace with the path to your image in the public/images directory
    },
    {
      name: 'Chicken Parmesan',
      serving: '01 person',
      price: '$55.00',
      status: 'In Stock',
      image: '/images/item.webp', // Replace with the path to your image in the public/images directory
    },
    {
      name: 'Chicken Parmesan',
      serving: '01 person',
      price: '$55.00',
      status: 'In Stock',
      image: '/images/item.webp', // Replace with the path to your image in the public/images directory
    },
    {
      name: 'Chicken Parmesan',
      serving: '01 person',
      price: '$55.00',
      status: 'In Stock',
      image: '/images/item.webp', // Replace with the path to your image in the public/images directory
    },
  ];

  return (
    <Card
      sx={{
        bgcolor: '#2a2a2a',
        p: 3, // Increased padding to make the card larger
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)', // Retained only the box shadow on hover
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

      <List sx={{ p: 0, maxHeight: 120, overflowY: 'auto' }}>
        {dishes.map((dish, index) => (
          <ListItem
            key={index}
            sx={{
              bgcolor: '#333',
              mb: 2, // Increased margin to give more space between items
              borderRadius: 2,
              padding: 2,
              // Removed transform property and hover effect
              '&:hover': {
                backgroundColor: '#444',
              },
            }}
          >
            {/* Replaced Avatar with img tag */}
            <Box sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', border: '2px solid #444' }}>
              <img
                src={dish.image} // Image path from the public/images directory
                alt={dish.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover', // Ensures the image covers the container fully
                }}
              />
            </Box>

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
        ))}
      </List>
    </Card>
  );
};

export default PopularItem;
