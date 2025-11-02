// Direct test of the authentication server
const http = require('http');

console.log('🧪 Direct Authentication Test');
console.log('============================');

// Wait a moment for server to be ready
setTimeout(async () => {
  
  // Test 1: Health Check
  console.log('\n1️⃣ Testing Health Check...');
  try {
    const healthResult = await makeRequest('GET', '/api/health');
    console.log('✅ Health check successful!');
    console.log('   Response:', healthResult.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test 2: Login
  console.log('\n2️⃣ Testing Login...');
  try {
    const loginData = { identifier: 'test@example.com', password: '123456' };
    const loginResult = await makeRequest('POST', '/api/auth/login', loginData);
    console.log('✅ Login successful!');
    console.log('   User:', loginResult.data.user.name);
    console.log('   Token:', loginResult.data.token);
  } catch (error) {
    console.log('❌ Login failed:', error.message);
  }
  
  // Test 3: Registration
  console.log('\n3️⃣ Testing Registration...');
  try {
    const registerData = { name: 'New User', email: 'newuser@test.com', password: 'password123' };
    const registerResult = await makeRequest('POST', '/api/auth/register', registerData);
    console.log('✅ Registration successful!');
    console.log('   User:', registerResult.data.user.name);
    console.log('   Token:', registerResult.data.token);
  } catch (error) {
    console.log('❌ Registration failed:', error.message);
  }
  
  console.log('\n🏁 Testing complete!');
  
}, 1000);

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const responseData = JSON.parse(body);
          resolve({ statusCode: res.statusCode, data: responseData });
        } catch (err) {
          resolve({ statusCode: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}