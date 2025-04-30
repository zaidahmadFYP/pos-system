import { useState } from "react"
import { Box } from "@mui/material"
import MenuButton from "../MenuButton/MenuButton"

const MenuGrid = ({ category, onItemClick, onPreviousMenu }) => {
  const [selectedPizza, setSelectedPizza] = useState(null)

  const handleItemClick = (item) => {
    if (item.isPizza) {
      setSelectedPizza(item)
    } else {
      onItemClick(item)
    }
  }

  const handleSizeSelect = (size) => {
    if (selectedPizza) {
      const sizeMultipliers = {
        Small: 1,
        Medium: 1.5,
        Large: 2,
      }

      const itemWithSize = {
        ...selectedPizza,
        name: `${selectedPizza.name} (${size})`,
        price: selectedPizza.price * sizeMultipliers[size],
        size: size.toLowerCase(),
      }
      onItemClick(itemWithSize)
      setSelectedPizza(null)
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `repeat(${category.columns || 2}, 1fr)`,
          gap: 2,
          mt: 0,
          position: "absolute",
          left: 170,
          top: 87,
          zIndex: 1,
        }}
      >
        {category.items.map((item) => (
          <MenuButton
            key={item.id}
            label={item.name}
            smallText={category.smallText}
            onClick={() => handleItemClick(item)}
          />
        ))}
        <MenuButton label="Previous Menu" onClick={onPreviousMenu} />
      </Box>

      {selectedPizza && (
        <Box
          sx={{
            display: "flex",  // Use flex to arrange the buttons vertically
            flexDirection: "column",  // Stack the buttons vertically for pizza sizes
            gap: 2,
            mt: 0,
            position: "absolute",
            left: 450,
            top: 87,
            zIndex: 1,
          }}
        >
          <MenuButton label="Small" onClick={() => handleSizeSelect("Small")} />
          <MenuButton label="Medium" onClick={() => handleSizeSelect("Medium")} />
          <MenuButton label="Large" onClick={() => handleSizeSelect("Large")} />
          <MenuButton label="Cancel" onClick={() => setSelectedPizza(null)} />
        </Box>
      )}
    </>
  )
}

export default MenuGrid
