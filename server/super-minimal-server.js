const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

console.log('🚀 Starting super minimal server (no MongoDB)...');

// Basic middleware
app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ 
    status: 'OK', 
    message: 'Super minimal server working',
    timestamp: new Date().toISOString()
  });
});

// Test auth endpoint
app.post('/api/auth/test', (req, res) => {
  console.log('Auth test requested with body:', req.body);
  res.json({ 
    success: true, 
    message: 'Auth test endpoint working',
    received: req.body
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎉 Super minimal server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  
  // Keep the process alive
  setInterval(() => {
    console.log('Server heartbeat:', new Date().toISOString());
  }, 10000);
});

// Error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});