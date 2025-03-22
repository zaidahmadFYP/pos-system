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
    
    // Return the newly created transaction with its ID
    res.status(201).json({ 
      message: "Transaction processed successfully!", 
      transactionID: transaction.transactionID 
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ message: "Failed to process transaction", error: error.message });
  }
});

// GET request to retrieve all transactions from the database
router.get("/orders", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });  // Retrieve all transactions and sort by date descending

    // Check if there are any transactions
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found" });
    }

    res.status(200).json(transactions);  // Return the list of transactions
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

module.exports = router;