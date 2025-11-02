const express = require('express');

console.log('🔧 Testing basic Express...');

try {
  const app = express();
  
  console.log('✅ Express app created');
  
  app.get('/test', (req, res) => {
    console.log('📍 Request received');
    res.json({ message: 'Hello World' });
  });
  
  console.log('✅ Route registered');
  
  const server = app.listen(5001, (err) => {
    if (err) {
      console.error('🚨 Listen error:', err);
      return;
    }
    console.log('✅ Server listening on port 5001');
  });
  
  server.on('error', (error) => {
    console.error('🚨 Server error event:', error);
  });
  
  console.log('✅ Server setup complete');
  
  // Keep alive
  setTimeout(() => {
    console.log('⏱️ Server still running after 5 seconds');
  }, 5000);
  
} catch (error) {
  console.error('🚨 Setup error:', error);
}