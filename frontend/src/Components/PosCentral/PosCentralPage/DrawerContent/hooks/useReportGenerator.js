import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import XReport from "../XReport/XReport";

const useReportGenerator = (selectedTask, employeeName) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (selectedTask === "PRINT X REPORT") {
      const fetchXReport = async () => {
        try {
          const posReportResponse = await fetch(
            `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=active`
          );
          if (!posReportResponse.ok) throw new Error("Failed to fetch posReport");
          const posReports = await posReportResponse.json();
          if (!posReports.length) throw new Error("No active POS report found");

          const { startingTime } = posReports[0];
          const transactionsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/transactions/orders`);
          if (!transactionsResponse.ok) throw new Error("Failed to fetch transactions");
          const transactions = await transactionsResponse.json();

          const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
          const reportData = {
            employeeName,
            date: new Date().toISOString().split("T")[0],
            time: new Date().toTimeString().split(" ")[0],
            sales: totalSales,
            taxes: totalSales * 0.1,
            startTime: startingTime,
            // Add other fields as needed
          };

          const printWindow = window.open("", "_blank", "width=600,height=400");
          const xReportHtml = ReactDOMServer.renderToString(<XReport reportData={reportData} />);
          printWindow.document.write(`
            <html><body>${xReportHtml}<script>window.print();window.close();</script></body></html>
          `);
          printWindow.document.close();
        } catch (error) {
          setSnackbarMessage(error.message);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      };
      fetchXReport();
    }

    if (selectedTask === "PRINT Z REPORT") {
      const fetchZReport = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/posreports?employeeName=${employeeName}&status=completed`
          );
          if (!response.ok) throw new Error("Failed to fetch Z-Report data");
          const data = await response.json();
          setSnackbarMessage(data.length > 0 ? "Z-Report fetched" : "No closed POS report found");
          setSnackbarSeverity(data.length > 0 ? "info" : "error");
          setSnackbarOpen(true);
        } catch (error) {
          setSnackbarMessage("Failed to fetch Z-Report data");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      };
      fetchZReport();
    }
  }, [selectedTask, employeeName]);

  return { snackbarOpen, snackbarMessage, snackbarSeverity, setSnackbarOpen };
};

export default useReportGenerator;