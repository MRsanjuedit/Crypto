const express = require('express');
const mongoose = require('mongoose');
const statsRoute = require('./routes/stats');
const deviationRoute = require('./routes/deviation');
const cryptoService = require('./services/cryptoService');
const path = require('path');
const cors = require('cors');
app.use(cors());


// Initialize Express app
const app = express();
app.use(express.json());

// Load environment variables
require('dotenv').config();

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Use API routes
app.use('/api', statsRoute);
app.use('/api', deviationRoute);

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all route to serve the main frontend file for any unmatched routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
