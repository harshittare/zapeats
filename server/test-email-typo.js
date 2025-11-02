// Test login with both correct and incorrect email
const http = require('http');

console.log('🧪 Testing Login with Different Email Addresses\n');

// Test 1: Correct email
testLogin('test@example.com', '123456', 'CORRECT EMAIL');

// Test 2: Typo in email (your case)
testLogin('test@exapmle.com', '123456', 'TYPO IN EMAIL');

function testLogin(email, password, testName) {
  console.log(`\n🔍 ${testName}: ${email}`);
  
  const postData = JSON.stringify({
    identifier: email,
    password: password
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ LOGIN SUCCESS!');
          console.log(`👤 User: ${response.user.name}`);
          console.log(`📧 Email: ${response.user.email}`);
          console.log(`🎫 Token: ${response.token}`);
        } else {
          console.log('❌ LOGIN FAILED');
          console.log(`💬 Reason: ${response.message}`);
        }
      } catch (err) {
        console.log('❌ PARSE ERROR:', err.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (err) => {
    console.log('❌ REQUEST ERROR:', err.message);
  });

  req.write(postData);
  req.end();
}