const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    items: [
        {
            itemId: String, // Item ID
            itemName: String, // Item Name
            itemQuantity: Number, // Item Quantity
        }
    ],
    total: Number, // Total amount
    paymentMethod: String, // Payment method (e.g., cash or credit)
    date: { type: Date, default: Date.now }, // Date of transaction
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
