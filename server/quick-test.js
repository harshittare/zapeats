const http = require('http');
const url = require('url');

console.log('🚀 ZapEats Authentication Server Starting...');

// Create server
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  
  console.log(`📥 ${req.method} ${pathname}`);
  
  // Set headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (pathname === '/api/health') {
    console.log('✅ Health check');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'ZapEats Auth Server Running'
    }));
    return;
  }
  
  if (pathname === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔐 Login:', data.identifier);
        
        if (data.identifier === 'test@example.com' && data.password === '123456') {
          console.log('✅ LOGIN SUCCESS!');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful',
            token: 'jwt-token-123',
            user: {
              id: '1',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              loyaltyPoints: 150
            }
          }));
        } else {
          console.log('❌ Invalid credentials');
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid credentials'
          }));
        }
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
      }
    });
    return;
  }
  
  if (pathname === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('👤 Register:', data.email);
        
        if (data.name && data.email && data.password) {
          console.log('✅ REGISTRATION SUCCESS!');
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
              loyaltyPoints: 0
            }
          }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Name, email and password required'
          }));
        }
      } catch (err) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, message: 'Invalid request' }));
      }
    });
    return;
  }
  
  res.writeHead(404);
  res.end(JSON.stringify({ success: false, message: 'Route not found' }));
});

// Start server
server.listen(5001, '0.0.0.0', () => {
  console.log('');
  console.log('🎉 ✅ AUTHENTICATION SERVER RUNNING! ✅ 🎉');
  console.log('===========================================');
  console.log('🌐 URL: http://localhost:5001');
  console.log('🔍 Health: http://localhost:5001/api/health');
  console.log('🔐 Login: http://localhost:5001/api/auth/login');
  console.log('👤 Register: http://localhost:5001/api/auth/register');
  console.log('');
  console.log('📋 TEST CREDENTIALS:');
  console.log('   Email: test@example.com');
  console.log('   Password: 123456');
  console.log('===========================================');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});