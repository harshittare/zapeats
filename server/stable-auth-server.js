const http = require('http');

console.log('🚀 ZapEats Auth Server - Simple & Stable Version');

// Create the server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  const timestamp = new Date().toLocaleTimeString();
  console.log(`📥 ${timestamp} ${req.method} ${req.url}`);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/health') {
    console.log('✅ Health check requested');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'Authentication server is running',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔐 Login request for:', data.identifier || data.email);
        
        if ((data.identifier === 'test@example.com' || data.email === 'test@example.com') && data.password === '123456') {
          console.log('✅ LOGIN SUCCESSFUL!');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful',
            token: 'jwt-token-valid',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              loyaltyPoints: 100
            }
          }));
        } else {
          console.log('❌ Login failed - Invalid credentials');
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          }));
        }
      } catch (err) {
        console.log('❌ Login error:', err.message);
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
      }
    });
    return;
  }
  
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('👤 Registration request for:', data.email);
        
        if (data.name && data.email && data.password) {
          console.log('✅ REGISTRATION SUCCESSFUL!');
          res.writeHead(201);
          res.end(JSON.stringify({
            success: true,
            message: 'Registration successful',
            token: 'jwt-token-new',
            user: {
              id: '2',
              name: data.name,
              email: data.email,
              role: 'user',
              loyaltyPoints: 50
            }
          }));
        } else {
          console.log('❌ Registration failed - Missing fields');
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Name, email, and password are required'
          }));
        }
      } catch (err) {
        console.log('❌ Registration error:', err.message);
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
      }
    });
    return;
  }
  
  // Default 404
  res.writeHead(404);
  res.end(JSON.stringify({ success: false, message: 'Endpoint not found' }));
});

// Start server
server.listen(3000, '127.0.0.1', () => {
  console.log('');
  console.log('🎉 ✅ SERVER STARTED SUCCESSFULLY! ✅');
  console.log('=====================================');
  console.log('📍 URL: http://localhost:3000');
  console.log('🔍 Health: http://localhost:3000/api/health');
  console.log('🔐 Login: http://localhost:3000/api/auth/login');
  console.log('👤 Register: http://localhost:3000/api/auth/register');
  console.log('');
  console.log('📋 TEST CREDENTIALS:');
  console.log('   Email: test@example.com');
  console.log('   Password: 123456');
  console.log('=====================================');
  console.log('🚀 Ready to handle authentication requests!');
  console.log('💡 Press Ctrl+C to stop the server');
  console.log('');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log('💡 Port 3000 is in use. Kill processes: taskkill /F /IM node.exe');
  }
});

// Graceful shutdown
let isShuttingDown = false;
process.on('SIGINT', () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log('\n👋 Received shutdown signal...');
  server.close(() => {
    console.log('✅ Server closed successfully');
    process.exit(0);
  });
});

console.log('⏳ Starting server...');