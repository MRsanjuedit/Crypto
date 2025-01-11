const axios = require('axios');
const Crypto = require('../models/Crypto');

const fetchAndStoreCryptoData = async () => {
  try {
    const coinIds = ['bitcoin', 'ethereum', 'matic-network'];
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: coinIds.join(','),
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true,
      },
    });

    const data = response.data;

    for (const coinId of coinIds) {
      const coinData = data[coinId];

      if (!coinData) {
        console.warn(`No data found for coin: ${coinId}`);
        continue;
      }

      // Find existing record and update or insert a new one
      const existingCrypto = await Crypto.findOne({ coin: coinId });

      if (existingCrypto) {
        // Update existing record with full coinData
        existingCrypto.data = coinData; // Storing all data as-is
        existingCrypto.updatedAt = new Date(); // Track last update
        await existingCrypto.save();
        console.log(`Updated data for ${coinId}`);
      } else {
        // Create a new record with full coinData
        const newCrypto = new Crypto({
          coin: coinId,
          data: coinData, // Store all fetched data
          createdAt: new Date(),
        });
        await newCrypto.save();
        console.log(`Inserted data for ${coinId}`);
      }
    }

    console.log('All crypto data processed successfully.');
  } catch (error) {
    console.error('Error fetching or saving crypto data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
};

module.exports = fetchAndStoreCryptoData;
