// ZapEats Authentication Server - Final Working Version
const http = require('http');

// Simple logging function
function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${message}`);
}

log('🚀 Initializing ZapEats Authentication Server...');

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  log(`📨 ${req.method} ${req.url}`);
  
  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Route: Health Check
  if (req.url === '/api/health' && req.method === 'GET') {
    log('🔍 Health check requested');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'ZapEats Authentication Server is running successfully!',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
    return;
  }
  
  // Route: User Login
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const loginData = JSON.parse(body);
        log(`🔐 Login attempt: ${loginData.identifier || loginData.email}`);
        
        // Simple credential validation
        const isValidUser = (
          (loginData.identifier === 'test@example.com' || loginData.email === 'test@example.com') &&
          loginData.password === '123456'
        );
        
        if (isValidUser) {
          log('✅ Login successful');
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful',
            token: `token_${Date.now()}`,
            user: {
              id: 'user_001',
              name: 'Test User',
              email: 'test@example.com',
              role: 'user',
              loyaltyPoints: 125
            }
          }));
        } else {
          log('❌ Login failed: Invalid credentials');
          res.writeHead(401);
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          }));
        }
      } catch (error) {
        log(`❌ Login error: ${error.message}`);
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request format'
        }));
      }
    });
    return;
  }
  
  // Route: User Registration
  if (req.url === '/api/auth/register' && req.method === 'POST') {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const registerData = JSON.parse(body);
        log(`👤 Registration attempt: ${registerData.email}`);
        
        // Validate required fields
        if (!registerData.name || !registerData.email || !registerData.password) {
          log('❌ Registration failed: Missing required fields');
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Name, email, and password are required'
          }));
          return;
        }
        
        // Simple validation
        if (registerData.password.length < 6) {
          log('❌ Registration failed: Password too short');
          res.writeHead(400);
          res.end(JSON.stringify({
            success: false,
            message: 'Password must be at least 6 characters long'
          }));
          return;
        }
        
        log('✅ Registration successful');
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful',
          token: `token_${Date.now()}`,
          user: {
            id: `user_${Date.now()}`,
            name: registerData.name,
            email: registerData.email,
            role: 'user',
            loyaltyPoints: 50
          }
        }));
      } catch (error) {
        log(`❌ Registration error: ${error.message}`);
        res.writeHead(400);
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request format'
        }));
      }
    });
    return;
  }
  
  // Route: Not Found
  log(`❓ Unknown route: ${req.method} ${req.url}`);
  res.writeHead(404);
  res.end(JSON.stringify({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  }));
});

// Start the server
const PORT = 3000;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log('\n🎉 ===============================================');
  console.log('🎉 ✅ ZAPEATS AUTHENTICATION SERVER ONLINE! ✅');
  console.log('🎉 ===============================================');
  console.log(`📍 Server Address: http://${HOST}:${PORT}`);
  console.log(`🔍 Health Check:   http://${HOST}:${PORT}/api/health`);
  console.log(`🔐 Login Endpoint: http://${HOST}:${PORT}/api/auth/login`);
  console.log(`👤 Register:       http://${HOST}:${PORT}/api/auth/register`);
  console.log('');
  console.log('📋 Test Credentials:');
  console.log('   📧 Email: test@example.com');
  console.log('   🔑 Password: 123456');
  console.log('');
  console.log('🚀 Server is ready to handle authentication requests!');
  console.log('💡 Use Ctrl+C to stop the server');
  console.log('===============================================\n');
  
  log('🎯 Server initialization complete');
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ ERROR: Port ${PORT} is already in use!`);
    console.log('💡 Solution: Run "taskkill /F /IM node.exe" to kill existing Node processes');
    process.exit(1);
  } else {
    console.error(`❌ Server error: ${err.message}`);
  }
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  log('👋 Graceful shutdown initiated...');
  server.close(() => {
    log('✅ Server shutdown complete');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  log('👋 Termination signal received...');
  server.close(() => {
    log('✅ Server terminated successfully');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

log('⚡ Server script loaded, starting HTTP server...');