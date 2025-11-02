const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/api/health', (req, res) => {
  console.log('📍 Health check endpoint hit');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple auth test endpoint
app.post('/api/auth/register', (req, res) => {
  console.log('📍 Registration endpoint hit');
  console.log('Body:', req.body);
  res.json({ 
    success: true, 
    message: 'Test registration endpoint working',
    data: req.body 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error middleware:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
console.log('🔧 Starting simplified server...');
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}/api/health`);
  console.log(`📍 Register: http://localhost:${PORT}/api/auth/register`);
});

// Keep alive
setInterval(() => {
  console.log('⏱️ Server heartbeat:', new Date().toISOString());
}, 30000);