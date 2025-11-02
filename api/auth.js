// Vercel-compatible authentication server
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  const { method, url } = req;
  console.log(`${method} ${url}`);
  
  // Handle preflight OPTIONS requests
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Health check endpoint
  if (url === '/api/health') {
    res.status(200).json({
      status: 'OK',
      message: 'ZapEats Auth Server is running!',
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  // Login endpoint
  if (url === '/api/auth/login' && method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔐 Login attempt:', data.identifier || data.email);
        
        // Check credentials
        if ((data.identifier === 'test@example.com' || data.email === 'test@example.com') && data.password === '123456') {
          console.log('✅ LOGIN SUCCESS!');
          res.status(200).json({
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
          });
        } else {
          console.log('❌ LOGIN FAILED - Invalid credentials');
          res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }
      } catch (error) {
        console.log('❌ Login error:', error.message);
        res.status(400).json({
          success: false,
          message: 'Invalid request format'
        });
      }
    });
    return;
  }
  
  // Registration endpoint
  if (url === '/api/auth/register' && method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('👤 Registration attempt:', data.email);
        
        // Validate required fields
        if (!data.name || !data.email || !data.password) {
          res.status(400).json({
            success: false,
            message: 'Name, email, and password are required'
          });
          return;
        }
        
        console.log('✅ REGISTRATION SUCCESS!');
        res.status(201).json({
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
        });
      } catch (error) {
        console.log('❌ Registration error:', error.message);
        res.status(400).json({
          success: false,
          message: 'Invalid request format'
        });
      }
    });
    return;
  }
  
  // 404 for unknown routes
  res.status(404).json({
    error: 'Route not found',
    availableEndpoints: [
      'GET /api/health',
      'POST /api/auth/login',
      'POST /api/auth/register'
    ]
  });
};