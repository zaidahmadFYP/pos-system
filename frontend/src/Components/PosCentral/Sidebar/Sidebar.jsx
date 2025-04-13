import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  Typography,
  Button,
  Divider,
  Modal,
  Backdrop,
  Fade,
  Avatar,
  Tooltip,
  Popover,
} from "@mui/material";
import {
  Dashboard,
  Menu,
  Inventory,
  Receipt,
  TableRestaurant,
  BookOnline,
  ExitToApp,
  Email,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setCurrentUser, employeeName, setEmployeeName } =
    useContext(UserContext);

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!employeeName) return "?";

    // Split the name by spaces and get the first letter of each part
    const nameParts = employeeName.split(" ");
    if (nameParts.length === 1) {
      // If there's only one name, return the first letter
      return nameParts[0].charAt(0).toUpperCase();
    } else {
      // Return first letter of first name and first letter of last name
      return (
        nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
      ).toUpperCase();
    }
  };

  // Format date for display
  const formatLoginTime = () => {
    // In a real implementation, you would likely store login time in user context
    // For now, we're just displaying the current time
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (location.pathname === "/loop/poscentral") {
      setSelected(0);
    } else if (location.pathname === "/loop/dashboard") {
      setSelected(1);
    } else if (location.pathname === "/loop/menu") {
      setSelected(2);
    } else if (location.pathname === "/loop/staff") {
      setSelected(3);
    } else if (location.pathname === "/loop/inventory") {
      setSelected(4);
    } else if (location.pathname === "/loop/reports") {
      setSelected(5);
    } else if (location.pathname === "/loop/orders") {
      setSelected(6);
    }
  }, [location]);

  const handleSelect = (index) => {
    setSelected(index);
  };

  const getSelectedStyle = (index) => {
    return selected === index
      ? {
          backgroundColor: "#f15a22",
          color: "#fff",
        }
      : {
          backgroundColor: "transparent",
          color: "#fff",
        };
  };

  const handleLogoutClick = () => {
    setOpenLogoutModal(true);
  };

  const handleCloseModal = () => {
    setOpenLogoutModal(false);
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const popoverId = openPopover ? "user-info-popover" : undefined;

  const handleConfirmLogout = async () => {
    const nameToUse = employeeName || localStorage.getItem("employeeName");
    const currentTime = new Date().toTimeString().split(" ")[0]; // HH:MM:SS

    try {
      if (nameToUse) {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posreports/close`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              employeeName: nameToUse,
              closingTime: currentTime,
            }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to close POS report");
        }

        if (data.status === "completed") {
          // Shift completed, clear context and localStorage
          setCurrentUser(null);
        }
        // If shift not complete, keep context/localStorage intact
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Proceed with logout even if there's an error, assuming it's safe to clear
      setCurrentUser(null);
    }

    setOpenLogoutModal(false);
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: { xs: 80, sm: 100 },
        height: "100vh",
        backgroundColor: "#1f1f1f",
        borderRadius: "0 12px 12px 12px",
        padding: { xs: "5px", sm: "10px" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {/* Sidebar Header with Logo */}
      <Box sx={{ textAlign: "center", marginBottom: "4px", mt: 1.5 }}>
        <img
          src={`${process.env.PUBLIC_URL}/images/loop.png`}
          alt="LOOP POS"
          style={{ width: "80%", marginBottom: "10px" }}
        />
      </Box>

      {/* Menu Section: Single Column with Small Tiles */}
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}
      >
        <Link to="/loop/poscentral" style={{ textDecoration: "none" }}>
          <Button
            onClick={() => handleSelect(0)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              borderRadius: "12px",
              width: "100%",
              ...getSelectedStyle(0),
            }}
          >
            <BookOnline sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: "0.734rem" }}>
              POS Portal
            </Typography>
          </Button>
        </Link>

        <Divider
          sx={{ borderColor: "#808080", margin: "0px auto", width: "0.65" }}
        />

        <Link to="/loop/dashboard" style={{ textDecoration: "none" }}>
          <Button
            onClick={() => handleSelect(1)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              borderRadius: "12px",
              width: "100%",
              ...getSelectedStyle(1),
            }}
          >
            <Dashboard sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Dashboard
            </Typography>
          </Button>
        </Link>

        <Divider
          sx={{ borderColor: "#808080", margin: "0px auto", width: "0.65" }}
        />

        <Link to="/loop/menu" style={{ textDecoration: "none" }}>
          <Button
            onClick={() => handleSelect(2)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              borderRadius: "12px",
              width: "100%",
              ...getSelectedStyle(2),
            }}
          >
            <Menu sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Menu
            </Typography>
          </Button>
        </Link>

        <Divider
          sx={{ borderColor: "#808080", margin: "0px auto", width: "0.65" }}
        />

        <Link to="/loop/inventory" style={{ textDecoration: "none" }}>
          <Button
            onClick={() => handleSelect(4)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              borderRadius: "12px",
              width: "100%",
              ...getSelectedStyle(4),
            }}
          >
            <Inventory sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Inventory
            </Typography>
          </Button>
        </Link>

        <Divider
          sx={{ borderColor: "#808080", margin: "0px auto", width: "0.65" }}
        />

        <Link to="/loop/reports" style={{ textDecoration: "none" }}>
          <Button
            onClick={() => handleSelect(5)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              borderRadius: "12px",
              width: "100%",
              ...getSelectedStyle(5),
            }}
          >
            <Receipt sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Reports
            </Typography>
          </Button>
        </Link>

        <Divider
          sx={{ borderColor: "#808080", margin: "0px auto", width: "0.65" }}
        />

        <Link to="/loop/orders" style={{ textDecoration: "none" }}>
          <Button
            onClick={() => handleSelect(6)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              borderRadius: "12px",
              width: "100%",
              ...getSelectedStyle(6),
            }}
          >
            <TableRestaurant sx={{ fontSize: 24 }} />
            <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
              Orders
            </Typography>
          </Button>
        </Link>
      </Box>

      {/* Sidebar Footer: User Avatar and Logout */}
      <Box
        sx={{
          marginTop: "auto",
          textAlign: "center",
          marginBottom: "25px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* User Avatar with Tooltip */}
        {employeeName && (
          <Box
            sx={{
              mb: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Tooltip title={employeeName} arrow placement="right">
              <Avatar
                sx={{
                  bgcolor: "#f15a22",
                  color: "#fff",
                  width: 40,
                  height: 40,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  mb: 1,
                  cursor: "pointer",
                }}
                onClick={handleAvatarClick}
                aria-describedby={popoverId}
              >
                {getUserInitials()}
              </Avatar>
            </Tooltip>

            {/* User Popover */}
            <Popover
              id={popoverId}
              open={openPopover}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={{
                '.MuiPopover-paper': {
                  borderRadius: '8px',
                  backgroundColor: '#2a2a2a',
                  boxShadow: 'none', // Remove default shadow if it's interfering
                  marginTop: '-120px',  
                  marginLeft: '5px', // Adjust the left margin to position it correctly
                }
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#2a2a2a",
                  color: "#fff",
                  borderRadius: "8px",
                  width: 250,
                  boxShadow: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#f15a22",
                    fontWeight: "bold",
                    mb: 1,
                    fontSize: "1.1rem",
                  }}
                >
                  User Information
                </Typography>
                <Divider sx={{ borderColor: "#555", mb: 1 }} />

                <Typography
                  variant="body1"
                  sx={{
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <strong>Name:</strong>{" "}
                  <span style={{ marginLeft: "8px", fontWeight: "lighter" }}>
                    {currentUser?.displayName || employeeName}
                  </span>
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.9rem",
                  }}
                >
                  <strong>Role:</strong>{" "}
                  <span style={{ marginLeft: "8px", fontWeight: "lighter" }}>
                    {currentUser?.role || "Staff"}
                  </span>
                </Typography>

                {currentUser?.email && (
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 0.5,
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Email sx={{ fontSize: 16, mr: 1, color: "#f15a22" }} />
                    <span>{currentUser.email}</span>
                  </Typography>
                )}

                {currentUser?.username && (
                  <Typography
                    variant="body1"
                    sx={{ mb: 0.5, fontSize: "0.9rem", fontWeight: "lighter" }}
                  >
                    <strong>Username:</strong> {currentUser.username}
                  </Typography>
                )}

                <Divider sx={{ borderColor: "#555", my: 1 }} />

                <Typography
                  variant="body2"
                  sx={{
                    color: "#aaa",
                    fontSize: "0.8rem",
                    mt: 1,
                    textAlign: "center",
                  }}
                >
                  Logged in since: {formatLoginTime()}
                </Typography>
              </Box>
            </Popover>
          </Box>
        )}

        {/* Logout Button */}
        <IconButton sx={{ color: "#f15a22" }} onClick={handleLogoutClick}>
          <ExitToApp sx={{ fontSize: 24 }} />
        </IconButton>
        <Typography
          variant="body2"
          sx={{
            color: "#fff",
            fontWeight: "lighter",
            marginTop: 1,
            fontSize: "0.75rem",
          }}
        >
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
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#121212",
              color: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: 24,
              textAlign: "center",
              width: 300,
            }}
          >
            <Typography variant="h6">
              Are you sure you want to log out?
            </Typography>
            <Box sx={{ marginTop: 2 }}>
              <Button
                onClick={handleConfirmLogout}
                sx={{
                  backgroundColor: "#f15a22",
                  color: "#fff",
                  marginRight: 2,
                  "&:hover": {
                    backgroundColor: "#e15b1f",
                  },
                }}
              >
                Yes
              </Button>
              <Button
                onClick={handleCloseModal}
                sx={{
                  borderColor: "#f15a22",
                  color: "#f15a22",
                  "&:hover": {
                    backgroundColor: "#333",
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
