// backend/models/PosReport.js
const mongoose = require('mongoose');

const posReportSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  startingAmount: {
    type: Number,
    default: 0, // Cash (bills)
  },
  floatEntry: {
    type: Number,
    default: 0, // Coins
  },
  currentDate: {
    type: String,
    required: true,
  },
  startingTime: {
    type: String, // Time when the user logs in and submits STARTING AMOUNT (HH:MM:SS)
  },
  closingTime: {
    type: String, // Time when the user logs out (HH:MM:SS)
  },
  status: {
    type: String,
    default: 'active', // 'active' or 'completed'
  },
  sales: {
    type: Number,
    default: 0,
  },
  taxes: {
    type: Number,
    default: 0,
  },
  returns: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('PosReport', posReportSchema);