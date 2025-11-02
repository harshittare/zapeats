console.log('🚀 ZapEats Authentication Server Starting...\n');

const http = require('http');

// Create production server
const server = http.createServer((req, res) => {
  console.log(`📥 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  
  // CORS headers for all requests
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight handled');
    res.end();
    return;
  }
  
  // Health check endpoint
  if (req.url === '/api/health') {
    console.log('✅ Health check requested');
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
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔐 Login attempt for:', data.identifier || data.email);
        
        // Simple authentication - in production, this would check a database
        const validCredentials = (
          (data.identifier === 'test@example.com' || data.email === 'test@example.com') && 
          data.password === '123456'
        ) || (
          (data.identifier === 'admin@zapeats.com' || data.email === 'admin@zapeats.com') && 
          data.password === 'admin123'
        );
        
        if (validCredentials) {
          console.log('✅ LOGIN SUCCESSFUL!');
          const isAdmin = data.identifier === 'admin@zapeats.com' || data.email === 'admin@zapeats.com';
          res.end(JSON.stringify({
            success: true,
            message: 'Login successful',
            token: `jwt-token-${Date.now()}`,
            user: {
              id: isAdmin ? 'admin-001' : 'user-001',
              name: isAdmin ? 'Admin User' : 'Test User',
              email: isAdmin ? 'admin@zapeats.com' : 'test@example.com',
              role: isAdmin ? 'admin' : 'user',
              loyaltyPoints: isAdmin ? 0 : 100
            }
          }));
        } else {
          console.log('❌ Invalid credentials provided');
          res.writeHead(401, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ 
            success: false, 
            message: 'Invalid email or password' 
          }));
        }
      } catch (error) {
        console.log('❌ Login request error:', error.message);
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
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
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('👤 Registration attempt for:', data.email);
        
        // Validate required fields
        if (!data.name || !data.email || !data.password) {
          console.log('❌ Missing required fields');
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ 
            success: false, 
            message: 'Name, email, and password are required' 
          }));
          return;
        }
        
        // Simple validation
        if (data.password.length < 6) {
          console.log('❌ Password too short');
          res.writeHead(400, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ 
            success: false, 
            message: 'Password must be at least 6 characters long' 
          }));
          return;
        }
        
        // Check if email already exists (simple check)
        if (data.email === 'test@example.com' || data.email === 'admin@zapeats.com') {
          console.log('❌ Email already exists');
          res.writeHead(409, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ 
            success: false, 
            message: 'Email already registered' 
          }));
          return;
        }
        
        console.log('✅ REGISTRATION SUCCESSFUL!');
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful',
          token: `jwt-token-${Date.now()}`,
          user: {
            id: `user-${Date.now()}`,
            name: data.name,
            email: data.email,
            role: 'user',
            loyaltyPoints: 50 // Welcome bonus
          }
        }));
        
      } catch (error) {
        console.log('❌ Registration request error:', error.message);
        res.writeHead(400, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ 
          success: false, 
          message: 'Invalid request format' 
        }));
      }
    });
    return;
  }
  
  // Default response for unknown endpoints
  console.log('❓ Unknown endpoint requested');
  res.writeHead(404, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({ 
    message: 'ZapEats Authentication API - Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  }));
});

// Start server
const PORT = 3000;
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log('🎉 ZAPEATS AUTH SERVER STARTED SUCCESSFULLY!');
  console.log('==========================================');
  console.log(`📍 Server running at: http://${HOST}:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('   • GET  /api/health - Server health check');
  console.log('   • POST /api/auth/login - User login');
  console.log('   • POST /api/auth/register - User registration');
  console.log('==========================================');
  console.log('👤 Test Credentials:');
  console.log('   • Email: test@example.com, Password: 123456');
  console.log('   • Email: admin@zapeats.com, Password: admin123');
  console.log('==========================================');
  console.log('🚀 Server is ready to handle requests!');
  console.log('📝 Logs will appear below as requests come in...\n');
});

// Error handling
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`);
    console.log('💡 Try stopping other servers with: taskkill /F /IM node.exe');
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down server gracefully...');
  server.close(() => {
    console.log('✅ Server stopped successfully!');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n👋 Received termination signal, shutting down...');
  server.close(() => {
    console.log('✅ Server stopped successfully!');
    process.exit(0);
  });
});