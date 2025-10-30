const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3002",
  credentials: true
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Server is working!' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats')
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Test URL: http://localhost:${PORT}/api/test`);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});