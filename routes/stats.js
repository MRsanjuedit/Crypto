const express = require('express');
const axios = require('axios'); // Ensure axios is installed (npm install axios)
const Crypto = require('../models/Crypto'); // Assuming the model is in the 'models' folder
const router = express.Router();

// Function to introduce delay between requests to prevent rate-limiting issues
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.get('/stats', async (req, res) => {
  const coin = req.query.coin; // e.g., bitcoin, matic, ethereum

  if (!coin || !['bitcoin', 'matic', 'ethereum'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid or unsupported coin' });
  }

  // CoinGecko API URL based on the coin parameter
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

  try {
    const response = await axios.get(url);
    const data = response.data[coin]; // Get the coin data from response

    if (data) {
      // Delay added to prevent hitting rate limits
      await delay(1000); // Delay 1 second between requests

      // Insert new data for the coin
      const crypto = new Crypto({
        coin: coin,
        price: data.usd, // Save the price explicitly
        data: data, // Store the full fetched data (price, marketCap, etc.)
        timestamp: new Date(), // Store the time when the data was fetched
      });

      await crypto.save(); // Save to the database

      res.json({
        coin: coin,
        price: data.usd,
        marketCap: data.usd_market_cap,
        "24hChange": data.usd_24h_change,
        timestamp: crypto.timestamp, // Return the stored timestamp
      });
    } else {
      res.status(400).json({ error: 'Invalid coin data from CoinGecko' });
    }
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error.message);
    if (error.response && error.response.status === 429) {
      // Handle rate limit error (HTTP 429)
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else {
      res.status(500).json({ error: 'Error fetching data' });
    }
  }
});

module.exports = router;
