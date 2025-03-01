const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// POST request to save the order to the database
router.post("/order", async (req, res) => {
  const { selectedItems, total, selectedPaymentMethod } = req.body;

  const items = selectedItems.map(item => ({
    itemId: item.id,
    itemName: item.name,
    itemQuantity: item.quantity,
  }));

  try {
    const transaction = new Transaction({
      items,
      total,
      paymentMethod: selectedPaymentMethod,
    });

    await transaction.save();
    res.status(201).json({ message: "Order sent to kitchen successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send order to kitchen", error: error.message });
  }
});

module.exports = router;