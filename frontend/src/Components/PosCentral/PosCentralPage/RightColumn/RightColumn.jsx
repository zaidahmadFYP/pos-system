"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import XReport from "../DrawerContent/XReport/XReport";
import printXReport from "../DrawerContent/XReport/printXReport";

const RightColumn = ({ toggleDrawer, refreshKey }) => {
  const [hasPosReport, setHasPosReport] = useState(false);
  const [hasStartingAmount, setHasStartingAmount] = useState(false);
  const [hasFloatEntry, setHasFloatEntry] = useState(false);

  const [showXReport, setShowXReport] = useState(false);
  const [xReportData, setXReportData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Add theme and media queries for responsive design
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const isLowHeight = useMediaQuery("(max-height:720px)");
  const isMediumScreen = useMediaQuery(
    "(min-width:1081px) and (max-width:1366px)"
  );

  // Combined check for 1080x720 resolution
  const is1080x720 = isSmallScreen && isLowHeight;

  const fetchXReport = async () => {
    const employeeName = localStorage.getItem("employeeName");
    if (!employeeName) {
      setSnackbarMessage("Employee name is required to generate the X-Report.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Step 1: Fetch the active posReport for the employee to get the startingTime
      const posReportResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=active`
      );
      if (!posReportResponse.ok) {
        const errorData = await posReportResponse.json();
        throw new Error(
          errorData.error ||
            `Failed to fetch posReport (Status: ${posReportResponse.status})`
        );
      }
      const posReports = await posReportResponse.json();
      if (!posReports || posReports.length === 0) {
        throw new Error("No active POS report found for this employee");
      }
      const posReport = posReports[0]; // Take the first active posReport
      const startingTime = posReport.startingTime; // e.g., "00:00:00"

      // Step 2: Calculate the endTime by adding 5 hours to the startingTime
      const [hours, minutes, seconds] = startingTime.split(":").map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, seconds, 0);
      const endDate = new Date(startDate.getTime() + 5 * 60 * 60 * 1000); // Add 5 hours
      const endTime = endDate.toTimeString().split(" ")[0]; // Format as "HH:mm:ss"

      // Step 3: Fetch transactions from /api/transactions/orders
      const transactionsResponse = await fetch(
        `${process.env.REACT_APP_API_URL}/api/transactions/orders`
      );
      if (!transactionsResponse.ok) {
        const errorData = await transactionsResponse.json();
        throw new Error(
          errorData.error ||
            `Failed to fetch transactions (Status: ${transactionsResponse.status})`
        );
      }
      const transactions = await transactionsResponse.json();

      // Calculate metrics for the X-Report
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().split(" ")[0];

      const numberOfOrders = transactions.length;
      const totalSales = transactions.reduce(
        (sum, transaction) => sum + transaction.total,
        0
      );
      const taxes = totalSales * 0.1;

      const returns = transactions
        .filter((t) => t.isReturn)
        .reduce((sum, transaction) => sum + transaction.total, 0);
      const salesCount = transactions.length;
      const customerSalesCount = transactions.filter(
        (t) => t.paymentMethod !== "void"
      ).length;
      const voidedSalesCount = transactions.filter(
        (t) => t.paymentMethod === "void"
      ).length;
      const discounts = transactions.reduce(
        (sum, transaction) => sum + (transaction.discount || 0),
        0
      );
      const rounded = 0;
      const voidedLines = 0;
      const customerOrders = {
        placed: 0,
        edited: 0,
        depositCollected: 0,
        canceled: 0,
        voidedLines: 0,
        charges: 0,
        depositRefunded: 0,
        depositRedeemed: 0,
      };
      const openDrawerCount = 0;

      // Construct the report data
      const reportData = {
        employeeName,
        date: currentDate,
        time: currentTime,
        register: "000094",
        startDate: currentDate,
        startTime: startingTime,
        endDate: currentDate,
        endTime: endTime,
        sales: totalSales,
        taxes,
        returns: returns || 0,
        salesCount,
        customerSalesCount,
        voidedSalesCount,
        openDrawerCount,
        discounts: discounts || 0,
        rounded,
        voidedLines,
        customerOrders,
      };

      // Set the report data and trigger printing
      setXReportData(reportData);
      setShowXReport(true);

      // Show success message
      setSnackbarMessage("X-Report has been sent to the printer.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error fetching X-Report:", error);
      setSnackbarMessage(
        error.message.includes("employeeName is required")
          ? "Employee name is required to generate the X-Report."
          : error.message.includes("No active POS report found")
          ? "No active POS report found. Please start a shift first."
          : "Failed to generate X-Report. Please try again."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const checkPosReport = async () => {
    const employeeName = localStorage.getItem("employeeName");
    if (employeeName) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=active`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await response.json();
        console.log("Fetched PosReport data:", data);
        if (data.length > 0) {
          const startingAmountSet = data[0].startingAmount > 0;
          const floatEntrySet = data[0].floatEntry > 0;
          console.log(
            "Starting Amount:",
            data[0].startingAmount,
            "Float Entry:",
            data[0].floatEntry
          );
          setHasPosReport(true);
          setHasStartingAmount(startingAmountSet);
          setHasFloatEntry(floatEntrySet);
        } else {
          console.log("No active PosReport found");
          setHasPosReport(false);
          setHasStartingAmount(false);
          setHasFloatEntry(false);
        }
      } catch (error) {
        console.error("Error checking posReport:", error.message);
        setHasPosReport(false);
        setHasStartingAmount(false);
        setHasFloatEntry(false);
      }
    } else {
      console.log("No employeeName in localStorage");
    }
  };

  useEffect(() => {
    console.log("Refreshing with refreshKey:", refreshKey);
    checkPosReport();
  }, [refreshKey]);

  const tasks = [
    "STARTING AMOUNT",
    "SYSTEM HEALTH CHECK",
    "PRINT X REPORT",
    // "PRINT Z REPORT",
    "DATABASE CONNECTION STATUS",
    "FLOAT ENTRY",
    // "OPEN DRAWER",
  ];

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
  });

  const getGridStyles = () => ({
    display: "grid",
    gridTemplateColumns: isSmallScreen ? "1fr" : "repeat(2, 1fr)",
    gap: is1080x720 ? 0.5 : isSmallScreen ? 1 : isMediumScreen ? 1.5 : 2,
  });

  const getButtonStyles = (isDisabled) => ({
    backgroundColor: isDisabled ? "#666" : "#f15a22",
    color: "white",
    padding: is1080x720
      ? "6px"
      : isSmallScreen
      ? "10px"
      : isMediumScreen
      ? "15px"
      : "20px",
    textTransform: "none",
    borderRadius: isSmallScreen ? 1 : 2,
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: is1080x720
      ? "60px"
      : isSmallScreen
      ? "80px"
      : isMediumScreen
      ? "100px"
      : "120px",
    fontSize: is1080x720
      ? "0.75rem"
      : isSmallScreen
      ? "0.85rem"
      : isMediumScreen
      ? "0.95rem"
      : "1rem",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: isDisabled ? "#666" : "#d14c1b",
      boxShadow: !isDisabled ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
      transform: !isDisabled
        ? is1080x720
          ? "scale(1.03)"
          : isSmallScreen
          ? "scale(1.05)"
          : "scale(1.1)"
        : "none",
    },
    transition: "transform 0.15s ease-in-out",
    opacity: isDisabled ? 0.6 : 1,
  });

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
          TASKS
        </Typography>
        <Divider
          sx={{
            borderColor: "#808080",
            margin: "3px auto",
            width: "0.65",
          }}
        />
        <Box sx={getGridStyles()}>
          {tasks.map((task) => {
            let isDisabled = false;
            if (task === "STARTING AMOUNT") {
              isDisabled = hasStartingAmount;
            } else if (task === "FLOAT ENTRY") {
              isDisabled = !hasPosReport || hasFloatEntry;
            }
  
            const handlePrintXReport = async () => {
              const employeeName = localStorage.getItem("employeeName");
              const reportData = await printXReport(
                employeeName,
                setSnackbarMessage,
                setSnackbarSeverity,
                setSnackbarOpen
              );
              if (reportData) {
                setXReportData(reportData);
                setShowXReport(true);
              }
            };
  
            return (
              <Button
                key={task}
                onClick={task === "PRINT X REPORT" ? handlePrintXReport : toggleDrawer(task)}
                disabled={isDisabled}
                sx={getButtonStyles(isDisabled)}
              >
                {task}
              </Button>
            );
          })}
        </Box>
      </Paper>
  
      {/* Snackbar for confirmation messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
  
      {/* Render XReport for printing */}
      {showXReport && xReportData && <XReport reportData={xReportData} />}
    </Box>
  );
};

export default RightColumn;
