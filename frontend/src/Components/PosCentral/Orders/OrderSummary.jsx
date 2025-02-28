import { Box, Button, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material"

const OrderSummary = ({ selectedItems = [] }) => {
  // Calculate totals
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
  const tax = subtotal * 0.13 // Assuming 13% tax
  const total = subtotal + tax

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

      {/* Items Table */}
      <Paper sx={{ mb: 4, backgroundColor: "#1E1E1E" }}>
        <Table
          sx={{
            "& .MuiTableCell-root": {
              color: "white",
              borderColor: "#333",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>ITEM</TableCell>
              <TableCell align="center">QUANTITY</TableCell>
              <TableCell align="center">ITEM ID</TableCell>
              <TableCell align="right">PRICE</TableCell>
              <TableCell align="right">TOTAL</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="center">{item.id}</TableCell>
                <TableCell align="right">{item.price || "0.00"}</TableCell>
                <TableCell align="right">{((item.price || 0) * item.quantity).toFixed(2)}</TableCell>
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
      <Box sx={{ textAlign: "right", mb: 4 }}>
        <Typography variant="body1" color="gray">
          Subtotal: <span style={{ color: "#FFA500" }}>{subtotal.toFixed(2)}</span>
        </Typography>
        <Typography variant="body1" color="gray">
          Tax: <span style={{ color: "#FFA500" }}>{tax.toFixed(2)}</span>
        </Typography>
        <Typography variant="h6" sx={{ color: "#FFA500", mt: 1 }}>
          Total: {total.toFixed(2)}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <Button variant="contained" sx={{ backgroundColor: "#FFA500", height: 50 }}>
          SEND TO KITCHEN
        </Button>
        <Button variant="contained" sx={{ backgroundColor: "#4CAF50", height: 50 }}>
          RECALL TRANSACTION
        </Button>
      </Box>
    </Box>
  )
}

export default OrderSummary

