require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: "*", // Allow all origins
}));
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

let dbStatus = "disconnected";
mongoose.connection.on("connected", () => {
  dbStatus = "connected";
  console.log("MongoDB connection established");
});
mongoose.connection.on("disconnected", () => {
  dbStatus = "disconnected";
  console.log("MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
  dbStatus = "error";
  console.error("MongoDB error:", err);
});

//====================================================================================================

// Routes
const userRoutes = require("./routes/userRoutes.js");
app.use("/api/users", userRoutes);

const transactionRoutes = require("./routes/transactionRoutes.js");
app.use("/api/transactions", transactionRoutes);

const menuRoutes = require("./routes/menuRoutes.js");
app.use("/api/menu", menuRoutes);

const posReportRoutes = require("./routes/posReportRoutes.js");
app.use("/api/posreports", posReportRoutes);

const printRoutes = require("./routes/printRoutes.js"); // Add print routes
app.use("/api/print", printRoutes);

// Status endpoint
app.get("/api/status", (req, res) => {
  res.json({ status: dbStatus });
});

//====================================================================================================


// Root endpoint
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});