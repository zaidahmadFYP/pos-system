import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Divider, Modal, Backdrop, Fade } from '@mui/material';
import { Dashboard, Menu, People, Inventory, Receipt, TableRestaurant, BookOnline, ExitToApp } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 

const Sidebar = () => {
  const [selected, setSelected] = useState(0); // Default selected tile is Dashboard (index 0)
  const [openLogoutModal, setOpenLogoutModal] = useState(false); // State for controlling modal visibility
  const navigate = useNavigate(); 
  const location = useLocation(); 

  useEffect(() => {
    // Set the default selection to 'Dashboard' when the page loads
    if (location.pathname === '/loop/dashboard') {
      setSelected(0); // Select the Dashboard tile if the route is '/loop/dashboard'
    } else if (location.pathname === '/loop/menu') {
      setSelected(1); // Select the Menu tile if the route is '/loop/menu'
    } else if (location.pathname === '/loop/staff') {
      setSelected(2); // Select the Staff tile if the route is '/loop/staff'
    } else if (location.pathname === '/loop/inventory') {
      setSelected(3); // Select the Inventory tile if the route is '/loop/inventory'
    } else if (location.pathname === '/loop/reports') {
      setSelected(4); // Select the Reports tile if the route is '/loop/reports'
    } else if (location.pathname === '/loop/orders') {
      setSelected(5); // Select the Orders tile if the route is '/loop/orders'
    } else if (location.pathname === '/loop/poscentral') {
      setSelected(6); // Select the poscentral tile if the route is '/loop/poscentral'
    }
  }, [location]); // Dependency on location to update when route changes

  const handleSelect = (index) => {
    setSelected(index);
  };

  const getSelectedStyle = (index) => {
    return selected === index
      ? {
          backgroundColor: '#f15a22',
          color: '#fff',
        }
      : {
          backgroundColor: 'transparent',
          color: '#fff',
        };
  };

  const handleLogoutClick = () => {
    setOpenLogoutModal(true); 
  };

  const handleCloseModal = () => {
    setOpenLogoutModal(false); 
  };

  const handleConfirmLogout = () => {
    setOpenLogoutModal(false); 
    navigate('/'); // Redirect to login page
  };

  return (
    <Box
      sx={{
        width: { xs: 80, sm: 100 },
        height: 'auto-vh',
        backgroundColor: '#1f1f1f',
        borderRadius: '0 12px 12px 12px',
        padding: { xs: '5px', sm: '10px' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        alignItems: 'center',
      }}
    >
      {/* Sidebar Header with Logo */}
      <Box sx={{ textAlign: 'center', marginBottom: '4px', mt: 1.5 }}>
        <img
          src={`${process.env.PUBLIC_URL}/images/loop.png`}
          alt="LOOP POS"
          style={{ width: '80%', marginBottom: '10px' }}
        />
      </Box>

      {/* Menu Section: Single Column with Small Tiles */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
        {/* Dashboard Tile */}
        <Link to="/loop/dashboard" style={{ textDecoration: 'none' }}>
          <Button
            onClick={() => handleSelect(0)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '12px',
              width: '100%',
              ...getSelectedStyle(0),
            }}
          >
            <Dashboard sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Dashboard
            </Typography>
          </Button>
        </Link>

        <Divider sx={{ borderColor: '#808080', margin: '0px auto', width:'0.65' }} />

        {/* Menu Tile */}
        <Link to="/loop/menu" style={{ textDecoration: 'none' }}>
          <Button
            onClick={() => handleSelect(1)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '12px',
              width: '100%',
              ...getSelectedStyle(1),
            }}
          >
            <Menu sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Menu
            </Typography>
          </Button>
        </Link>

        <Divider sx={{ borderColor: '#808080', margin: '0px auto', width:'0.65'  }} />

        {/* Staff Tile */}
        <Link to="/loop/staff" style={{ textDecoration: 'none' }}>
          <Button
            onClick={() => handleSelect(2)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '12px',
              width: '100%',
              ...getSelectedStyle(2),
            }}
          >
            <People sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Staff
            </Typography>
          </Button>
        </Link>

        <Divider sx={{ borderColor: '#808080', margin: '0px auto',width:'0.65'  }} />

        {/* Inventory Tile */}
        <Link to="/loop/inventory" style={{ textDecoration: 'none' }}>
          <Button
            onClick={() => handleSelect(3)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '12px',
              width: '100%',
              ...getSelectedStyle(3),
            }}
          >
            <Inventory sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Inventory
            </Typography>
          </Button>
        </Link>

        <Divider sx={{ borderColor: '#808080', margin: '0px auto', width:'0.65'  }} />

        {/* Reports Tile */}
        <Link to="/loop/reports" style={{ textDecoration: 'none' }}>
          <Button
            onClick={() => handleSelect(4)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '12px',
              width: '100%',
              ...getSelectedStyle(4),
            }}
          >
            <Receipt sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Reports
            </Typography>
          </Button>
        </Link>

        <Divider sx={{ borderColor: '#808080', margin: '0px auto', width:'0.65'  }} />

        {/* Order/Table Tile */}
        <Link to="/loop/orders" style={{ textDecoration: 'none' }}>
          <Button
            onClick={() => handleSelect(5)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '12px',
              width: '100%',
              ...getSelectedStyle(5),
            }}
          >
            <TableRestaurant sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
              Orders
            </Typography>
          </Button>
        </Link>

        <Divider sx={{ borderColor: '#808080', margin: '0px auto', width:'0.65'  }} />

        {/* Reservation Tile */}
        <Link to="/loop/poscentral" style={{ textDecoration: 'none' }}>
          <Button
            onClick={() => handleSelect(6)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px',
              borderRadius: '12px',
              width: '100%',
              ...getSelectedStyle(6),
            }}
          >
            <BookOnline sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: '0.734rem' }}>
              POS Portal
            </Typography>
          </Button>
        </Link>
      </Box>

      {/* Sidebar Footer: Logout */}
      <Box sx={{ marginTop: 'auto', textAlign: 'center', marginBottom: '30px' }}>
        <IconButton sx={{ color: '#f15a22' }} onClick={handleLogoutClick}>
          <ExitToApp sx={{ fontSize: 24 }} />
        </IconButton>
        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'lighter', marginTop: 1, fontSize: '0.75rem' }}>
          Logout
        </Typography>
      </Box>

      {/* Modal for Logout Confirmation */}
      <Modal
        open={openLogoutModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openLogoutModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: '#121212',
              color: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: 24,
              textAlign: 'center',
              width: 300,
            }}
          >
            <Typography variant="h6">Are you sure you want to log out?</Typography>
            <Box sx={{ marginTop: 2 }}>
              <Button
                onClick={handleConfirmLogout}
                sx={{
                  backgroundColor: '#f15a22',
                  color: '#fff',
                  marginRight: 2,
                  '&:hover': {
                    backgroundColor: '#e15b1f',
                  },
                }}
              >
                Yes
              </Button>
              <Button
                onClick={handleCloseModal}
                sx={{
                  borderColor: '#f15a22',
                  color: '#f15a22',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                }}
              >
                No
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Sidebar;
