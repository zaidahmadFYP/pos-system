import { Box } from "@mui/material"
import MenuButton from "../MenuButton/MenuButton"

const MainMenuGrid = ({ categories, onCategoryClick, onPreviousMenu }) => {
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
      {categories.map((category) => (
        <MenuButton key={category.id} label={category.name} onClick={() => onCategoryClick(category.id)} />
      ))}
      <MenuButton label="Previous Menu" onClick={onPreviousMenu} />
    </Box>
  )
}

export default MainMenuGrid

