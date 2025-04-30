import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Divider, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getLogs, clearLogs } from "./utils/logger"; // Adjust the path as needed

const Reports = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Track window resize for responsive font size
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Responsive font size for heading
  const getFontSize = () => {
    if (windowWidth < 600) return '1.1rem'; // xs
    if (windowWidth < 960) return '1.25rem'; // sm
    if (windowWidth <= 1366) return '1.4rem'; // md-compact
    return '1.5rem'; // md
  };

  // Fetch logs from localStorage
  const fetchLogs = () => {
    setLoading(true);
    try {
      const storedLogs = getLogs();
      setLogs(storedLogs);
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Clear all logs
  const handleClearLogs = () => {
    clearLogs();
    setLogs([]);
    setSelectedLog(null);
  };

  // Fetch logs on mount and set up polling
  useEffect(() => {
    fetchLogs();
    const intervalId = setInterval(fetchLogs, 5000); // Refresh every 5 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleLogClick = (log) => {
    setSelectedLog(log);
  };

  return (
    <Box
      sx={{
        p: 2,
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #121212 0%, #1a1a1a 100%)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          paddingBottom: 0.5, // Matches Menu component
        }}
      >
        {/* Wrap Typography in a Box to control border width */}
        <Box sx={{ display: 'inline-block', borderBottom: '2px solid #333333', width: '1000px' }}>
          <Typography
            variant="h5"
            sx={{
              color: "#f15a22",
              fontWeight: "bold",
              fontSize: getFontSize(),
              marginBottom: 1,
            }}
          >
            Reports
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            onClick={handleClearLogs}
            sx={{
              background: "linear-gradient(45deg, #FF4444 30%, #FF6666 90%)",
              color: "white",
              padding: "8px 16px",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #CC3333 30%, #CC5555 90%)",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Clear Logs
          </Button>
          <Button
            onClick={() => navigate("/loop/poscentral")}
            sx={{
              background: "linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)",
              color: "white",
              padding: "8px 16px",
              textTransform: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
              "&:hover": {
                background: "linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)",
                boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Back
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Logs List */}
        <Paper
          sx={{
            background: "linear-gradient(180deg, #1f1f1f 0%, #252525 100%)",
            borderRadius: "12px",
            padding: 2,
            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
            width: selectedLog ? "70%" : "100%",
            transition: "width 0.3s ease",
            border: "1px solid #333",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#f15a22",
              mb: 1,
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            Error Logs
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <CircularProgress sx={{ color: "#f15a22" }} />
              <Typography sx={{ color: "white", ml: 2 }}>Loading logs...</Typography>
            </Box>
          ) : logs.length === 0 ? (
            <Typography sx={{ color: "#b0b0b0", textAlign: "center", py: 4, flex: 1 }}>
              No logs found.
            </Typography>
          ) : (
            <>
              {/* Table Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#2a2a2a",
                  padding: 1.5,
                  borderRadius: "8px 8px 0 0",
                  border: "1px solid #444",
                  borderBottom: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  color: "#f15a22",
                  fontWeight: "bold",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <Typography sx={{ flex: 1 }}>Log ID</Typography>
                <Typography sx={{ flex: 1, textAlign: "center" }}>Category</Typography>
                <Typography sx={{ flex: 2, textAlign: "center" }}>Message</Typography>
                <Typography sx={{ flex: 1, textAlign: "right" }}>Date</Typography>
              </Box>

              {/* Table Body */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  minHeight: 0,
                  borderRadius: "0 0 8px 8px",
                  border: "1px solid #444",
                  borderTop: "none",
                  background: "#252525",
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#1a1a1a",
                    borderRadius: "0 0 8px 0",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#444",
                    borderRadius: "5px",
                    "&:hover": {
                      background: "#555",
                    },
                  },
                }}
              >
                {logs.map((log) => (
                  <Box
                    key={log.id}
                    onClick={() => handleLogClick(log)}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: selectedLog?.id === log.id
                        ? "linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)"
                        : "#2a2a2a",
                      padding: 1.5,
                      color: "white",
                      cursor: "pointer",
                      borderBottom: "1px solid #444",
                      transition: "all 0.3s ease",
                      "&:last-child": {
                        borderBottom: "none",
                        borderRadius: "0 0 8px 8px",
                      },
                      "&:hover": {
                        background: selectedLog?.id === log.id
                          ? "linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)"
                          : "#3a3a3a",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                      },
                    }}
                  >
                    <Typography sx={{ flex: 1, fontWeight: "bold" }}>
                      #{log.id}
                    </Typography>
                    <Typography sx={{ flex: 1, textAlign: "center" }}>
                      {log.category}
                    </Typography>
                    <Typography sx={{ flex: 2, textAlign: "center" }}>
                      {log.message.length > 30 ? `${log.message.substring(0, 30)}...` : log.message}
                    </Typography>
                    <Typography sx={{ flex: 1, textAlign: "right", color: "#b0b0b0" }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>

        {/* Log Details (Right Panel) */}
        {selectedLog && (
          <Paper
            sx={{
              background: "linear-gradient(180deg, #252525 0%, #1f1f1f 100%)",
              borderRadius: "12px",
              padding: 2,
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
              width: "30%",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease",
              border: "2px solid #f15a22",
              animation: "slideIn 0.3s ease",
              overflow: "hidden",
              "@keyframes slideIn": {
                from: { transform: "translateX(100%)", opacity: 0 },
                to: { transform: "translateX(0)", opacity: 1 },
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#f15a22",
                mb: 1.5,
                fontWeight: "bold",
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
                fontSize: "1.3rem",
              }}
            >
              Log Details
            </Typography>
            <Divider sx={{ borderColor: "#f15a22", mb: 2, opacity: 0.5 }} />

            {/* Details Content */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                minHeight: 0,
                mb: 2,
                px: 1,
                "&::-webkit-scrollbar": {
                  width: "10px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#1a1a1a",
                  borderRadius: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#444",
                  borderRadius: "5px",
                  "&:hover": {
                    background: "#555",
                  },
                },
              }}
            >
              <Box
                sx={{
                  background: "#2a2a2a",
                  borderRadius: "8px",
                  padding: 1.5,
                  mb: 2,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                  border: "1px solid #444",
                }}
              >
                <Typography variant="body1" sx={{ color: "#f15a22", mb: 0.5, fontWeight: "bold" }}>
                  Log ID:
                  <Typography component="span" sx={{ color: "white", ml: 1, fontWeight: "normal" }}>
                    #{selectedLog.id}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: "#f15a22", mb: 0.5, fontWeight: "bold" }}>
                  Date:
                  <Typography component="span" sx={{ color: "white", ml: 1, fontWeight: "normal" }}>
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: "#f15a22", mb: 0.5, fontWeight: "bold" }}>
                  Category:
                  <Typography component="span" sx={{ color: "white", ml: 1, fontWeight: "normal" }}>
                    {selectedLog.category}
                  </Typography>
                </Typography>
                <Typography variant="body1" sx={{ color: "#f15a22", mb: 0.5, fontWeight: "bold" }}>
                  Message:
                  <Typography component="span" sx={{ color: "white", ml: 1, fontWeight: "normal" }}>
                    {selectedLog.message}
                  </Typography>
                </Typography>
              </Box>
            </Box>

            {/* Close Button */}
            <Button
              onClick={() => setSelectedLog(null)}
              sx={{
                background: "linear-gradient(45deg, #f15a22 30%, #ff6d00 90%)",
                color: "white",
                padding: "10px 16px",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 3px 6px rgba(0, 0, 0, 0.3)",
                width: "100%",
                "&:hover": {
                  background: "linear-gradient(45deg, #d14c1b 30%, #e65c00 90%)",
                  boxShadow: "0 5px 10px rgba(0, 0, 0, 0.5)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Close
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Reports;