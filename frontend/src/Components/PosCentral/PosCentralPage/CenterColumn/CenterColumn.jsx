"use client"

import { Box, Paper, Typography, Button, Divider, useTheme, useMediaQuery } from "@mui/material"

const CenterColumn = ({ toggleDrawer, handleNavigation }) => {
  // Add theme and media queries for responsive design
  const theme = useTheme()
  const isSmallScreen = useMediaQuery("(max-width:1080px)")
  const isLowHeight = useMediaQuery("(max-height:720px)")
  const isMediumScreen = useMediaQuery("(min-width:1081px) and (max-width:1366px)")

  // Combined check for 1080x720 resolution
  const is1080x720 = isSmallScreen && isLowHeight

  // Responsive styling based on screen size
  const getPaperStyles = () => ({
    backgroundColor: "#1f1f1f",
    borderRadius: isSmallScreen ? 2 : 3,
    padding: is1080x720 ? 1 : isSmallScreen ? 1.5 : isMediumScreen ? 2 : 3,
    display: "flex",
    flexDirection: "column",
    gap: is1080x720 ? 1 : isSmallScreen ? 1.5 : isMediumScreen ? 2 : 3,
    height: "100%",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
  })

  const getButtonStyles = () => ({
    backgroundColor: "#f15a22",
    color: "white",
    padding: is1080x720 ? "8px" : isSmallScreen ? "12px" : isMediumScreen ? "14px" : "16px",
    textTransform: "none",
    borderRadius: isSmallScreen ? 1 : 2,
    "&:hover": {
      backgroundColor: "#d14c1b",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      transform: is1080x720 ? "scale(1.03)" : isSmallScreen ? "scale(1.05)" : "scale(1.1)",
    },
    fontWeight: "bold",
    minWidth: is1080x720 ? "140px" : isSmallScreen ? "160px" : isMediumScreen ? "180px" : "200px",
    fontSize: is1080x720 ? "0.8rem" : isSmallScreen ? "0.85rem" : isMediumScreen ? "0.95rem" : "1rem",
    transition: "transform 0.15s ease-in-out",
  })

  const actions = [
    // { label: "SELECT HARDWARE STATION", action: toggleDrawer("SELECT HARDWARE STATION") },
    { label: "SHOW JOURNAL", action: () => handleNavigation("show-journal") },
    { label: "SUSPEND TRANSACTION", action: () => handleNavigation("suspend-transaction") },
    { label: "RECALL TRANSACTION", action: () => handleNavigation("recall-transaction") },
  ]

  return (
    <Box sx={{ flex: 1, p: is1080x720 ? 0.5 : isSmallScreen ? 1 : 2, textAlign: "center" }}>
      <Paper sx={getPaperStyles()}>
        <Typography
          variant={isSmallScreen ? "h6" : "h5"}
          sx={{
            color: "#f15a22",
            fontWeight: "bold",
            fontFamily: "Cocon",
            fontSize: is1080x720 ? "1rem" : isSmallScreen ? "1.1rem" : isMediumScreen ? "1.3rem" : "1.5rem",
          }}
        >
          POS ACTIONS
        </Typography>
        <Divider
          sx={{
            borderColor: "#808080",
            margin: "3px auto",
            width: "0.65",
          }}
        />
        {actions.map(({ label, action }) => (
          <Button key={label} onClick={action} sx={getButtonStyles()}>
            {label}
          </Button>
        ))}
      </Paper>
    </Box>
  )
}

export default CenterColumn
