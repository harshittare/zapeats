console.log('Starting test...');

try {
  const express = require('express');
  console.log('✅ Express loaded');
  
  const app = express();
  console.log('✅ Express app created');
  
  app.get('/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
  });
  console.log('✅ Route added');
  
  const server = app.listen(5002, () => {
    console.log('✅ Server listening on port 5002');
    console.log('Test: http://localhost:5002/test');
  });
  
  server.on('error', (err) => {
    console.error('❌ Server error:', err);
  });
  
} catch (error) {
  console.error('❌ Error in server setup:', error);
  console.error('Stack:', error.stack);
}