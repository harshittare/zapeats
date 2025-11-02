const http = require('http');
const url = require('url');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('🚀 Creating ZapEats Auth Server...');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats')
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// User model (simplified)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', userSchema);

// Helper functions
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { resolve({}); }
    });
  });
}

function sendJSON(res, status, data) {
  res.writeHead(status, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const { pathname } = url.parse(req.url);
  console.log('📥 Request received:', req.method, pathname);
  
  // CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }
  
  // Routes
  if (pathname === '/api/health') {
    sendJSON(res, 200, { status: 'OK', message: 'ZapEats Auth Server', timestamp: new Date().toISOString() });
  } 
  else if (pathname === '/api/auth/login' && req.method === 'POST') {
    try {
      const { identifier, password } = await parseBody(req);
      console.log('🔐 Login attempt:', identifier);
      
      const user = await User.findOne({ email: identifier });
      if (!user || !(await user.comparePassword(password))) {
        return sendJSON(res, 401, { success: false, message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user._id, role: user.role }, 'secret-key', { expiresIn: '7d' });
      console.log('✅ Login successful:', user.email);
      sendJSON(res, 200, {
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, loyaltyPoints: 0 }
      });
    } catch (error) {
      console.error('❌ Login error:', error);
      sendJSON(res, 500, { success: false, message: 'Server error' });
    }
  }
  else if (pathname === '/api/auth/register' && req.method === 'POST') {
    try {
      const { name, email, password } = await parseBody(req);
      console.log('👤 Registration attempt:', email);
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return sendJSON(res, 400, { success: false, message: 'User already exists' });
      }
      
      const user = new User({ name, email, password });
      await user.save();
      
      const token = jwt.sign({ userId: user._id, role: user.role }, 'secret-key', { expiresIn: '7d' });
      console.log('✅ Registration successful:', user.email);
      sendJSON(res, 201, {
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, loyaltyPoints: 0 }
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
      sendJSON(res, 500, { success: false, message: 'Server error' });
    }
  }
  else {
    sendJSON(res, 404, { success: false, message: 'Route not found' });
  }
});

server.listen(5001, '127.0.0.1', () => {
  console.log('✅ ZapEats Auth Server listening on 127.0.0.1:5001');
  console.log('🌐 Health: http://127.0.0.1:5001/api/health');
  console.log('🔐 Login: http://127.0.0.1:5001/api/auth/login');
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Keep alive
setInterval(() => {
  console.log('💓 Server heartbeat:', new Date().toLocaleTimeString());
}, 5000);

// Removed SIGINT handler to prevent automatic shutdown