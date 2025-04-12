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
    price: item.price, // Save the price for each item
  }));

  try {
    const transaction = new Transaction({
      items,
      total,
      paymentMethod: selectedPaymentMethod,
      orderPunched: 'yes', // Set to 'yes' when order is sent to kitchen
      transactionStatus: 'processed', // Explicitly set to "processed" (optional since default is already "processed")
    });

    await transaction.save();
    
    res.status(201).json({ 
      message: "Transaction processed successfully!", 
      transactionID: transaction.transactionID 
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ message: "Failed to process transaction", error: error.message });
  }
});

// POST request to mark a transaction as paid
router.post("/pay", async (req, res) => {
  const { transactionID, total, paymentMethod, items } = req.body;

  try {
    const transaction = await Transaction.findOne({ transactionID });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update the transaction
    transaction.total = total;
    transaction.paymentMethod = paymentMethod;
    transaction.items = items.map(item => ({
      itemId: item.id,
      itemName: item.name,
      itemQuantity: item.quantity,
      price: item.price,
    }));
    transaction.paidStatus = 'paid'; // Mark as paid

    await transaction.save();

    res.status(200).json({ message: "Payment processed successfully!" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Failed to process payment", error: error.message });
  }
});

// GET request to retrieve all transactions from the database
router.get("/orders", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
});

// GET request to get the latest transaction ID
router.get("/latest-transaction-id", async (req, res) => {
  try {
    const latestTransaction = await Transaction.findOne().sort({ date: -1 });
    
    const latestID = latestTransaction ? latestTransaction.transactionID : "110000";
    
    res.status(200).json({ latestTransactionID: latestID });
  } catch (error) {
    console.error("Error fetching latest transaction ID:", error);
    res.status(500).json({ message: "Failed to fetch latest transaction ID", error: error.message });
  }
});

// PUT request to suspend transactions by transaction ID
router.put("/suspend", async (req, res) => {
  try {
    const { transactionIDs } = req.body; // Expecting an array of transactionIDs

    if (!transactionIDs || !Array.isArray(transactionIDs) || transactionIDs.length === 0) {
      return res.status(400).json({ message: "At least one transaction ID is required" });
    }

    // Find and update all transactions with the given transactionIDs
    const updatedTransactions = await Transaction.updateMany(
      { transactionID: { $in: transactionIDs }, transactionStatus: "processed" }, // Only update if status is "processed"
      { $set: { transactionStatus: "suspended" } }
    );

    if (updatedTransactions.matchedCount === 0) {
      return res.status(404).json({ message: "No matching transactions found or they are already suspended" });
    }

    res.status(200).json({
      message: `Successfully suspended ${updatedTransactions.modifiedCount} transaction(s)`,
    });
  } catch (error) {
    console.error("Error suspending transactions:", error);
    res.status(500).json({ message: "Failed to suspend transactions", error: error.message });
  }
});

module.exports = router;