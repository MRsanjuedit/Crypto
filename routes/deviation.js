const express = require('express');
const Crypto = require('../models/Crypto');
const math = require('mathjs');
const router = express.Router();

router.get('/deviation', async (req, res) => {
  const { coin } = req.query;

  if (!coin || !['bitcoin', 'matic', 'ethereum'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin' });
  }

  try {
    // Fetch the last 100 records for the given coin, sorted by timestamp
    const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

    if (!records.length) {
      return res.status(404).json({ error: 'No valid price data available for the given coin' });
    }

    // Extract the price field from the fetched records
    const prices = records.map((record) => record.price);

    if (prices.length === 0) {
      return res.status(404).json({ error: 'No valid price data available for the given coin' });
    }

    // Calculate standard deviation using math.js
    const deviation = math.std(prices);

    res.json({ deviation });
  } catch (error) {
    console.error('Error calculating deviation:', error.message);
    res.status(500).json({ error: 'Error calculating deviation' });
  }
});

module.exports = router;
