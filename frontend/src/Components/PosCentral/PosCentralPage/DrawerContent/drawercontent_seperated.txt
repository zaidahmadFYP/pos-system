import React from "react";
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
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import useShiftStatus from "../hooks/useShiftStatus";
import useSystemHealth from "../hooks/useSystemHealth";
import useHardwarePercentage from "../hooks/useHardwarePercentage";
import useReportGenerator from "../hooks/useReportGenerator";
import useNumpadInput from "../hooks/useNumpadInput";

const DrawerContent = ({ selectedTask, onClose, employeeName }) => {
  const { buttonsEnabled, isLoading } = useShiftStatus(employeeName);
  const hardwarePercentage = useHardwarePercentage();
  const { connectionStatus, systemHealth, loading, error } = useSystemHealth(selectedTask, hardwarePercentage);
  const { snackbarOpen: reportSnackbarOpen, snackbarMessage: reportMessage, snackbarSeverity: reportSeverity, setSnackbarOpen: setReportSnackbarOpen } = useReportGenerator(selectedTask, employeeName);
  const {
    startingAmount,
    floatEntry,
    openDialog,
    currentTask,
    snackbarOpen: numpadSnackbarOpen,
    snackbarMessage: numpadMessage,
    snackbarSeverity: numpadSeverity,
    handleNumpadClick,
    handleClear,
    handleSubmit,
    handleConfirm,
    setOpenDialog,
    setSnackbarOpen: setNumpadSnackbarOpen,
  } = useNumpadInput(selectedTask, employeeName, onClose);

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
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontStyle: "italic" }}
                >
                  Checking connection...
                </Typography>
              </>
            ) : error || connectionStatus === "disconnected" || connectionStatus === "error" ? (
              <>
                <CancelIcon sx={{ fontSize: 60, color: "#ff4444" }} />
                <Typography
                  variant="body1"
                  sx={{ color: "#ff4444", fontWeight: "bold" }}
                >
                  Database Connection Status: Failed
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#ff4444", maxWidth: "90%" }}
                >
                  {error || "Unable to connect to the database. Please check the backend server."}
                </Typography>
              </>
            ) : connectionStatus ? (
              <>
                <CheckCircleIcon sx={{ fontSize: 60, color: "#22f15a" }} />
                <Typography
                  variant="body1"
                  sx={{ color: "#22f15a", fontWeight: "bold" }}
                >
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
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontStyle: "italic" }}
                >
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
                    primaryTypographyProps={{ color: "white", fontWeight: "bold" }}
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
                    primaryTypographyProps={{ color: "white", fontWeight: "bold" }}
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
                    primaryTypographyProps={{ color: "white", fontWeight: "bold" }}
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
                    primaryTypographyProps={{ color: "white", fontWeight: "bold" }}
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
            <Typography
              variant="body1"
              sx={{ color: "white", mb: 2, fontStyle: "italic" }}
            >
              {selectedTask === "STARTING AMOUNT"
                ? "Please count the cash (bills) in the drawer and enter the amount"
                : "Please count the coins in the drawer and enter the amount"}
            </Typography>
            <TextField
              value={(selectedTask === "STARTING AMOUNT" ? startingAmount : floatEntry) || "0"}
              variant="outlined"
              InputProps={{
                readOnly: true,
                style: { color: "#22f15a", fontSize: "24px", fontWeight: "bold", textAlign: "center" },
              }}
              sx={{
                width: "90%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#22f15a" },
                  "&:hover fieldset": { borderColor: "#1cc940" },
                  "&.Mui-focused fieldset": { borderColor: "#22f15a" },
                  backgroundColor: "#333",
                  borderRadius: "8px",
                },
              }}
            />
            <Grid container spacing={1.5} sx={{ maxWidth: "240px", mt: 2 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Grid item xs={4} key={num}>
                  <Button
                    variant="contained"
                    onClick={() => handleNumpadClick(num.toString())}
                    disabled={!buttonsEnabled || isLoading}
                    sx={{
                      backgroundColor: buttonsEnabled ? "#555" : "#333",
                      color: "white",
                      width: "100%",
                      height: "60px",
                      fontSize: "20px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                      "&:hover": {
                        backgroundColor: buttonsEnabled ? "#777" : "#333",
                        boxShadow: buttonsEnabled ? "0 4px 8px rgba(0, 0, 0, 0.4)" : "none",
                        transform: buttonsEnabled ? "scale(1.05)" : "none",
                      },
                      transition: "all 0.2s ease-in-out",
                      opacity: buttonsEnabled ? 1 : 0.5,
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
                  sx={{
                    backgroundColor: "#555",
                    color: "white",
                    width: "100%",
                    height: "60px",
                    fontSize: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                    "&:hover": {
                      backgroundColor: "#777",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease-in-out",
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
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!buttonsEnabled || isLoading}
              sx={{
                backgroundColor: buttonsEnabled ? "#22f15a" : "#333",
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
                  backgroundColor: buttonsEnabled ? "#1cc940" : "#333",
                  boxShadow: buttonsEnabled ? "0 4px 8px rgba(0, 0, 0, 0.4)" : "none",
                  transform: buttonsEnabled ? "scale(1.02)" : "none",
                },
                transition: "all 0.2s ease-in-out",
                opacity: buttonsEnabled ? 1 : 0.5,
              }}
            >
              Submit
            </Button>
          </Box>
        ) : selectedTask === "PRINT X REPORT" ? (
          <Typography variant="body1" sx={{ color: "white", maxWidth: "90%" }}>
            X-Report is being generated and will open in a new window for printing...
          </Typography>
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
        onClose={() => setOpenDialog(false)}
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
        sx={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <DialogTitle sx={{ color: "#f15a22", textAlign: "center", fontWeight: "bold", fontSize: "24px", mb: 2 }}>
          Confirm Amount
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "white", textAlign: "center", fontSize: "18px", mb: 3 }}>
            Is the Amount correct? {currentTask === "STARTING AMOUNT" ? startingAmount : floatEntry}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2, gap: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              backgroundColor: "#ff4444",
              color: "white",
              textTransform: "uppercase",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
              "&:hover": { backgroundColor: "#cc3333", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)", transform: "scale(1.05)" },
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
              "&:hover": { backgroundColor: "#1cc940", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)", transform: "scale(1.05)" },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={numpadSnackbarOpen || reportSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => { setNumpadSnackbarOpen(false); setReportSnackbarOpen(false); }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => { setNumpadSnackbarOpen(false); setReportSnackbarOpen(false); }}
          severity={numpadSnackbarOpen ? numpadSeverity : reportSeverity}
          sx={{ width: "100%" }}
        >
          {numpadSnackbarOpen ? numpadMessage : reportMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DrawerContent;