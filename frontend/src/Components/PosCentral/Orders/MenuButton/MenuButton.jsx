import { Button } from "@mui/material"

const MenuButton = ({ label, onClick, smallText = false }) => {
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
    fontSize: smallText ? "0.65rem" : "0.75rem",
    minWidth: smallText ? 100 : undefined,
  }

  return (
    <Button variant="contained" sx={buttonStyle} onClick={onClick}>
      {label}
    </Button>
  )
}

export default MenuButton

