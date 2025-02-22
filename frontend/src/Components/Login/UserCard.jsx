import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Avatar, Button, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const UserCard = ({ user, onSelect }) => {
  return (
    <Accordion sx={{ marginBottom: '10px', backgroundColor: '#2b2b2b', borderRadius: '8px' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#f15a22' }} />}>
        <Avatar sx={{ bgcolor: '#f15a22', marginRight: '12px' }}>
          {user.name.charAt(0)}
        </Avatar>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 'bold' }}>{user.name}</Typography>
          <Typography sx={{ color: '#aaa' }}>{user.email}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Button
          variant="contained"
          fullWidth
          sx={{
            backgroundColor: '#f15a22',
            color: '#000',
            fontWeight: 'bold',
            padding: '12px',
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: '#f15a22',
            },
          }}
          onClick={() => onSelect(user)}
        >
          Select
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default UserCard;
