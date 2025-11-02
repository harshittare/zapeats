const http = require('http');

console.log('🧪 Testing API endpoints...');

// Test health endpoint
function testHealth() {
  return new Promise((resolve, reject) => {
    const req = http.request('http://localhost:5001/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Health check response:', data);
        resolve(data);
      });
    });
    
    req.on('error', err => {
      console.log('❌ Health check error:', err.message);
      reject(err);
    });
    
    req.end();
  });
}

// Test registration endpoint
function testRegistration() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });
    
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Registration response:', data);
        resolve(data);
      });
    });
    
    req.on('error', err => {
      console.log('❌ Registration error:', err.message);
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

// Run tests
async function runTests() {
  try {
    console.log('\n1️⃣ Testing health endpoint...');
    await testHealth();
    
    console.log('\n2️⃣ Testing registration endpoint...');
    await testRegistration();
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.log('\n❌ Test failed:', error.message);
  }
}

// Wait a moment for server to be ready, then run tests
setTimeout(runTests, 1000);