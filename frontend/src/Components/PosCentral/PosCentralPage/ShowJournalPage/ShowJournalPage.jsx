import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Divider, CircularProgress, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ShowJournalPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for responsive font size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Responsive font size for heading
  const getFontSize = () => {
    if (windowWidth < 600) return '1.1rem'; // xs
    if (windowWidth < 960) return '1.25rem'; // sm
    if (windowWidth <= 1366) return '1.4rem'; // md-compact
    return '1.5rem'; // md
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/orders`);
      setTransactions(response.data);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch transactions: ${err.message}. Please try again later.`);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const intervalId = setInterval(fetchTransactions, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const handleBack = () => {
    navigate('/loop/poscentral');
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  return (
    <Box
      sx={{
        p: 2,
        color: 'white',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #121212 0%, #1a1a1a 100%)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, paddingBottom: 0.5 }}>
        <Box sx={{ display: 'inline-block', borderBottom: '2px solid #333333', width: '1110px' }}>
          <Typography
            variant="h5"
            sx={{
              color: '#f15a22',
              fontWeight: 'bold',
              fontSize: getFontSize(),
              marginBottom: 1,
            }}
          >
            Show Journal
          </Typography>
        </Box>
        <Button
          onClick={handleBack}
          sx={{
            background: 'linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)',
            color: 'white',
            padding: '8px 16px',
            textTransform: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)',
              boxShadow: '0 5px 10px rgba(0, 0, 0, 0.5)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Back
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        <Paper
          sx={{
            background: 'linear-gradient(180deg, #1f1f1f 0%, #252525 100%)',
            borderRadius: '12px',
            padding: 2,
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
            width: selectedTransaction ? '70%' : '100%',
            transition: 'width 0.3s ease',
            border: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#f15a22',
              mb: 1,
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
            }}
          >
            Transaction Journal
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <CircularProgress sx={{ color: '#f15a22' }} />
              <Typography sx={{ color: 'white', ml: 2 }}>Loading transactions...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4, flex: 1 }}>
              <Typography sx={{ color: '#ff4d4d', fontWeight: 'bold', mb: 2 }}>{error}</Typography>
              <Button
                onClick={fetchTransactions}
                sx={{
                  background: 'linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)',
                  color: 'white',
                  padding: '8px 24px',
                  textTransform: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)',
                    boxShadow: '0 5px 10px rgba(0, 0, 0, 0.5)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Retry
              </Button>
            </Box>
          ) : transactions.length === 0 ? (
            <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 4, flex: 1 }}>
              No transactions found.
            </Typography>
          ) : (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: '#2a2a2a',
                  padding: 1.5,
                  borderRadius: '8px 8px 0 0',
                  border: '1px solid #444',
                  borderBottom: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  color: '#f15a22',
                  fontWeight: 'bold',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Typography sx={{ flex: 1 }}>Transaction #</Typography>
                <Typography sx={{ flex: 1, textAlign: 'center' }}>Total</Typography>
                <Typography sx={{ flex: 1, textAlign: 'center' }}>Status</Typography>
                <Typography sx={{ flex: 1, textAlign: 'right' }}>Date</Typography>
              </Box>
              
              <Box
                sx={{
                  flex: 1,
                  overflowY: 'auto',
                  minHeight: 0,
                  borderRadius: '0 0 8px 8px',
                  border: '1px solid #444',
                  borderTop: 'none',
                  background: '#252525',
                  '&::-webkit-scrollbar': {
                    width: '10px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#1a1a1a',
                    borderRadius: '0 0 8px 0',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#444',
                    borderRadius: '5px',
                    '&:hover': {
                      background: '#555',
                    },
                  },
                }}
              >
                {transactions.map((transaction) => (
                  <Box
                    key={transaction._id}
                    onClick={() => handleTransactionClick(transaction)}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: selectedTransaction?._id === transaction._id
                        ? 'linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)'
                        : '#2a2a2a',
                      padding: 1.5,
                      color: 'white',
                      cursor: 'pointer',
                      borderBottom: '1px solid #444',
                      transition: 'all 0.3s ease',
                      '&:last-child': {
                        borderBottom: 'none',
                        borderRadius: '0 0 8px 8px',
                      },
                      '&:hover': {
                        background: selectedTransaction?._id === transaction._id
                          ? 'linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)'
                          : '#3a3a3a',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                      },
                    }}
                  >
                    <Typography sx={{ flex: 1, fontWeight: 'bold' }}>
                      #{transaction.transactionID}
                    </Typography>
                    <Typography sx={{ flex: 1, textAlign: 'center' }}>
                      ${transaction.total.toFixed(2)}
                    </Typography>
                    <Box sx={{ flex: 1, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 1 }}>
                      <Chip
                        label={transaction.paidStatus}
                        size="small"
                        sx={{
                          backgroundColor: transaction.paidStatus === 'paid' ? '#4CAF50' : '#FF4444',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                      <Chip
                        label={transaction.transactionStatus}
                        size="small"
                        sx={{
                          backgroundColor: transaction.transactionStatus === 'processed' ? '#4CAF50' : '#FFA500',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                    <Typography sx={{ flex: 1, textAlign: 'right', color: '#b0b0b0' }}>
                      {new Date(transaction.date).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>

        {selectedTransaction && (
          <Paper
            sx={{
              background: 'linear-gradient(180deg, #252525 0%, #1f1f1f 100%)',
              borderRadius: '12px',
              padding: 2,
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
              width: '30%',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              border: '2px solid #f15a22',
              animation: 'slideIn 0.3s ease',
              overflow: 'hidden',
              '@keyframes slideIn': {
                from: { transform: 'translateX(100%)', opacity: 0 },
                to: { transform: 'translateX(0)', opacity: 1 },
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#f15a22',
                mb: 1.5,
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
                fontSize: '1.3rem',
              }}
            >
              Transaction Details
            </Typography>
            <Divider sx={{ borderColor: '#f15a22', mb: 2, opacity: 0.5 }} />
            
            <Box
              sx={{
                flex: 1,
                overflowY: 'auto',
                minHeight: 0,
                mb: 2,
                px: 1,
                '&::-webkit-scrollbar': {
                  width: '10px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#1a1a1a',
                  borderRadius: '5px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#444',
                  borderRadius: '5px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }}
            >
              <Box
                sx={{
                  background: '#2a2a2a',
                  borderRadius: '8px',
                  padding: 1.5,
                  mb: 2,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  border: '1px solid #444',
                }}
              >
                <Typography variant="body1" sx={{ color: '#f15a22', mb: 0.5, fontWeight: 'bold' }}>
                  Transaction ID:
                  <Typography component="span" sx={{ color: 'white', ml: 1, fontWeight: 'normal' }}>
                    {selectedTransaction.transactionID}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: '#f15a22', mb: 0.5, fontWeight: 'bold' }}>
                  Date:
                  <Typography component="span" sx={{ color: 'white', ml: 1, fontWeight: 'normal' }}>
                    {new Date(selectedTransaction.date).toLocaleString()}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: '#f15a22', mb: 0.5, fontWeight: 'bold' }}>
                  Total:
                  <Typography component="span" sx={{ color: 'white', ml: 1, fontWeight: 'normal' }}>
                    ${selectedTransaction.total.toFixed(2)}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: '#f15a22', mb: 0.5, fontWeight: 'bold' }}>
                  Payment Method:
                  <Typography component="span" sx={{ color: 'white', ml: 1, fontWeight: 'normal' }}>
                    {selectedTransaction.paymentMethod}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: '#f15a22', mb: 0.5, fontWeight: 'bold' }}>
                  Paid Status:
                  <Typography component="span" sx={{ color: 'white', ml: 1, fontWeight: 'normal' }}>
                    {selectedTransaction.paidStatus}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: '#f15a22', mb: 0.5, fontWeight: 'bold' }}>
                  Transaction Status:
                  <Typography component="span" sx={{ color: 'white', ml: 1, fontWeight: 'normal' }}>
                    {selectedTransaction.transactionStatus}
                  </Typography>
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: '#f15a22',
                  mb: 1,
                  fontWeight: 'bold',
                  letterSpacing: '0.3px',
                }}
              >
                Items:
              </Typography>
              <Box sx={{ pl: 1 }}>
                {selectedTransaction.items.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      background: 'linear-gradient(45deg, #2a2a2a 0%, #333 100%)',
                      padding: 1,
                      borderRadius: '6px',
                      border: '1px solid #444',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                      },
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                      {item.itemName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 0.3 }}>
                      Qty: {item.itemQuantity}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', mt: 0.3 }}>
                      Price: ${(item.price || 0).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Button
              onClick={() => setSelectedTransaction(null)}
              sx={{
                background: 'linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)',
                color: 'white',
                padding: '10px 16px',
                textTransform: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.3)',
                width: '100%',
                '&:hover': {
                  background: 'linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)',
                  boxShadow: '0 5px 10px rgba(0, 0, 0, 0.5)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Close
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default ShowJournalPage;