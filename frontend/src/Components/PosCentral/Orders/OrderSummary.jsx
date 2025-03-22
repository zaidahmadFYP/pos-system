import { useState } from "react"
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import PaymentMethodSelector from "./PaymentMethodSelector"

const OrderSummary = ({ selectedItems = [], onClearItems, onDeleteItem }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  })
  const [latestTransactionID, setLatestTransactionID] = useState(null)

  // Calculate totals
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  // Apply different tax rates based on payment method
  const taxRate = selectedPaymentMethod === "cash" ? 0.15 : 0.05
  const tax = subtotal * taxRate
  const total = subtotal + tax

  const buttonStyle = {
    height: 45,
    fontSize: "0.9rem",
  }

  // disabled button style pattern
  const createDisabledStyle = (baseColor) => ({
    "&.Mui-disabled": {
      backgroundColor: `${baseColor}4D`, // 30% opacity version of the color
      color: "rgba(255, 255, 255, 0.5)",
    },
  })

  const handleSendToKitchen = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL  ||  "http://localhost:5001"
      
      // Step 1: Fetch FinishedGoods collection to get raw ingredients for each item
      const finishedGoodsResponse = await fetch(`${apiUrl}/api/menu/finishedgoods`)
      if (!finishedGoodsResponse.ok) {
        throw new Error("Failed to fetch finished goods data")
      }
      const finishedGoods = await finishedGoodsResponse.json()
      
      // Step 2: Fetch BOM collection to get current inventory of raw ingredients
      const bomResponse = await fetch(`${apiUrl}/api/menu/bom`)
      if (!bomResponse.ok) {
        throw new Error("Failed to fetch BOM data")
      }
      const bomData = await bomResponse.json()
      
      // Step 3: Calculate quantities to subtract from BOM based on selected items
      const updatedBomData = [...bomData] // Create a copy to avoid direct mutation
      
      // Map of quantities to reduce for each rawID
      const rawIngredientsToReduce = {}
      
      // Loop through selected items and match with FinishedGoods
      selectedItems.forEach(item => {
        // Find the corresponding finished good
        const finishedGood = finishedGoods.find(fg => fg.id === item.id)
        
        if (finishedGood && finishedGood.rawIngredients && Array.isArray(finishedGood.rawIngredients)) {
          // Process each raw ingredient needed for this item
          finishedGood.rawIngredients.forEach(ingredient => {
            const rawId = ingredient.RawID
            const quantityToReduce = ingredient.RawConsume * item.quantity
            
            // Add to our tracking object
            if (rawIngredientsToReduce[rawId]) {
              rawIngredientsToReduce[rawId] += quantityToReduce
            } else {
              rawIngredientsToReduce[rawId] = quantityToReduce
            }
          })
        } else {
          console.warn(`No raw ingredients found for item: ${item.id}`)
        }
      })
      
      // Apply reductions to the BOM data
      updatedBomData.forEach(bomItem => {
        if (rawIngredientsToReduce[bomItem.RawID]) {
          bomItem.Quantity -= rawIngredientsToReduce[bomItem.RawID]
          // Prevent negative quantities
          if (bomItem.Quantity < 0) {
            bomItem.Quantity = 0
          }
        }
      })
      
      // Step 4: Update the BOM collection with the new quantities
      const updateBomResponse = await fetch(`${apiUrl}/api/menu/bom`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBomData),
      })
      
      if (!updateBomResponse.ok) {
        const errorText = await updateBomResponse.text()
        throw new Error(`Failed to update BOM: ${errorText}`)
      }
      
      // Step 5: Send the order to the server
      const orderData = {
        selectedItems: selectedItems.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: total,
        selectedPaymentMethod: selectedPaymentMethod,
      }
      
      const orderResponse = await fetch(`${apiUrl}/api/transactions/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })
      
      // Check if the response is JSON
      const contentType = orderResponse.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await orderResponse.text()
        throw new Error(`Received non-JSON response: ${text.substring(0, 100)}...`)
      }
      
      // Handle the response from the order creation
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.message || "Failed to send order")
      }
      
      const result = await orderResponse.json()
      console.log(result.message)
      console.log("Raw ingredients updated successfully")
      
      // Set the transaction ID from the response
      if (result.transactionID) {
        setLatestTransactionID(result.transactionID)
        setSnackbar({
          open: true,
          message: `Order #${result.transactionID} sent to kitchen successfully!`,
          severity: "success"
        })
      } else {
        setSnackbar({
          open: true,
          message: "Order sent to kitchen successfully!",
          severity: "success"
        })
      }
      
      // Optional: Clear the items after successful order
      onClearItems()
      
    } catch (error) {
      console.error("Error:", error)
      setError(error.message || "Failed to send order")
      setSnackbar({
        open: true,
        message: error.message || "Failed to send order",
        severity: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRecallTransaction = () => {
    setSnackbar({
      open: true,
      message: "Transaction recalled successfully",
      severity: "info"
    })
  }
  
  const handleClearItems = () => {
    onClearItems()
    setSnackbar({
      open: true,
      message: "All items cleared from order",
      severity: "info"
    })
  }
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbar({
      ...snackbar,
      open: false
    })
  }
  
  return (
    <Box
      sx={{
        width: "800px",
        backgroundColor: "#121212",
        color: "white",
        p: 3,
        borderLeft: "1px solid #333",
      }}
    >
      <Typography variant="h6" sx={{ mb: 3 }}>
        Order Details
      </Typography>

      {/* Payment Method Selector */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Select Payment Method
        </Typography>
        <PaymentMethodSelector selectedMethod={selectedPaymentMethod} onSelectMethod={setSelectedPaymentMethod} />
      </Box>

      {/* Latest Transaction ID (if available) */}
      {latestTransactionID && (
        <Box sx={{ mb: 3, p: 2, backgroundColor: "#1E1E1E", borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ color: "#FFA500" }}>
            Last Transaction ID: {latestTransactionID}
          </Typography>
        </Box>
      )}

      {/* Items Table */}
      <Paper sx={{ mb: 3 }}>
        <Table
          sx={{
            "& .MuiTableCell-root": {
              color: "white",
              borderColor: "#333",
              backgroundColor: "#1E1E1E",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>ITEM</TableCell>
              <TableCell align="center">QUANTITY</TableCell>
              <TableCell align="right">PRICE</TableCell>
              <TableCell align="right">TOTAL</TableCell>
              <TableCell align="center">ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{item.price?.toFixed(2) || "0.00"}</TableCell>
                <TableCell align="right">{((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => onDeleteItem(item.id)}
                    sx={{
                      color: "#FF4444",
                      "&:hover": {
                        backgroundColor: "rgba(255, 68, 68, 0.1)",
                      },
                    }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {selectedItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No items selected
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Error message */}
      {error && (
        <Typography variant="body2" sx={{ color: "#FF4444", mb: 2, textAlign: "center" }}>
          {error}
        </Typography>
      )}

      {/* Totals */}
      <Box sx={{ textAlign: "right", mb: 3 }}>
        <Typography variant="body1" color="gray">
          Subtotal: <span style={{ color: "#FFA500" }}>{subtotal.toFixed(2)}</span>
        </Typography>
        <Typography variant="body1" color="gray">
          Tax ({taxRate * 100}%): <span style={{ color: "#FFA500" }}>{tax.toFixed(2)}</span>
        </Typography>
        <Typography variant="h6" sx={{ color: "#FFA500", mt: 1 }}>
          Total: {total.toFixed(2)}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Button
          variant="contained"
          sx={{
            ...buttonStyle,
            backgroundColor: "#FFA500",
            ...createDisabledStyle("#FFA500"),
          }}
          disabled={!selectedPaymentMethod || isLoading || selectedItems.length === 0}
          onClick={handleSendToKitchen}
        >
          {isLoading ? "SENDING..." : "SEND TO KITCHEN"}
        </Button>
        <Button 
          variant="contained" 
          sx={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
          onClick={handleRecallTransaction}
        >
          RECALL TRANSACTION
        </Button>
        <Button
          variant="contained"
          sx={{
            ...buttonStyle,
            backgroundColor: "#FF4444",
            ...createDisabledStyle("#FF4444"),
          }}
          onClick={handleClearItems}
          disabled={selectedItems.length === 0 || isLoading}
        >
          CLEAR ITEMS
        </Button>
      </Box>

      {/* Snackbar notification (bottom right) */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default OrderSummary