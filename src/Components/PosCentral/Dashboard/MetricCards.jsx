import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { AttachMoney, CalendarMonth, TableBar } from '@mui/icons-material';

const MetricCard = ({ title, value, date, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'sales':
        return <AttachMoney sx={{ color: '#FFEB3B' }} />;
      case 'revenue':
        return <CalendarMonth sx={{ color: '#FFEB3B' }} />;
      case 'tables':
        return <TableBar sx={{ color: '#FFEB3B' }} />;
      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        bgcolor: '#2a2a2a',
        p: 2,
        height: 'auto',
        borderRadius: 2,
        position: 'relative',
        boxShadow: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
        border: '1px solid rgba(248, 187, 208, 0.2)',
        '&:hover': {
          transform: 'scale(1.05)', // Expand effect
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)', // Shadow effect on hover
          backgroundColor: '#333', // Subtle background change on hover
        },
      }}
    >
      <Box sx={{ position: 'absolute', right: 16, top: 16 }}>
        <Box
          sx={{
            bgcolor: 'rgba(248, 187, 208, 0.1)',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
          }}
        >
          {getIcon()}
        </Box>
      </Box>
      <Typography variant="h6" sx={{ color: '#fff', mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ color: '#fff', mb: 2, fontWeight: 700 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
        {date}
      </Typography>
      {/* Placeholder for mini chart */}
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          gap: 1,
          height: 40,
          alignItems: 'flex-end',
        }}
      >
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: '15%',
              bgcolor: '#4caf50',
              height: `${Math.random() * 100}%`,
              borderRadius: 1,
              transition: 'height 0.6s ease',
              '&:hover': {
                height: '100%',
              },
            }}
          />
        ))}
      </Box>
    </Card>
  );
};

export default MetricCard;
