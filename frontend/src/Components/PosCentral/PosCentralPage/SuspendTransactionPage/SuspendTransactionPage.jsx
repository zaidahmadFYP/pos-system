import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Divider, CircularProgress, TextField, Checkbox, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuspendTransactionPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
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
      console.log("Fetched transactions:", response.data);
      setTransactions(response.data);

      const suspendableTransactions = response.data.filter(
        (transaction) =>
          transaction.transactionStatus === "processed" && transaction.paidStatus === "not paid"
      );
      setFilteredTransactions(suspendableTransactions);
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

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.trim() === '') {
      setFilteredTransactions(
        transactions.filter(
          (transaction) =>
            transaction.transactionStatus === "processed" && transaction.paidStatus === "not paid"
        )
      );
    } else {
      const filtered = transactions.filter(
        (transaction) =>
          transaction &&
          transaction.transactionID &&
          transaction.transactionID.toString().includes(value) &&
          transaction.transactionStatus === "processed" &&
          transaction.paidStatus === "not paid"
      );
      setFilteredTransactions(filtered);
    }
  };

  const handleBack = () => {
    navigate('/loop/poscentral');
  };

  const handleTransactionToggle = (transaction) => {
    setSelectedTransactions((prevSelected) => {
      if (prevSelected.some((t) => t._id === transaction._id)) {
        return prevSelected.filter((t) => t._id !== transaction._id);
      } else {
        return [...prevSelected, transaction];
      }
    });
  };

  const handleSuspendTransaction = async () => {
    if (selectedTransactions.length > 0) {
      try {
        const transactionIDs = selectedTransactions.map((t) => t.transactionID);
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001";
        const response = await axios.put(`${apiUrl}/api/transactions/suspend`, {
          transactionIDs,
        });

        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success',
        });

        await fetchTransactions();
        setSelectedTransactions([]);
      } catch (err) {
        console.error('Error suspending transactions:', err);
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Failed to suspend transactions. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        <Box sx={{ display: 'inline-block', borderBottom: '2px solid #333333', width: '555px' }}>
          <Typography
            variant="h5"
            sx={{
              color: '#f15a22',
              fontWeight: 'bold',
              fontSize: getFontSize(),
              marginBottom: 1,
            }}
          >
            Suspend Transaction
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body1"
              sx={{
                color: '#f15a22',
                fontWeight: 'bold',
                letterSpacing: '0.3px',
              }}
            >
              Suspend Transaction through Transaction ID:
            </Typography>
            <TextField
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Enter Transaction ID"
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: '#2a2a2a',
                  color: 'white',
                  borderRadius: '8px',
                  '& fieldset': { borderColor: '#444' },
                  '&:hover fieldset': { borderColor: '#f15a22' },
                  '&.Mui-focused fieldset': { borderColor: '#f15a22' },
                },
                '& .MuiInputBase-input': { padding: '8px 12px', color: 'white' },
                '& .MuiInputBase-input::placeholder': { color: '#b0b0b0', opacity: 1 },
              }}
            />
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
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
            width: selectedTransactions.length > 0 ? '70%' : '100%',
            transition: 'width 0.3s ease',
            border: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ padding: 2, pb: 0 }}>
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
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, p: 2 }}>
              <CircularProgress sx={{ color: '#f15a22' }} />
              <Typography sx={{ color: 'white', ml: 2 }}>Loading transactions...</Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 4, flex: 1, p: 2 }}>
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
          ) : filteredTransactions.length === 0 ? (
            <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 4, flex: 1, p: 2 }}>
              No suspendable transactions found (only 'processed' and 'not paid' transactions can be suspended).
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', p: 2, pt: 0 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 1fr 1fr',
                  background: '#2a2a2a',
                  padding: '12px 16px',
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
                <Typography sx={{ textAlign: 'left' }}>Select</Typography>
                <Typography sx={{ textAlign: 'left' }}>Transaction #</Typography>
                <Typography sx={{ textAlign: 'center' }}>Total</Typography>
                <Typography sx={{ textAlign: 'right' }}>Date</Typography>
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
                {filteredTransactions.map((transaction) => (
                  <Box
                    key={transaction._id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '80px 1fr 1fr 1fr',
                      alignItems: 'center',
                      background: selectedTransactions.some((t) => t._id === transaction._id)
                        ? 'linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)'
                        : '#2a2a2a',
                      padding: '12px 16px',
                      color: 'white',
                      cursor: 'pointer',
                      borderBottom: '1px solid #444',
                      transition: 'all 0.3s ease',
                      '&:last-child': {
                        borderBottom: 'none',
                        borderRadius: '0 0 8px 8px',
                      },
                      '&:hover': {
                        background: selectedTransactions.some((t) => t._id === transaction._id)
                          ? 'linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)'
                          : '#3a3a3a',
                      },
                    }}
                    onClick={() => handleTransactionToggle(transaction)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        checked={selectedTransactions.some((t) => t._id === transaction._id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleTransactionToggle(transaction);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                          color: '#f15a22',
                          '&.Mui-checked': {
                            color: selectedTransactions.some((t) => t._id === transaction._id) ? 'white' : '#f15a22',
                          },
                          padding: 0,
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontWeight: 'bold', textAlign: 'left' }}>
                      #{transaction.transactionID}
                    </Typography>
                    <Typography sx={{ textAlign: 'center' }}>
                      ${transaction.total.toFixed(2)}
                    </Typography>
                    <Typography sx={{ textAlign: 'right', color: '#b0b0b0' }}>
                      {new Date(transaction.date).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Paper>

        {selectedTransactions.length > 0 && (
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
              Selected Transactions ({selectedTransactions.length})
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
              {selectedTransactions.map((selectedTransaction, index) => (
                <Box key={index} sx={{ mb: 2 }}>
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
                      Order Punched:
                      <Typography component="span" sx={{ color: 'white', ml: 1, fontWeight: 'normal' }}>
                        {selectedTransaction.orderPunched}
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
                    {selectedTransaction.items.map((item, itemIndex) => (
                      <Box
                        key={itemIndex}
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
                          Qty: {item.itemQuantity} | Price: ${(item.price || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                onClick={handleSuspendTransaction}
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
                Suspend Transaction{selectedTransactions.length > 1 ? 's' : ''}
              </Button>
              <Button
                onClick={() => setSelectedTransactions([])}
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
            </Box>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuspendTransactionPage;