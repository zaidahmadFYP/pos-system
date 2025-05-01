import { useState, useEffect } from "react";
import { Box, Button, Typography, CircularProgress, Alert } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { fetchMenuCategories } from "./MenuData/MenuData";
import MainMenuGrid from "./MainMenuGrid/MainMenuGrid";
import MenuGrid from "./MenuGrid/MenuGrid";
import OrderTypeGrid from "./OrderTypeGrid/OrderTypeGrid";
import OrderSummary from "./OrderSummary/OrderSummary";
import { useLocation, useNavigate } from "react-router-dom";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuState, setMenuState] = useState({
    showMenu: false,
    orderType: null,
    activeCategory: null,
  });

  const [selectedItems, setSelectedItems] = useState(() => {
    const recalledTransaction = location.state?.recalledTransaction;
    const items = recalledTransaction ? recalledTransaction.items : [];
    console.log("Initial selectedItems in Orders:", items);
    return items;
  });

  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [initialPaymentMethod, setInitialPaymentMethod] = useState(() => {
    const recalledTransaction = location.state?.recalledTransaction;
    return recalledTransaction ? recalledTransaction.paymentMethod : null;
  });

  // Track window size for responsive styling
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine screen size
  const getResponsiveSize = () => {
    if (windowWidth < 600) return 'xs';
    if (windowWidth < 960) return 'sm';
    if (windowWidth <= 1366) return 'md-compact';
    return 'md';
  };

  const size = getResponsiveSize();
  const isCompactHeight = windowHeight <= 768;

  // Dynamic font size for subtitle
  const getFontSize = () => {
    switch (size) {
      case 'xs': return '0.9rem';
      case 'sm': return '1rem';
      case 'md-compact': return '1.1rem';
      default: return '1.25rem';
    }
  };

  // Dynamic vertical spacing
  const getVerticalSpacing = () => {
    if (isCompactHeight) {
      switch (size) {
        case 'xs': return 0.5;
        case 'sm': return 1;
        default: return 2;
      }
    } else {
      switch (size) {
        case 'xs': return 1;
        case 'sm': return 1.5;
        default: return 2;
      }
    }
  };

  // Update selectedItems and payment method when recalledTransaction changes
  useEffect(() => {
    const recalledTransaction = location.state?.recalledTransaction;
    if (recalledTransaction && recalledTransaction.items) {
      console.log("Updating selectedItems with recalled transaction:", recalledTransaction.items);
      setSelectedItems(recalledTransaction.items);
      setInitialPaymentMethod(recalledTransaction.paymentMethod);
    } else {
      setSelectedItems([]);
      setInitialPaymentMethod(null);
    }
  }, [location.state?.recalledTransaction]);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMenuCategories();
        console.log("Fetched menu data:", data);
        setMenuCategories(data);
      } catch (error) {
        console.error("Error loading menu data:", error);
        setError(error.message || "Failed to load menu data");
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  const handleToggleMenu = () => {
    setMenuState({
      showMenu: !menuState.showMenu,
      orderType: null,
      activeCategory: null,
    });
  };

  const handleOrderTypeSelect = (orderType) => {
    setMenuState({
      ...menuState,
      orderType: orderType,
    });
  };

  const handleCategoryClick = (categoryId) => {
    setMenuState({
      ...menuState,
      activeCategory: categoryId,
    });
  };

  const handlePreviousMenu = () => {
    setMenuState({
      ...menuState,
      orderType: null,
    });
  };

  const handleItemSelect = (item) => {
    const existingItem = selectedItems.find((i) => i.id === item.id);

    if (existingItem) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleClearItems = () => {
    setSelectedItems([]);
    setInitialPaymentMethod(null);
    navigate('/loop/orders', { state: { recalledTransaction: null } });
  };

  const handleDeleteItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  const buttonStyle = {
    backgroundColor: "#FFA500",
    width: 85,
    height: 85,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    wordWrap: "break-word",
    whiteSpace: "normal",
    fontSize: "0.75rem",
  };

  const activeCategory = menuState.activeCategory
    ? menuCategories.find((cat) => cat.id === menuState.activeCategory)
    : null;

  if (loading) {
    return (
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          zIndex: 1000,
        }}
      >
        <CircularProgress sx={{ color: "#f15a22" }} size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 3,
          backgroundColor: "#121212",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="error" sx={{ backgroundColor: "#2a2a2a", color: "white" }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212" }}>
      <Box sx={{ flex: 1, p: 3, color: "white", position: "relative" }}>
        
        {/* Orders Heading */}
        <Box sx={{ mb: getVerticalSpacing() }}>
          <Typography
            variant="h6"
            sx={{
              fontSize: getFontSize(),
              fontWeight: 'medium',
              borderLeft: '3px solid #f15a22',
              paddingLeft: 1,
              color: 'white',
              marginBottom:3.9,
            }}
          >
            Orders
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, position: "relative", alignItems: "flex-start" }}>
          <Button variant="contained" sx={buttonStyle} onClick={handleToggleMenu}>
            Quick Menu
          </Button>

          {menuState.showMenu && (
            <Box sx={{ display: "flex", justifyContent: "center", position: "absolute", left: 100, top: 25 }}>
              <ArrowForwardIcon sx={{ fontSize: "2rem" }} />
            </Box>
          )}
        </Box>

        {menuState.showMenu && !menuState.orderType && <OrderTypeGrid onOrderTypeSelect={handleOrderTypeSelect} />}

        {menuState.showMenu && menuState.orderType && !menuState.activeCategory && (
          <MainMenuGrid
            categories={menuCategories}
            onCategoryClick={handleCategoryClick}
            onPreviousMenu={handlePreviousMenu}
          />
        )}

        {menuState.showMenu && menuState.orderType && activeCategory && (
          <MenuGrid
            category={activeCategory}
            onPreviousMenu={() => {
              setMenuState({
                ...menuState,
                activeCategory: null,
              });
            }}
            onItemClick={handleItemSelect}
          />
        )}
      </Box>

      <OrderSummary 
        selectedItems={selectedItems} 
        onClearItems={handleClearItems} 
        onDeleteItem={handleDeleteItem}
        initialPaymentMethod={initialPaymentMethod}
        recalledTransaction={location.state?.recalledTransaction}
      />
    </Box>
  );
};

export default Orders;