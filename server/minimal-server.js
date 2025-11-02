const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

console.log('🚀 Starting minimal server test...');

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('📍 Test endpoint hit');
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Start server without MongoDB first
console.log('🔧 Starting server without MongoDB...');
const server = app.listen(PORT, () => {
  console.log(`✅ Minimal server running on port ${PORT}`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/api/test`);
});

// Error handling
server.on('error', (error) => {
  console.error('🚨 Server error:', error);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection:', reason);
});

console.log('✅ Minimal server setup complete');