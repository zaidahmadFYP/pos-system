"use client"

import { useState } from "react"
import { Box, Button, Typography } from "@mui/material"
import ArrowForwardIcon from "@mui/icons-material/ArrowForward"
import { menuCategories } from "./MenuData"
import MainMenuGrid from "./MainMenuGrid"
import MenuGrid from "./MenuGrid"
import OrderTypeGrid from "./OrderTypeGrid"
import OrderSummary from "./OrderSummary"

const Orders = () => {
  const [menuState, setMenuState] = useState({
    showMenu: false,
    orderType: null,
    activeCategory: null,
  })

  // Add state for selected items
  const [selectedItems, setSelectedItems] = useState([])

  const handleToggleMenu = () => {
    setMenuState({
      showMenu: !menuState.showMenu,
      orderType: null,
      activeCategory: null,
    })
  }

  const handleOrderTypeSelect = (orderType) => {
    setMenuState({
      ...menuState,
      orderType: orderType,
    })
  }

  const handleCategoryClick = (categoryId) => {
    setMenuState({
      ...menuState,
      activeCategory: categoryId,
    })
  }

  const handlePreviousMenu = () => {
    setMenuState({
      ...menuState,
      orderType: null,
    })
  }

  // Handle item selection
  const handleItemSelect = (item) => {
    const existingItem = selectedItems.find((i) => i.id === item.id)

    if (existingItem) {
      // If item exists, increment quantity
      setSelectedItems(selectedItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)))
    } else {
      // If item doesn't exist, add it with quantity 1
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
  }

  // Handle clearing all items
  const handleClearItems = () => {
    setSelectedItems([])
  }

  // Handle deleting individual item
  const handleDeleteItem = (itemId) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId))
  }

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
  }

  // Find the active category if one is selected
  const activeCategory = menuState.activeCategory
    ? menuCategories.find((cat) => cat.id === menuState.activeCategory)
    : null

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#121212" }}>
      {/* Menu Section */}
      <Box sx={{ flex: 1, p: 3, color: "white", position: "relative" }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h5">Orders</Typography>
        </Box>

        {/* Buttons in a Column Layout */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, position: "relative", alignItems: "flex-start" }}>
          <Button variant="contained" sx={buttonStyle} onClick={handleToggleMenu}>
            Quick Menu
          </Button>

          {menuState.showMenu && (
            <Box sx={{ display: "flex", justifyContent: "center", position: "absolute", left: 100, top: 25 }}>
              <ArrowForwardIcon sx={{ fontSize: "2rem" }} />
            </Box>
          )}

          <Button variant="contained" sx={buttonStyle}>
            Actions
          </Button>
        </Box>

        {/* Show Order Type Selection first */}
        {menuState.showMenu && !menuState.orderType && <OrderTypeGrid onOrderTypeSelect={handleOrderTypeSelect} />}

        {/* Show Categories after order type is selected */}
        {menuState.showMenu && menuState.orderType && !menuState.activeCategory && (
          <MainMenuGrid
            categories={menuCategories}
            onCategoryClick={handleCategoryClick}
            onPreviousMenu={handlePreviousMenu}
          />
        )}

        {/* Show Menu Items when category is selected */}
        {menuState.showMenu && menuState.orderType && activeCategory && (
          <MenuGrid
            category={activeCategory}
            onPreviousMenu={() => {
              setMenuState({
                ...menuState,
                activeCategory: null,
              })
            }}
            onItemClick={handleItemSelect}
          />
        )}
      </Box>

      {/* Order Summary Panel */}
      <OrderSummary selectedItems={selectedItems} onClearItems={handleClearItems} onDeleteItem={handleDeleteItem} />
    </Box>
  )
}

export default Orders

