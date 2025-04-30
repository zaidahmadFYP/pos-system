"use client"
import { Box, Paper, useTheme, useMediaQuery } from "@mui/material"

const LeftColumn = () => {
  // Add theme and media queries for responsive design
  const theme = useTheme()
  const isSmallScreen = useMediaQuery("(max-width:1080px)")
  const isLowHeight = useMediaQuery("(max-height:720px)")
  const isMediumScreen = useMediaQuery("(min-width:1081px) and (max-width:1366px)")

  // Combined check for 1080x720 resolution
  const is1080x720 = isSmallScreen && isLowHeight

  // Calculate responsive dimensions
  const getSize = () => {
    if (is1080x720) return { width: "100%", maxWidth: "350px" }
    if (isSmallScreen) return { width: "100%", maxWidth: "400px" }
    if (isMediumScreen) return { width: "100%", maxWidth: "500px" }
    return { width: "100%", maxWidth: "600px" }
  }

  const size = getSize()

  return (
    <Box
      sx={{
        flex: isSmallScreen ? "1 1 100%" : isMediumScreen ? "0 0 500px" : "0 0 600px",
        p: is1080x720 ? 0.5 : isSmallScreen ? 1 : 2,
        textAlign: "left",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          width: size.width,
          maxWidth: size.maxWidth,
          // Use aspect-ratio to maintain square shape
          aspectRatio: is1080x720 ? "4/3" : "1/1", // Change aspect ratio for 1080x720
          backgroundColor: "#1f1f1f",
          borderRadius: isSmallScreen ? 2 : 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: is1080x720 ? 1 : isSmallScreen ? 2 : 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <img
          src="/images/loop_banner.png"
          alt="Content"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: isSmallScreen ? 8 : 12,
            boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.1)",
          }}
        />
      </Paper>
    </Box>
  )
}

export default LeftColumn
