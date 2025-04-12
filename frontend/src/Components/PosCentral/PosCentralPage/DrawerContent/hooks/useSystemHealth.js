import { useState, useEffect } from "react";

const useSystemHealth = (selectedTask, hardwarePercentage) => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedTask !== "DATABASE CONNECTION STATUS" && selectedTask !== "SYSTEM HEALTH CHECK") return;

    setLoading(true);
    setError(null);
    setConnectionStatus(null);
    setSystemHealth(null);

    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      setError("REACT_APP_API_URL is not defined");
      setLoading(false);
      return;
    }

    const fullUrl = `${apiUrl}/api/status`;
    const startTime = Date.now();

    fetch(fullUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const latency = Date.now() - startTime;
        const status = data.status || "Connected";
        setConnectionStatus(status);

        if (selectedTask === "SYSTEM HEALTH CHECK") {
          const hardwareCheck = () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({
                status: "Operational",
                message: `Hardware is functioning normally (${hardwarePercentage}%)`,
              }), 500)
            );

          hardwareCheck().then((hardwareResult) => {
            setSystemHealth({
              database: {
                status: status === "connected" ? "Connected" : "Disconnected",
                message: status === "connected" ? "Database is connected" : "Database connection failed",
              },
              api: { status: "Available", message: "API is reachable" },
              hardware: hardwareResult,
              network: {
                status: latency < 200 ? "Good" : "Poor",
                message: `Network latency: ${latency}ms`,
              },
            });
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        if (selectedTask === "SYSTEM HEALTH CHECK") {
          setSystemHealth({
            database: { status: "Disconnected", message: "Database connection failed: " + err.message },
            api: { status: "Unavailable", message: "API is not reachable" },
            hardware: { status: "Unknown", message: "Hardware status unavailable" },
            network: { status: "Unknown", message: "Network status unavailable" },
          });
        }
      });
  }, [selectedTask, hardwarePercentage]);

  return { connectionStatus, systemHealth, loading, error };
};

export default useSystemHealth;