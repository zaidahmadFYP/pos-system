import { Box, Button } from "@mui/material"

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }) => {
  const methods = [
    { id: "cash", name: "CASH", color: "#FFFFFF", textColor: "#000000" },
    { id: "hbl", name: "HBL", color: "#008080", textColor: "#FFFFFF" },
    { id: "meezan", name: "MEEZAN", color: "#FFA500", textColor: "#FFFFFF" },
    { id: "loopay", name: "LOOPAY", color: "#4A90E2", textColor: "#FFFFFF" },
  ]

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
      {methods.map((method) => (
        <Button
          key={method.id}
          variant={selectedMethod === method.id ? "contained" : "outlined"}
          onClick={() => onSelectMethod(method.id)}
          sx={{
            backgroundColor: method.color,
            color: method.textColor,
            width: "100px",
            height: "60px",
            border: selectedMethod === method.id ? "2px solid #FFF" : "1px solid #333",
            "&:hover": {
              backgroundColor: method.color,
              opacity: 0.9,
            },
          }}
        >
          {method.name}
        </Button>
      ))}
    </Box>
  )
}

export default PaymentMethodSelector

