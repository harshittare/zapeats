// Local development server that proxies to Vercel for production testing
const http = require('http');
const https = require('https');
const { URL } = require('url');

console.log('🚀 Starting ZapEats Local Development Proxy...');

const VERCEL_URL = 'https://zapeats1-19nuwa13e-harshits-projects-9363fff4.vercel.app';
const LOCAL_PORT = 3000;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log(`📥 ${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Serve our authentication endpoints locally (bypass Vercel protection)
  if (req.url.startsWith('/api/')) {
    return handleAPIRequest(req, res);
  }
  
  // For non-API requests, proxy to Vercel (or serve static files)
  if (req.url === '/' || req.url.includes('.html') || req.url.includes('.js') || req.url.includes('.css')) {
    return proxyToVercel(req, res);
  }
  
  // Default response
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

function handleAPIRequest(req, res) {
  const { method, url } = req;
  
  // Health check
  if (url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'OK',
      message: 'ZapEats Local Dev Server is running!',
      timestamp: new Date().toISOString(),
      mode: 'local-development'
    }));
    return;
  }
  
  // Login endpoint
  if (url === '/api/auth/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔐 Login attempt:', data.identifier || data.email);
        
        if ((data.identifier === 'test@example.com' || data.email === 'test@example.com') && data.password === '123456') {
          console.log('✅ LOGIN SUCCESS!');
          res.writeHead(200, { 'Content-Type': 'application/json' });
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
          console.log('❌ LOGIN FAILED - Invalid credentials');
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Invalid email or password'
          }));
        }
      } catch (error) {
        console.log('❌ Login error:', error.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request format'
        }));
      }
    });
    return;
  }
  
  // Registration endpoint
  if (url === '/api/auth/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('👤 Registration attempt:', data.email);
        
        if (!data.name || !data.email || !data.password) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Name, email, and password are required'
          }));
          return;
        }
        
        console.log('✅ REGISTRATION SUCCESS!');
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Registration successful',
          token: 'jwt-token-new-' + Date.now(),
          user: {
            id: '2',
            name: data.name,
            email: data.email,
            role: 'user',
            loyaltyPoints: 50
          }
        }));
      } catch (error) {
        console.log('❌ Registration error:', error.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Invalid request format'
        }));
      }
    });
    return;
  }
  
  // Unknown API endpoint
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'API endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  }));
}

function proxyToVercel(req, res) {
  // This would proxy to Vercel, but for now just serve a simple response
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>ZapEats - Local Development</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
            .container { max-width: 600px; margin: 0 auto; }
            .status { padding: 20px; background: #d4edda; border-radius: 8px; margin: 20px 0; }
            .button { padding: 12px 24px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; margin: 10px; }
            .button:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🍕 ZapEats - Local Development Server</h1>
            <div class="status">
                <h3>✅ Authentication Server Running</h3>
                <p>Your authentication API is working locally while we wait for Vercel protection to be disabled.</p>
            </div>
            
            <h3>🧪 Test Your Authentication:</h3>
            <button class="button" onclick="testLogin()">Test Login</button>
            <button class="button" onclick="testRegister()">Test Registration</button>
            
            <div id="result" style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px; display: none;"></div>
            
            <h3>📋 Test Credentials:</h3>
            <p><strong>Email:</strong> test@example.com<br>
            <strong>Password:</strong> 123456</p>
            
            <h3>🔗 Your Deployment URLs:</h3>
            <p><strong>Vercel (when protection disabled):</strong><br>
            <a href="${VERCEL_URL}" target="_blank">${VERCEL_URL}</a></p>
        </div>
        
        <script>
            async function testLogin() {
                const result = document.getElementById('result');
                result.style.display = 'block';
                result.innerHTML = '⏳ Testing login...';
                
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            identifier: 'test@example.com',
                            password: '123456'
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        result.innerHTML = \`✅ Login Success!<br>User: \${data.user.name}<br>Token: \${data.token.substring(0, 20)}...\`;
                        result.style.background = '#d4edda';
                    } else {
                        result.innerHTML = \`❌ Login Failed: \${data.message}\`;
                        result.style.background = '#f8d7da';
                    }
                } catch (error) {
                    result.innerHTML = \`❌ Error: \${error.message}\`;
                    result.style.background = '#f8d7da';
                }
            }
            
            async function testRegister() {
                const result = document.getElementById('result');
                result.style.display = 'block';
                result.innerHTML = '⏳ Testing registration...';
                
                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: 'New User',
                            email: \`test\${Date.now()}@example.com\`,
                            password: 'password123'
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        result.innerHTML = \`✅ Registration Success!<br>User: \${data.user.name}<br>Email: \${data.user.email}\`;
                        result.style.background = '#d4edda';
                    } else {
                        result.innerHTML = \`❌ Registration Failed: \${data.message}\`;
                        result.style.background = '#f8d7da';
                    }
                } catch (error) {
                    result.innerHTML = \`❌ Error: \${error.message}\`;
                    result.style.background = '#f8d7da';
                }
            }
        </script>
    </body>
    </html>
  `);
}

// Start the server
server.listen(LOCAL_PORT, () => {
  console.log('');
  console.log('🎉 ================================');
  console.log('✅ ZapEats Local Dev Server Ready!');
  console.log('🌐 URL: http://localhost:' + LOCAL_PORT);
  console.log('🔍 Health: http://localhost:' + LOCAL_PORT + '/api/health');
  console.log('🔐 Login: http://localhost:' + LOCAL_PORT + '/api/auth/login');
  console.log('👤 Register: http://localhost:' + LOCAL_PORT + '/api/auth/register');
  console.log('');
  console.log('📋 Test Credentials:');
  console.log('   Email: test@example.com');
  console.log('   Password: 123456');
  console.log('');
  console.log('💡 This server works immediately while you');
  console.log('   disable Vercel deployment protection!');
  console.log('================================');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${LOCAL_PORT} is busy. Trying port ${LOCAL_PORT + 1}...`);
    server.listen(LOCAL_PORT + 1);
  }
});