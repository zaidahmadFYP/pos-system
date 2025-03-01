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
} from "@mui/material"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import PaymentMethodSelector from "./PaymentMethodSelector"

const OrderSummary = ({ selectedItems = [], onClearItems, onDeleteItem }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)

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

  // Common disabled button style pattern
  const createDisabledStyle = (baseColor) => ({
    "&.Mui-disabled": {
      backgroundColor: `${baseColor}4D`, // 30% opacity version of the color
      color: "rgba(255, 255, 255, 0.5)",
    },
  })

  // Handle send to kitchen action
  const handleSendToKitchen = async () => {
    try {
      const orderData = {
        selectedItems: selectedItems,
        total: total,
        selectedPaymentMethod: selectedPaymentMethod,
      };
    
      // Use environment variable for the API URL
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      // Rest of your function remains the same
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to send order:", errorText);
        return;
      }
    
      const result = await response.json();
      console.log(result.message);
      onClearItems();
    } catch (error) {
      console.error("Error:", error);
    }
  };
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
          disabled={!selectedPaymentMethod}
          onClick={handleSendToKitchen}
        >
          SEND TO KITCHEN
        </Button>
        <Button variant="contained" sx={{ ...buttonStyle, backgroundColor: "#4CAF50" }}>
          RECALL TRANSACTION
        </Button>
        <Button
          variant="contained"
          sx={{
            ...buttonStyle,
            backgroundColor: "#FF4444",
            ...createDisabledStyle("#FF4444"),
          }}
          onClick={onClearItems}
          disabled={selectedItems.length === 0}
        >
          CLEAR ITEMS
        </Button>
      </Box>
    </Box>
  )
}

export default OrderSummary
