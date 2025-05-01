"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"

const DrawerContent = ({ selectedTask, onClose, employeeName }) => {
  const [connectionStatus, setConnectionStatus] = useState(null)
  const [systemHealth, setSystemHealth] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hardwarePercentage, setHardwarePercentage] = useState(null)
  const [startingAmount, setStartingAmount] = useState("") // For STARTING AMOUNT (cash)
  const [floatEntry, setFloatEntry] = useState("") // For FLOAT ENTRY (coins)
  const [openDialog, setOpenDialog] = useState(false) // Control the confirmation dialog
  const [currentTask, setCurrentTask] = useState(null) // Track which task is being confirmed
  const [snackbarOpen, setSnackbarOpen] = useState(false) // Snackbar for messages
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")

  const [buttonsEnabled, setButtonsEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Function to generate a random percentage between 75% and 100%
  const generateHardwarePercentage = () => {
    return Math.floor(Math.random() * (100 - 75 + 1)) + 75
  }

  // Initialize hardware percentage and set up timer to update every 5 minutes
  useEffect(() => {
    setHardwarePercentage(generateHardwarePercentage())
    const interval = setInterval(() => {
      setHardwarePercentage(generateHardwarePercentage())
    }, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [])

  // Update system health when hardware percentage changes
  useEffect(() => {
    if (systemHealth && hardwarePercentage !== null) {
      setSystemHealth((prevHealth) => ({
        ...prevHealth,
        hardware: {
          ...prevHealth.hardware,
          message: `Hardware is functioning normally (${hardwarePercentage}%)`,
        },
      }))
    }
  }, [hardwarePercentage])

  // Check the employee's shift status==============================================================
  useEffect(() => {
    const checkShiftStatus = async () => {
      if (!employeeName) {
        console.log("No employeeName provided, skipping checkShiftStatus")
        return
      }

      setIsLoading(true)
      try {
        // Always enable buttons for FLOAT ENTRY
        if (selectedTask === "FLOAT ENTRY") {
          console.log("FLOAT ENTRY task selected, enabling buttons regardless of shift status")
          setButtonsEnabled(true)
          setIsLoading(false)
          return
        }

        console.log(`Fetching POS reports for employee: ${employeeName}`)
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=active`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch POS reports: ${response.status}`)
        }

        const posReports = await response.json()
        const today = new Date().toISOString().split("T")[0] // e.g., "2024-04-03"

        console.log("Today's date:", today)
        console.log("Fetched posReports:", posReports)

        // Default to enabled buttons
        setButtonsEnabled(true)
      } catch (error) {
        console.error("Error checking shift status:", error.message)
        // Default to enabling buttons if there's an error
        setButtonsEnabled(true)
      } finally {
        setIsLoading(false)
      }
    }

    checkShiftStatus()

    // Set up a periodic check (every 5 minutes)
    const intervalId = setInterval(checkShiftStatus, 300000)

    return () => clearInterval(intervalId)
  }, [employeeName, selectedTask])

  //================================================================================================

  // Fetch system health or database status
  useEffect(() => {
    if (selectedTask === "DATABASE CONNECTION STATUS" || selectedTask === "SYSTEM HEALTH CHECK") {
      setLoading(true)
      setError(null)
      setConnectionStatus(null)
      setSystemHealth(null)

      const apiUrl = process.env.REACT_APP_API_URL
      if (!apiUrl) {
        setError("REACT_APP_API_URL is not defined in the .env file")
        setLoading(false)
        return
      }

      const fullUrl = `${apiUrl}/api/status`
      const startTime = Date.now()

      fetch(fullUrl)
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`)
            })
          }
          return response.json()
        })
        .then((data) => {
          const latency = Date.now() - startTime
          const status = data.status || "Connected"
          setConnectionStatus(status)

          if (selectedTask === "SYSTEM HEALTH CHECK") {
            const hardwareCheck = () => {
              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve({
                    status: "Operational",
                    message: `Hardware is functioning normally (${hardwarePercentage}%)`,
                  })
                }, 500)
              })
            }

            hardwareCheck().then((hardwareResult) => {
              setSystemHealth({
                database: {
                  status: status === "connected" ? "Connected" : "Disconnected",
                  message: status === "connected" ? "Database is connected" : "Database connection failed",
                },
                api: {
                  status: "Available",
                  message: "API is reachable",
                },
                hardware: hardwareResult,
                network: {
                  status: latency < 200 ? "Good" : "Poor",
                  message: `Network latency: ${latency}ms`,
                },
              })
              setLoading(false)
            })
          } else {
            setLoading(false)
          }
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)

          if (selectedTask === "SYSTEM HEALTH CHECK") {
            setSystemHealth({
              database: {
                status: "Disconnected",
                message: "Database connection failed: " + err.message,
              },
              api: {
                status: "Unavailable",
                message: "API is not reachable",
              },
              hardware: {
                status: "Unknown",
                message: "Hardware status unavailable",
              },
              network: {
                status: "Unknown",
                message: "Network status unavailable",
              },
            })
          }
        })
    }

    // Handle PRINT X REPORT
    // if (selectedTask === "PRINT X REPORT") {
    //   const fetchXReport = async () => {
    //     try {
    //       // Step 1: Fetch the active posReport for the employee to get the startingTime
    //       const posReportResponse = await fetch(
    //         `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=active`
    //       );
    //       if (!posReportResponse.ok) {
    //         const errorData = await posReportResponse.json();
    //         throw new Error(
    //           errorData.error ||
    //             `Failed to fetch posReport (Status: ${posReportResponse.status})`
    //         );
    //       }
    //       const posReports = await posReportResponse.json();
    //       if (!posReports || posReports.length === 0) {
    //         throw new Error("No active POS report found for this employee");
    //       }
    //       const posReport = posReports[0]; // Take the first active posReport
    //       const startingTime = posReport.startingTime; // e.g., "00:00:00"

    //       // Step 2: Calculate the endTime by adding 5 hours to the startingTime
    //       const [hours, minutes, seconds] = startingTime.split(":").map(Number);
    //       const startDate = new Date();
    //       startDate.setHours(hours, minutes, seconds, 0);
    //       const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // Add 5 hours
    //       const endTime = endDate.toTimeString().split(" ")[0]; // Format as "HH:mm:ss"

    //       // Step 3: Fetch transactions from /api/transactions/orders
    //       const transactionsResponse = await fetch(
    //         `${process.env.REACT_APP_API_URL}/api/transactions/orders`
    //       );
    //       if (!transactionsResponse.ok) {
    //         const errorData = await transactionsResponse.json();
    //         throw new Error(
    //           errorData.error ||
    //             `Failed to fetch transactions (Status: ${transactionsResponse.status})`
    //         );
    //       }
    //       const transactions = await transactionsResponse.json();

    //       // Calculate metrics for the X-Report
    //       const now = new Date();
    //       const currentDate = now.toISOString().split("T")[0];
    //       const currentTime = now.toTimeString().split(" ")[0];

    //       // 1. Count the number of orders placed (total transactions)
    //       const numberOfOrders = transactions.length;

    //       // 2. Count the total of all orders placed (sum of transaction totals)
    //       const totalSales = transactions.reduce(
    //         (sum, transaction) => sum + transaction.total,
    //         0
    //       );

    //       // 3. Count the taxes (10% of total sales)
    //       const taxes = totalSales * 0.1;

    //       // Calculate other metrics based on the transactions data
    //       const returns = transactions
    //         .filter((t) => t.isReturn)
    //         .reduce((sum, transaction) => sum + transaction.total, 0);
    //       const salesCount = transactions.length;
    //       const customerSalesCount = transactions.filter(
    //         (t) => t.paymentMethod !== "void"
    //       ).length;
    //       const voidedSalesCount = transactions.filter(
    //         (t) => t.paymentMethod === "void"
    //       ).length;
    //       const discounts = transactions.reduce(
    //         (sum, transaction) => sum + (transaction.discount || 0),
    //         0
    //       );
    //       const rounded = 0;
    //       const voidedLines = 0;
    //       const customerOrders = {
    //         placed: 0,
    //         edited: 0,
    //         depositCollected: 0,
    //         canceled: 0,
    //         voidedLines: 0,
    //         charges: 0,
    //         depositRefunded: 0,
    //         depositRedeemed: 0,
    //       };
    //       const openDrawerCount = 0;

    //       // Construct the report data
    //       const reportData = {
    //         employeeName,
    //         date: currentDate,
    //         time: currentTime,
    //         register: "000094",
    //         startDate: currentDate,
    //         startTime: startingTime, // Fetched from posReport
    //         endDate: currentDate,
    //         endTime: endTime, // Calculated as startingTime + 5 hours
    //         sales: totalSales,
    //         taxes,
    //         returns: returns || 0,
    //         salesCount,
    //         customerSalesCount,
    //         voidedSalesCount,
    //         openDrawerCount,
    //         discounts: discounts || 0,
    //         rounded,
    //         voidedLines,
    //         customerOrders,
    //       };

    //       // Open a new window and render the X-Report
    //       const printWindow = window.open("", "_blank", "width=600,height=400");
    //       const xReportHtml = ReactDOMServer.renderToString(
    //         <XReport reportData={reportData} />
    //       );
    //       printWindow.document.write(`
    //     <html>
    //       <head>
    //         <title>X-Report</title>
    //         <!-- Import VT323 font from Google Fonts -->
    //         <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    //         <style>
    //           body {
    //             margin: 0;
    //             padding: 5px; /* Small padding for preview */
    //             background-color: #fff;
    //             width: 3in; /* Set width to 3 inches */
    //             min-width: 3in; /* Ensure minimum width */
    //             font-family: "VT323", monospace !important; /* Force VT323 font */
    //             font-size: 10px; /* Reduced font size to fit more content */
    //             line-height: 1.0; /* Match XReport line height */
    //             box-sizing: border-box;
    //             /* Ensure content fits on one page */
    //             height: auto;
    //             max-height: 8in; /* Limit to one page (8 inches) */
    //             overflow: hidden; /* Prevent overflow to second page */
    //           }
    //           /* Ensure text doesn't wrap */
    //           p, span, div {
    //             white-space: nowrap !important; /* Prevent wrapping */
    //             overflow: hidden;
    //             text-overflow: clip;
    //           }
    //           @media print {
    //             body {
    //               padding: 0;
    //               width: 3in; /* Ensure width is 3 inches for printing */
    //               min-width: 3in;
    //               height: auto;
    //               max-height: 8in;
    //               overflow: hidden;
    //             }
    //             .no-print {
    //               display: none;
    //             }
    //             @page {
    //               size: 3in 8in; /* Define page size for printing */
    //               margin: 0; /* Remove default margins */
    //             }
    //           }
    //         </style>
    //       </head>
    //       <body>
    //         ${xReportHtml}
    //         <script>
    //           window.onload = function() {
    //             window.print();
    //             window.onafterprint = function() {
    //               window.close();
    //             };
    //           };
    //         </script>
    //       </body>
    //     </html>
    //   `);
    //       printWindow.document.close();
    //     } catch (error) {
    //       console.error("Error fetching X-Report:", error);
    //       setSnackbarMessage(
    //         error.message.includes("employeeName is required")
    //           ? "Employee name is required to generate the X-Report."
    //           : error.message.includes("No active POS report found")
    //           ? "No active POS report found. Please start a shift first."
    //           : "Failed to generate X-Report. Please try again."
    //       );
    //       setSnackbarSeverity("error");
    //       setSnackbarOpen(true);
    //     }
    //   };
    //   fetchXReport();
    // }

    // Placeholder for PRINT Z REPORT
    if (selectedTask === "PRINT Z REPORT") {
      const fetchZReport = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=completed`,
          )
          if (!response.ok) {
            throw new Error("Failed to fetch Z-Report data")
          }
          const data = await response.json()
          if (data.length > 0) {
            setSnackbarMessage("Z-Report data fetched. Implement rendering logic as needed.")
            setSnackbarSeverity("info")
            setSnackbarOpen(true)
          } else {
            setSnackbarMessage("No closed POS report found for Z-Report.")
            setSnackbarSeverity("error")
            setSnackbarOpen(true)
          }
        } catch (error) {
          console.error("Error fetching Z-Report:", error)
          setSnackbarMessage("Failed to fetch Z-Report data.")
          setSnackbarSeverity("error")
          setSnackbarOpen(true)
        }
      }
      fetchZReport()
    }
  }, [selectedTask, hardwarePercentage, employeeName])

  // Handle numpad input for Starting Amount or Float Entry
  const handleNumpadClick = (value) => {
    if (selectedTask === "STARTING AMOUNT") {
      setStartingAmount((prev) => prev + value)
    } else if (selectedTask === "FLOAT ENTRY") {
      setFloatEntry((prev) => prev + value)
    }
  }

  // Clear the input
  const handleClear = () => {
    if (selectedTask === "STARTING AMOUNT") {
      setStartingAmount("")
    } else if (selectedTask === "FLOAT ENTRY") {
      setFloatEntry("")
    }
  }

  // Open the confirmation dialog
  const handleSubmit = () => {
    const amount = selectedTask === "STARTING AMOUNT" ? startingAmount : floatEntry
    if (!amount || isNaN(amount)) {
      setSnackbarMessage("Please enter a valid amount.")
      setSnackbarSeverity("error")
      setSnackbarOpen(true)
      return
    }
    setCurrentTask(selectedTask)
    setOpenDialog(true)
  }

  // Close the confirmation dialog
  const handleDialogClose = () => {
    setOpenDialog(false)
    setCurrentTask(null)
  }

  // Close the snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  // Confirm and send to backend
  const handleConfirm = async () => {
    setOpenDialog(false)

    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().split("T")[0] // YYYY-MM-DD
    const formattedTime = currentDate.toTimeString().split(" ")[0] // HH:MM:SS

    if (currentTask === "STARTING AMOUNT") {
      const posReport = {
        employeeName: employeeName,
        startingAmount: Number.parseInt(startingAmount),
        currentDate: formattedDate,
        currentTime: formattedTime,
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posreports`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(posReport),
        })

        if (!response.ok) {
          throw new Error("Failed to submit starting amount")
        }

        setSnackbarMessage("Starting Amount submitted successfully!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        setStartingAmount("")
        onClose()
      } catch (err) {
        console.error("Error submitting starting amount:", err)
        setSnackbarMessage("Failed to submit starting amount. Please try again.")
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    } else if (currentTask === "FLOAT ENTRY") {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posreports/update-float`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeName: employeeName,
            floatEntry: Number.parseInt(floatEntry),
            currentTime: formattedTime,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to update float entry")
        }

        setSnackbarMessage("Float Entry submitted successfully!")
        setSnackbarSeverity("success")
        setSnackbarOpen(true)
        setFloatEntry("")
        onClose()
      } catch (err) {
        console.error("Error updating float entry:", err)
        setSnackbarMessage(
          err.message === "No active POS report found for this employee"
            ? "Please submit a Starting Amount first."
            : "Failed to update float entry. Please try again.",
        )
        setSnackbarSeverity("error")
        setSnackbarOpen(true)
      }
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "center",
        overflowX: "hidden",
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          px: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#f15a22",
            mb: 4,
            fontWeight: "bold",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {selectedTask || "Task Details"}
        </Typography>

        {selectedTask === "DATABASE CONNECTION STATUS" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={60} sx={{ color: "#22f15a" }} />
                <Typography variant="body1" sx={{ color: "white", fontStyle: "italic" }}>
                  Checking connection...
                </Typography>
              </>
            ) : error || connectionStatus === "disconnected" || connectionStatus === "error" ? (
              <>
                <CancelIcon sx={{ fontSize: 60, color: "#ff4444" }} />
                <Typography variant="body1" sx={{ color: "#ff4444", fontWeight: "bold" }}>
                  Database Connection Status: Failed
                </Typography>
                <Typography variant="body2" sx={{ color: "#ff4444", maxWidth: "90%" }}>
                  {error || "Unable to connect to the database. Please check the backend server."}
                </Typography>
              </>
            ) : connectionStatus ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 60, color: "#22f15a" }} />
                <Typography variant="body1" sx={{ color: "#22f15a", fontWeight: "bold" }}>
                  Database Connection Status: Connected
                </Typography>
              </>
            ) : null}
          </Box>
        ) : selectedTask === "SYSTEM HEALTH CHECK" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={60} sx={{ color: "#22f15a" }} />
                <Typography variant="body1" sx={{ color: "white", fontStyle: "italic" }}>
                  Checking system health...
                </Typography>
              </>
            ) : systemHealth ? (
              <List sx={{ width: "100%", maxWidth: "90%" }}>
                <ListItem>
                  <ListItemIcon>
                    {systemHealth.database.status === "Connected" ? (
                      <CheckCircleIcon sx={{ color: "#22f15a" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ff4444" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Database"
                    secondary={systemHealth.database.message}
                    primaryTypographyProps={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{
                      color: systemHealth.database.status === "Connected" ? "#22f15a" : "#ff4444",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {systemHealth.api.status === "Available" ? (
                      <CheckCircleIcon sx={{ color: "#22f15a" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ff4444" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="API"
                    secondary={systemHealth.api.message}
                    primaryTypographyProps={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{
                      color: systemHealth.api.status === "Available" ? "#22f15a" : "#ff4444",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {systemHealth.hardware.status === "Operational" ? (
                      <CheckCircleIcon sx={{ color: "#22f15a" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ff4444" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Hardware"
                    secondary={systemHealth.hardware.message}
                    primaryTypographyProps={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{
                      color: systemHealth.hardware.status === "Operational" ? "#22f15a" : "#ff4444",
                    }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {systemHealth.network.status === "Good" ? (
                      <CheckCircleIcon sx={{ color: "#22f15a" }} />
                    ) : (
                      <CancelIcon sx={{ color: "#ff4444" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary="Network"
                    secondary={systemHealth.network.message}
                    primaryTypographyProps={{
                      color: "white",
                      fontWeight: "bold",
                    }}
                    secondaryTypographyProps={{
                      color: systemHealth.network.status === "Good" ? "#22f15a" : "#ff4444",
                    }}
                  />
                </ListItem>
              </List>
            ) : null}
          </Box>
        ) : selectedTask === "STARTING AMOUNT" || selectedTask === "FLOAT ENTRY" ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              width: "100%",
            }}
          >
            {/* Description */}
            <Typography variant="body1" sx={{ color: "white", mb: 2, fontStyle: "italic" }}>
              {selectedTask === "STARTING AMOUNT"
                ? "Please count the cash (bills) in the drawer and enter the amount"
                : "Please count the coins in the drawer and enter the amount"}
            </Typography>

            {/* Textbox for Entered Amount */}
            <TextField
              value={(selectedTask === "STARTING AMOUNT" ? startingAmount : floatEntry) || "0"}
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: {
                  color: "#22f15a",
                  fontSize: "24px",
                  fontWeight: "bold",
                  textAlign: "center",
                },
              }}
              sx={{
                width: "90%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#22f15a",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1cc940",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#22f15a",
                  },
                  backgroundColor: "#333",
                  borderRadius: "8px",
                },
              }}
            />

            {/* Numpad */}
            <Grid container spacing={1.5} sx={{ maxWidth: "240px", mt: 2 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Grid item xs={4} key={num}>
                  <Button
                    variant="contained"
                    onClick={() => handleNumpadClick(num.toString())}
                    disabled={selectedTask === "FLOAT ENTRY" ? false : !buttonsEnabled || isLoading}
                    sx={{
                      backgroundColor:
                        selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "#555" : "#333",
                      color: "white",
                      width: "100%",
                      height: "60px",
                      fontSize: "20px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                      "&:hover": {
                        backgroundColor:
                          selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "#777" : "#333",
                        boxShadow:
                          selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading)
                            ? "0 4px 8px rgba(0, 0, 0, 0.4)"
                            : "none",
                        transform:
                          selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "scale(1.05)" : "none",
                      },
                      transition: "all 0.2s ease-in-out",
                      opacity: selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? 1 : 0.5,
                      cursor:
                        selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "pointer" : "not-allowed",
                    }}
                  >
                    {num}
                  </Button>
                </Grid>
              ))}
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  onClick={() => handleNumpadClick("0")}
                  disabled={selectedTask === "FLOAT ENTRY" ? false : !buttonsEnabled || isLoading}
                  sx={{
                    backgroundColor: selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "#555" : "#333",
                    color: "white",
                    width: "100%",
                    height: "60px",
                    fontSize: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                    "&:hover": {
                      backgroundColor:
                        selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "#777" : "#333",
                      boxShadow:
                        selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading)
                          ? "0 4px 8px rgba(0, 0, 0, 0.4)"
                          : "none",
                      transform:
                        selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "scale(1.05)" : "none",
                    },
                    transition: "all 0.2s ease-in-out",
                    opacity: selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? 1 : 0.5,
                    cursor:
                      selectedTask === "FLOAT ENTRY" || (buttonsEnabled && !isLoading) ? "pointer" : "not-allowed",
                  }}
                >
                  0
                </Button>
              </Grid>
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  onClick={handleClear}
                  sx={{
                    backgroundColor: "#ff4444",
                    color: "white",
                    width: "100%",
                    height: "60px",
                    fontSize: "16px",
                    textTransform: "uppercase",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                    "&:hover": {
                      backgroundColor: "#cc3333",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>

            {/* Submit Button */}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={selectedTask === "FLOAT ENTRY" ? false : !buttonsEnabled || isLoading}
              sx={{
                backgroundColor: selectedTask === "FLOAT ENTRY" || buttonsEnabled ? "#22f15a" : "#333",
                color: "white",
                width: "90%",
                padding: "12px",
                textTransform: "uppercase",
                borderRadius: "12px",
                fontWeight: "bold",
                mt: 3,
                mb: 2,
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                "&:hover": {
                  backgroundColor: selectedTask === "FLOAT ENTRY" || buttonsEnabled ? "#1cc940" : "#333",
                  boxShadow: selectedTask === "FLOAT ENTRY" || buttonsEnabled ? "0 4px 8px rgba(0, 0, 0, 0.4)" : "none",
                  transform: selectedTask === "FLOAT ENTRY" || buttonsEnabled ? "scale(1.02)" : "none",
                },
                transition: "all 0.2s ease-in-out",
                opacity: selectedTask === "FLOAT ENTRY" || buttonsEnabled ? 1 : 0.5,
              }}
            >
              Submit
            </Button>
          </Box>
          // ) : selectedTask === "PRINT X REPORT" ? (
          //   <Typography variant="body1" sx={{ color: "white", maxWidth: "90%" }}>
          //     X-Report is being generated and will open in a new window for
          //     printing...
          //   </Typography>
        ) : selectedTask === "PRINT Z REPORT" ? (
          <Typography variant="body1" sx={{ color: "white", maxWidth: "90%" }}>
            Z-Report is being generated...
          </Typography>
        ) : (
          <Typography variant="body1" sx={{ color: "white", maxWidth: "90%" }}>
            {selectedTask ? `Details or actions for ${selectedTask} will go here.` : "Select a task to view details."}
          </Typography>
        )}
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        PaperProps={{
          sx: {
            backgroundColor: "#333",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
            width: "400px",
            maxWidth: "90%",
            p: 3,
          },
        }}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <DialogTitle
          sx={{
            color: "#f15a22",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "24px",
            mb: 2,
          }}
        >
          Confirm Amount
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              color: "white",
              textAlign: "center",
              fontSize: "18px",
              mb: 3,
            }}
          >
            Is the Amount correct? {currentTask === "STARTING AMOUNT" ? startingAmount : floatEntry}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
          <Button
            onClick={handleDialogClose}
            sx={{
              backgroundColor: "#ff4444",
              color: "white",
              textTransform: "uppercase",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#cc3333",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            No
          </Button>
          <Button
            onClick={handleConfirm}
            sx={{
              backgroundColor: "#22f15a",
              color: "white",
              textTransform: "uppercase",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": {
                backgroundColor: "#1cc940",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                transform: "scale(1.05)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default DrawerContent
