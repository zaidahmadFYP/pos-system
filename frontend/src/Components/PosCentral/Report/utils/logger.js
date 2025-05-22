//==============================================LOCAL STORAGE LOGGING===============================
// const LOG_KEY = "app_logs";

// const getLogs = () => {
//   const logs = localStorage.getItem(LOG_KEY);
//   return logs ? JSON.parse(logs) : [];
// };

// const saveLogs = (logs) => {
//   localStorage.setItem(LOG_KEY, JSON.stringify(logs));
// };

// const logError = (category, message) => {
//   const logs = getLogs();
//   const newLog = {
//     id: Date.now(), // Unique ID based on timestamp
//     timestamp: new Date().toISOString(),
//     category,
//     message,
//   };
//   logs.push(newLog);
//   saveLogs(logs);
// };

// const clearLogs = () => {
//   localStorage.removeItem(LOG_KEY);
// };

// export { logError, getLogs, clearLogs };

// ======================================== SESSION LOGGING ========================================
const LOG_KEY = "app_logs";

const getLogs = () => {
  const logs = sessionStorage.getItem(LOG_KEY); // Use sessionStorage instead of localStorage
  return logs ? JSON.parse(logs) : [];
};

const saveLogs = (logs) => {
  sessionStorage.setItem(LOG_KEY, JSON.stringify(logs)); // Use sessionStorage instead of localStorage
};

const logError = (category, message) => {
  const logs = getLogs();
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    category,
    message,
  };
  logs.push(newLog);
  saveLogs(logs);
};

const clearLogs = () => {
  sessionStorage.removeItem(LOG_KEY); // Use sessionStorage instead of localStorage
};

export { logError, getLogs, clearLogs };