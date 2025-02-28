import { Box } from "@mui/material"
import MenuButton from "./MenuButton"

const MenuGrid = ({ category, onItemClick, onPreviousMenu }) => {
    return (
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
            onClick={() => onItemClick && onItemClick(item)}
          />
        ))}
        <MenuButton label="Previous Menu" onClick={onPreviousMenu} />
      </Box>
    )
  }
  
  export default MenuGrid

