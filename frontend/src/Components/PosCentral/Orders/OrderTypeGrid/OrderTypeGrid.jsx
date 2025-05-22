import { Box } from "@mui/material"
import MenuButton from "../MenuButton/MenuButton"

const OrderTypeGrid = ({ onOrderTypeSelect }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 2,
        mt: 0,
        position: "absolute",
        left: 170,
        top: 87,
        zIndex: 1,
      }}
    >
      <MenuButton label="Dine In" onClick={() => onOrderTypeSelect("dine-in")} />
      <MenuButton label="Takeaway" onClick={() => onOrderTypeSelect("takeaway")} />
      <MenuButton label="Delivery" onClick={() => onOrderTypeSelect("delivery")} />
    </Box>
  )
}

export default OrderTypeGrid

