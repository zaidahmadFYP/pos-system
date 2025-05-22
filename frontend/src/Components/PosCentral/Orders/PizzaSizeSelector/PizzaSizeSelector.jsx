import { Box, Button } from "@mui/material"

const PizzaSizeSelector = ({ onSelect, onClose }) => {
  const sizes = [
    { id: "small", name: "Small", priceMultiplier: 1 },
    { id: "medium", name: "Medium", priceMultiplier: 1.5 },
    { id: "large", name: "Large", priceMultiplier: 2 },
  ]

  const buttonStyle = {
    backgroundColor: "#FFA500",
    width: "100%",  // Adjust width to fill the container
    height: 85,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    wordWrap: "break-word",
    whiteSpace: "normal",
    fontSize: "0.75rem",
    marginBottom: 1,  // Add some space between buttons
  }

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#1E1E1E",
        padding: 3,
        borderRadius: 1,
        border: "1px solid #333",
        display: "flex",
        flexDirection: "column",  // Stack the buttons vertically
        gap: 2,
        zIndex: 1000,
        width: "200px",  // Set a fixed width for the container
      }}
    >
      {sizes.map((size) => (
        <Button key={size.id} variant="contained" sx={buttonStyle} onClick={() => onSelect(size)}>
          {size.name}
        </Button>
      ))}
      <Button variant="contained" sx={{ ...buttonStyle, backgroundColor: "#FF4444" }} onClick={onClose}>
        Cancel
      </Button>
    </Box>
  )
}

export default PizzaSizeSelector
