const express = require('express');
const router = express.Router();
const PosReport = require('../models/posReport');
const Transaction = require('../models/Transaction');

// Fetch active posReports based on employeeName and status
router.get('/', async (req, res) => {
  const { employeeName, status } = req.query;

  try {
    const query = {};
    if (employeeName) query.employeeName = employeeName;
    if (status) query.status = status;

    const posReports = await PosReport.find(query);
    res.status(200).json(posReports);
  } catch (error) {
    console.error('Error fetching posReports:', error);
    res.status(500).json({ error: error.message });
  }
});

// Fetch X-Report data for the entire POS system
router.get('/x-report', async (req, res) => {
  const { employeeName } = req.query;

  if (!employeeName) {
    return res.status(400).json({ error: 'employeeName is required' });
  }

  try {
    // Define the time range for the X-Report (e.g., current day)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day
    const now = new Date(); // Current time

    // Fetch all transactions for the day (or adjust the time range as needed)
    const transactions = await Transaction.find({
      date: {
        $gte: today,
        $lte: now,
      },
    });

    // Calculate metrics for the X-Report
    const totalSales = transactions.reduce((sum, transaction) => sum + transaction.total, 0);
    const salesCount = transactions.length;
    const taxes = totalSales * 0.1; // Assuming a 10% tax rate (adjust as needed)
    const returns = transactions
      .filter(t => t.isReturn)
      .reduce((sum, transaction) => sum + transaction.total, 0); // Assuming a `isReturn` field
    const customerSalesCount = transactions.filter(t => t.paymentMethod !== 'void').length;
    const voidedSalesCount = transactions.filter(t => t.paymentMethod === 'void').length;

    // Placeholder calculations for remaining fields
    const discounts = transactions.reduce((sum, transaction) => sum + (transaction.discount || 0), 0);
    const rounded = 0;
    const voidedLines = 0;
    const customerOrders = {
      placed: 0,
      edited: 0,
      depositCollected: 0,
      canceled: 0,
      voidedLines: 0,
      charges: 0,
      depositRefunded: 0,
      depositRedeemed: 0,
    };

    // Format the current time for the report
    const currentTime = now.toTimeString().split(' ')[0];
    const currentDate = now.toISOString().split('T')[0];

    // Construct the X-Report data
    const xReportData = {
      employeeName, // The employee who generated the report
      date: currentDate,
      time: currentTime,
      register: '000094', // Hardcoded or fetch from a config
      startDate: currentDate, // Start of the day
      startTime: '00:00:00', // Start of the day
      endDate: currentDate, // Current date
      endTime: currentTime, // Current time
      sales: totalSales,
      taxes,
      returns,
      salesCount,
      customerSalesCount,
      voidedSalesCount,
      openDrawerCount: 0, // You can add logic to track this system-wide
      discounts,
      rounded,
      voidedLines,
      customerOrders,
    };

    res.status(200).json(xReportData);
  } catch (error) {
    console.error('Error fetching X-Report:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create or update a posReport for STARTING AMOUNT
router.post('/', async (req, res) => {
  const { employeeName, startingAmount, currentDate, currentTime } = req.body;

  try {
    let posReport = await PosReport.findOne({ employeeName, status: 'active' });

    if (posReport) {
      const [hours, minutes, seconds] = posReport.startingTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, seconds, 0);
      const elapsedMs = Date.now() - startDate.getTime();
      const elapsedHours = elapsedMs / (1000 * 60 * 60);

      if (elapsedHours < 5) {
        posReport.startingAmount = startingAmount;
        await posReport.save();
        return res.status(200).json(posReport);
      }
      posReport.status = 'completed';
      posReport.closingTime = currentTime;
      await posReport.save();
    }

    posReport = new PosReport({
      employeeName,
      startingAmount,
      currentDate,
      startingTime: currentTime,
      status: 'active',
      floatEntry: 0,
      sales: 0,
      taxes: 0,
      returns: 0,
    });
    await posReport.save();
    res.status(201).json(posReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update float entry for an active posReport
router.patch('/update-float', async (req, res) => {
  const { employeeName, floatEntry } = req.body;

  try {
    const posReport = await PosReport.findOne({ employeeName, status: 'active' });
    if (!posReport) {
      return res.status(404).json({ error: 'No active POS report found for this employee' });
    }

    posReport.floatEntry = floatEntry;
    await posReport.save();
    res.status(200).json(posReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Close the active posReport on logout
router.patch('/close', async (req, res) => {
  const { employeeName, closingTime } = req.body;

  try {
    const posReport = await PosReport.findOne({ employeeName, status: 'active' });
    if (!posReport) {
      return res.status(404).json({ error: 'No active POS report found for this employee' });
    }

    const [hours, minutes, seconds] = posReport.startingTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, seconds, 0);
    const elapsedMs = Date.now() - startDate.getTime();
    const elapsedHours = elapsedMs / (1000 * 60 * 60);

    if (elapsedHours >= 5) {
      posReport.closingTime = closingTime;
      posReport.status = 'completed';
      await posReport.save();
      res.status(200).json(posReport);
    } else {
      res.status(200).json({ message: 'Shift not yet complete', posReport });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;