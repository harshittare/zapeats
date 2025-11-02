const http = require('http');

console.log('🚀 Starting ZapEats Authentication Server...');

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  console.log(`📥 ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Health check
  if (req.url === '/api/health') {
    console.log('✅ Health check');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'ZapEats Auth Server is running!',
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // Login endpoint
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔐 Login attempt:', data.identifier);
        
        // Test credentials
        if (data.identifier === 'test@example.com' && data.password === '123456') {
          console.log('✅ LOGIN SUCCESS!');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful',
            token: `jwt-token-${Date.now()}`,
            user: {
              id: 'user-001',
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
            message: 'Invalid email or password'
          }));
        }
      } catch (error) {
        console.log('❌ Login error:', error.message);
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request format'
        }));
      }
    });
    return;
  }
  
  // Registration endpoint
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('👤 Registration attempt:', data.email);
        
        if (!data.name || !data.email || !data.password) {
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Name, email, and password are required'
          }));
          return;
        }
        
        console.log('✅ REGISTRATION SUCCESS!');
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful',
          token: `jwt-token-${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            role: 'user',
            loyaltyPoints: 50
          }
        }));
      } catch (error) {
        console.log('❌ Registration error:', error.message);
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request format'
        }));
      }
    });
    return;
  }
  
  // 404 for other routes
  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: 'Endpoint not found'
  }));
});

const PORT = 3000;
const HOST = '0.0.0.0';

server.listen(PORT, HOST, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  
  console.log('');
  console.log('🎉 ✅ AUTHENTICATION SERVER RUNNING! ✅');
  console.log('=======================================');
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Login: http://localhost:${PORT}/api/auth/login`);
  console.log(`👤 Register: http://localhost:${PORT}/api/auth/register`);
  console.log('');
  console.log('📋 Test Credentials:');
  console.log('   Email: test@example.com');
  console.log('   Password: 123456');
  console.log('=======================================');
  console.log('🚀 Server is ready for requests!');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log('💡 Kill existing processes: taskkill /F /IM node.exe');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

// Keep process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server stopped successfully!');
    process.exit(0);
  });
});

// Prevent process from exiting
process.stdin.resume();

// Keep the event loop alive
setInterval(() => {
  // This keeps the process alive
}, 1000);