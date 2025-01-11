const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  coin: { type: String, required: true },
  price: { type: Number, required: true }, // Add price explicitly
  data: { type: Object, required: true },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model('Crypto', cryptoSchema);
