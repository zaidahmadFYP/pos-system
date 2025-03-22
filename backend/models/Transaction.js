const mongoose = require('mongoose');

// Create a separate counter schema to keep track of the transaction ID
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 110000 }
});

const Counter = mongoose.model('Counter', CounterSchema);

const TransactionSchema = new mongoose.Schema({
    transactionID: { 
      type: String,  // Changed from Number to String
      unique: true
    },
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

TransactionSchema.pre('save', async function(next) {
    try {
      if (!this.transactionID) {
        // Find the counter document - if it doesn't exist, create it with starting number 110000
        let counter = await Counter.findById('transactionID');
        
        if (!counter) {
          counter = await Counter.create({ _id: 'transactionID', seq: 110000 });
        } else {
          counter = await Counter.findByIdAndUpdate(
            { _id: 'transactionID' },
            { $inc: { seq: 1 } },
            { new: true }
          );
        }
        
        // Set the transaction ID to the counter value, ensuring it's a 6-digit number
        const transactionID = counter.seq.toString().padStart(6, '0'); // Ensures 6 digits with leading zeros
        
        this.transactionID = transactionID;
      }
      next();
    } catch (error) {
      console.error("Error generating transaction ID:", error);
      next(error);
    }
  });

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;