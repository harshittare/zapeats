// ZapEats Authentication Server - Ultra Stable Version
const http = require('http');

console.log('🚀 ZapEats Authentication Server - Ultra Stable');
console.log('===============================================');

// Create server with robust error handling
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  const timestamp = new Date().toLocaleTimeString();
  console.log(`📥 [${timestamp}] ${req.method} ${req.url}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health endpoint
  if (req.url === '/api/health') {
    console.log('✅ Health check OK');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'ZapEats Auth Server Running',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    }));
    return;
  }
  
  // Login endpoint
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log(`🔐 Login: ${data.identifier || data.email}`);
        
        // Check credentials
        const validUser = (data.identifier === 'test@example.com' || data.email === 'test@example.com') && data.password === '123456';
        
        if (validUser) {
          console.log('✅ LOGIN SUCCESS');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful',
            token: 'jwt-token-valid-' + Date.now(),
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              loyaltyPoints: 100
            }
          }));
        } else {
          console.log('❌ LOGIN FAILED');
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid credentials'
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
  
  // Registration endpoint
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log(`👤 Register: ${data.email}`);
        
        // Validate fields
        if (!data.name || !data.email || !data.password) {
          console.log('❌ Missing fields');
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Name, email, and password required'
          }));
          return;
        }
        
        console.log('✅ REGISTRATION SUCCESS');
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful',
          token: 'jwt-token-new-' + Date.now(),
          user: {
            id: Date.now(),
            name: data.name,
            email: data.email,
            role: 'user',
            loyaltyPoints: 50
          }
        }));
      } catch (err) {
        console.log('❌ Registration error:', err.message);
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
      }
    });
    return;
  }
  
  // 404 for other routes
  res.writeHead(404);
  res.end(JSON.stringify({ message: 'Not found' }));
});

// Start server
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 ✅ AUTHENTICATION SERVER ONLINE! ✅');
  console.log('====================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`👤 Register: http://localhost:${PORT}/api/auth/register`);
  console.log('');
  console.log('📋 Credentials: test@example.com / 123456');
  console.log('====================================');
  console.log('🚀 Server ready for requests!');
  console.log('💡 Keep this terminal open');
  console.log('');
});

// Enhanced error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log('💡 Port in use - kill processes: taskkill /F /IM node.exe');
    process.exit(1);
  }
});

// Disable signal handlers that cause shutdown
process.removeAllListeners('SIGINT');
process.removeAllListeners('SIGTERM');

// Keep process alive with periodic heartbeat
setInterval(() => {
  // Silent heartbeat to keep process alive
}, 5000);

// Only allow manual shutdown
console.log('💡 This server will run continuously');