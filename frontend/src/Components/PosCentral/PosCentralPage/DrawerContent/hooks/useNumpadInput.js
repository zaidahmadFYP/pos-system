import { useState } from "react";

const useNumpadInput = (selectedTask, employeeName, onClose) => {
  const [startingAmount, setStartingAmount] = useState("");
  const [floatEntry, setFloatEntry] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleNumpadClick = (value) => {
    if (selectedTask === "STARTING AMOUNT") setStartingAmount((prev) => prev + value);
    else if (selectedTask === "FLOAT ENTRY") setFloatEntry((prev) => prev + value);
  };

  const handleClear = () => {
    if (selectedTask === "STARTING AMOUNT") setStartingAmount("");
    else if (selectedTask === "FLOAT ENTRY") setFloatEntry("");
  };

  const handleSubmit = () => {
    const amount = selectedTask === "STARTING AMOUNT" ? startingAmount : floatEntry;
    if (!amount || isNaN(amount)) {
      setSnackbarMessage("Please enter a valid amount.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    setCurrentTask(selectedTask);
    setOpenDialog(true);
  };

  const handleConfirm = async () => {
    setOpenDialog(false);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0];
    const formattedTime = currentDate.toTimeString().split(" ")[0];

    if (currentTask === "STARTING AMOUNT") {
      const posReport = { employeeName, startingAmount: parseInt(startingAmount), currentDate: formattedDate, currentTime: formattedTime };
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posreports`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(posReport),
        });
        if (!response.ok) throw new Error("Failed to submit starting amount");
        setSnackbarMessage("Starting Amount submitted successfully!");
        setSnackbarSeverity("success");
        setStartingAmount("");
        onClose();
      } catch (err) {
        setSnackbarMessage("Failed to submit starting amount.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    } else if (currentTask === "FLOAT ENTRY") {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posreports/update-float`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeName, floatEntry: parseInt(floatEntry), currentTime: formattedTime }),
        });
        if (!response.ok) throw new Error("Failed to update float entry");
        setSnackbarMessage("Float Entry submitted successfully!");
        setSnackbarSeverity("success");
        setFloatEntry("");
        onClose();
      } catch (err) {
        setSnackbarMessage(err.message === "No active POS report found" ? "Submit Starting Amount first." : "Failed to update float entry.");
        setSnackbarSeverity("error");
      } finally {
        setSnackbarOpen(true);
      }
    }
  };

  return {
    startingAmount,
    floatEntry,
    openDialog,
    currentTask,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    handleNumpadClick,
    handleClear,
    handleSubmit,
    handleConfirm,
    setOpenDialog,
    setSnackbarOpen,
  };
};

export default useNumpadInput;