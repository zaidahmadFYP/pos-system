const printXReport = async (employeeName, setSnackbarMessage, setSnackbarSeverity, setSnackbarOpen) => {
    if (!employeeName) {
      setSnackbarMessage("Employee name is required to generate the X-Report.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return null;
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
  
      // Show success message
      setSnackbarMessage("X-Report has been sent to the printer.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
  
      return reportData;
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
      return null;
    }
  };
  
  export default printXReport;