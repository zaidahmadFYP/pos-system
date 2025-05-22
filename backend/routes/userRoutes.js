const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Fetch users with role "Cashier" or "Manager" (Only send name, email, and plainPassword)
router.get("/", async (req, res) => {
  try {
    // Filter users by role "Cashier" or "Manager"
    const users = await User.find(
      { role: { $in: ["Cashier", "Manager"] } }, // Filter users by role
      { name: 1, email: 1, plainPassword: 1, _id: 0 } // Only return name, email, and plainPassword
    );
    console.log("Fetched Users:", users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify user password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Received Login Request:");
  console.log("Email:", email);
  console.log("Password:", password);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password !== user.plainPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

module.exports = router;
