const mongoose = require('mongoose');

// Create a separate counter schema to keep track of the transaction ID
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 110000 }
});

const Counter = mongoose.model('Counter', CounterSchema);

const TransactionSchema = new mongoose.Schema({
  transactionID: { 
    type: String,
    unique: true
  },
  items: [
    {
      itemId: String,
      itemName: String,
      itemQuantity: Number,
      price: Number, // Add price field for each item
    }
  ],
  total: Number,
  paymentMethod: String,
  date: { type: Date, default: Date.now },
  orderPunched: { type: String, enum: ['yes', 'no'], default: 'no' }, // New field: yes/no
  paidStatus: { type: String, enum: ['paid', 'not paid'], default: 'not paid' }, // New field: paid/not paid
  transactionStatus: { 
    type: String, 
    enum: ['processed', 'suspended'], 
    default: 'processed' // Default to "processed" when a transaction is created
  }, // New field: processed/suspended
});

TransactionSchema.pre('save', async function(next) {
  try {
    if (!this.transactionID) {
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
      
      const transactionID = counter.seq.toString().padStart(6, '0');
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