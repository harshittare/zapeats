const http = require('http');
const url = require('url');
const querystring = require('querystring');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('🚀 Starting ZapEats Authentication Server...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats')
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Import User model (simplified inline version for testing)
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  loyaltyPoints: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Handle login
async function handleLogin(req, res) {
  try {
    const { identifier, password } = await parseBody(req);
    console.log('🔐 Login attempt for:', identifier);
    
    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });
    
    if (!user) {
      console.log('❌ User not found:', identifier);
      return sendJSON(res, 401, { success: false, message: 'Invalid credentials' });
    }
    
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', identifier);
      return sendJSON(res, 401, { success: false, message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('✅ Login successful for:', user.email);
    sendJSON(res, 200, {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    sendJSON(res, 500, { success: false, message: 'Server error' });
  }
}

// Handle registration
async function handleRegister(req, res) {
  try {
    const { name, email, phone, password } = await parseBody(req);
    console.log('👤 Registration attempt for:', email || phone);
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      return sendJSON(res, 400, { success: false, message: 'User already exists' });
    }
    
    // Create new user
    const user = new User({ name, email, phone, password });
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );
    
    console.log('✅ Registration successful for:', user.email);
    sendJSON(res, 201, {
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints
      }
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    sendJSON(res, 500, { success: false, message: 'Server error' });
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const { pathname, query } = url.parse(req.url, true);
  
  console.log(`📥 ${req.method} ${pathname}`);
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }
  
  // Route handling
  if (pathname === '/api/health') {
    sendJSON(res, 200, {
      status: 'OK',
      message: 'ZapEats Auth Server Running',
      timestamp: new Date().toISOString()
    });
  } else if (pathname === '/api/auth/login' && req.method === 'POST') {
    await handleLogin(req, res);
  } else if (pathname === '/api/auth/register' && req.method === 'POST') {
    await handleRegister(req, res);
  } else {
    sendJSON(res, 404, { success: false, message: 'Route not found' });
  }
});

// Start server
server.listen(5001, () => {
  console.log('✅ ZapEats Auth Server running on port 5001');
  console.log('🌐 Health check: http://localhost:5001/api/health');
  console.log('🔐 Login endpoint: http://localhost:5001/api/auth/login');
  console.log('👤 Register endpoint: http://localhost:5001/api/auth/register');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Keep alive with heartbeat
setInterval(() => {
  console.log('💓 Auth server heartbeat:', new Date().toLocaleTimeString());
}, 10000);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down auth server...');
  server.close(() => {
    mongoose.disconnect();
    console.log('✅ Auth server stopped');
    process.exit(0);
  });
});