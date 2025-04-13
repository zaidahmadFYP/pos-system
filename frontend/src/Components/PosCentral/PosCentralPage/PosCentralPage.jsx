"use client"

import { useState, useContext, useEffect } from "react"
import { Box, Drawer, useTheme, useMediaQuery } from "@mui/material"
import { useNavigate } from "react-router-dom"
import Header from "./Header/Header"
import LeftColumn from "./LeftColumn/LeftColumn"
import CenterColumn from "./CenterColumn/CenterColumn"
import RightColumn from "./RightColumn/RightColumn"
import DrawerContent from "./DrawerContent/DrawerContent/DrawerContent"
import { UserContext } from "../../../context/UserContext"

const PosCentralPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const { employeeName } = useContext(UserContext)
  const nameToUse = employeeName || "Unknown User"
  const [refreshKey, setRefreshKey] = useState(0)
  const navigate = useNavigate()

  // Add theme and media queries for responsive design
  const theme = useTheme()
  const isSmallScreen = useMediaQuery("(max-width:1080px)")
  const isLowHeight = useMediaQuery("(max-height:720px)")
  const isMediumScreen = useMediaQuery("(min-width:1081px) and (max-width:1366px)")

  // Combined check for 1080x720 resolution
  const is1080x720 = isSmallScreen && isLowHeight

  useEffect(() => {
    console.log("Employee Name in PosCentralPage (from context, useEffect):", nameToUse)
  }, [nameToUse])

  const toggleDrawer = (task) => () => {
    setSelectedTask(task)
    setDrawerOpen(!drawerOpen)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedTask(null)
    setRefreshKey((prev) => prev + 1)
  }

  const handleNavigation = (path) => {
    navigate(`/loop/${path}`) // Update to use the correct nested path
  }

  // Get drawer width based on screen size
  const getDrawerWidth = () => {
    if (isSmallScreen) return "80%" // Wider drawer on small screens
    if (isMediumScreen) return "40%"
    return "20%" // Original width on large screens
  }

  return (
    <Box
      sx={{
        p: is1080x720 ? 0.5 : isSmallScreen ? 1 : isMediumScreen ? 2 : 3,
        color: "white",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: is1080x720 ? 0.5 : isSmallScreen ? 1 : 2,
        }}
      >
        <Header />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: "space-between",
          gap: is1080x720 ? 1 : isSmallScreen ? 2 : 0,
        }}
      >
        <LeftColumn />
        <CenterColumn toggleDrawer={toggleDrawer} handleNavigation={handleNavigation} />
        <RightColumn toggleDrawer={toggleDrawer} refreshKey={refreshKey} />
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: getDrawerWidth(),
            boxSizing: "border-box",
            height: "100vh",
            overflowY: "hidden",
            overflowX: "hidden",
            background: "linear-gradient(180deg, #1f1f1f 0%, #2a2a2a 100%)",
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            padding: is1080x720 ? 0.5 : isSmallScreen ? 1 : 2,
          },
        }}
      >
        <DrawerContent selectedTask={selectedTask} onClose={handleCloseDrawer} employeeName={nameToUse} />
      </Drawer>
    </Box>
  )
}

export default PosCentralPage
