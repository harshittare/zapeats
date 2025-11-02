// Test script for ZapEats Authentication Server
const http = require('http');

console.log('🧪 ZapEats Authentication Server Test Suite');
console.log('==========================================\n');

// Test configuration
const SERVER_URL = 'http://localhost:3000';
const TEST_DELAY = 2000; // Wait 2 seconds for server to be ready

// Test utilities
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, data: response, body });
        } catch (err) {
          resolve({ statusCode: res.statusCode, data: null, body });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test cases
async function testHealthCheck() {
  console.log('1️⃣ Testing Health Check Endpoint...');
  try {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    };
    
    const result = await makeRequest(options);
    
    if (result.statusCode === 200 && result.data.status === 'OK') {
      console.log('   ✅ Health check PASSED');
      console.log(`   📊 Status: ${result.data.status}`);
      console.log(`   💬 Message: ${result.data.message}`);
      return true;
    } else {
      console.log('   ❌ Health check FAILED');
      console.log(`   📊 Status Code: ${result.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Health check ERROR:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n2️⃣ Testing Login Endpoint...');
  try {
    const loginData = {
      identifier: 'test@example.com',
      password: '123456'
    };
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const result = await makeRequest(options, loginData);
    
    if (result.statusCode === 200 && result.data.success) {
      console.log('   ✅ Login PASSED');
      console.log(`   👤 User: ${result.data.user.name}`);
      console.log(`   📧 Email: ${result.data.user.email}`);
      console.log(`   🎯 Role: ${result.data.user.role}`);
      console.log(`   🏆 Points: ${result.data.user.loyaltyPoints}`);
      console.log(`   🎫 Token: ${result.data.token.substring(0, 20)}...`);
      return true;
    } else {
      console.log('   ❌ Login FAILED');
      console.log(`   📊 Status Code: ${result.statusCode}`);
      console.log(`   💬 Message: ${result.data.message}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Login ERROR:', error.message);
    return false;
  }
}

async function testInvalidLogin() {
  console.log('\n3️⃣ Testing Invalid Login...');
  try {
    const loginData = {
      identifier: 'wrong@example.com',
      password: 'wrongpassword'
    };
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const result = await makeRequest(options, loginData);
    
    if (result.statusCode === 401 && !result.data.success) {
      console.log('   ✅ Invalid login properly rejected');
      console.log(`   💬 Message: ${result.data.message}`);
      return true;
    } else {
      console.log('   ❌ Invalid login test FAILED');
      console.log(`   📊 Status Code: ${result.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Invalid login test ERROR:', error.message);
    return false;
  }
}

async function testRegistration() {
  console.log('\n4️⃣ Testing Registration Endpoint...');
  try {
    const registerData = {
      name: 'New Test User',
      email: 'newuser@example.com',
      password: 'newpassword123'
    };
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const result = await makeRequest(options, registerData);
    
    if (result.statusCode === 201 && result.data.success) {
      console.log('   ✅ Registration PASSED');
      console.log(`   👤 User: ${result.data.user.name}`);
      console.log(`   📧 Email: ${result.data.user.email}`);
      console.log(`   🎯 Role: ${result.data.user.role}`);
      console.log(`   🏆 Points: ${result.data.user.loyaltyPoints}`);
      console.log(`   🎫 Token: ${result.data.token.substring(0, 20)}...`);
      return true;
    } else {
      console.log('   ❌ Registration FAILED');
      console.log(`   📊 Status Code: ${result.statusCode}`);
      console.log(`   💬 Message: ${result.data.message}`);
      return false;
    }
  } catch (error) {
    console.log('   ❌ Registration ERROR:', error.message);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log(`⏳ Waiting ${TEST_DELAY/1000} seconds for server to be ready...\n`);
  
  // Wait for server to be ready
  await new Promise(resolve => setTimeout(resolve, TEST_DELAY));
  
  const results = [];
  
  // Run all tests
  results.push(await testHealthCheck());
  results.push(await testLogin());
  results.push(await testInvalidLogin());
  results.push(await testRegistration());
  
  // Summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log('\n🏁 TEST SUMMARY');
  console.log('================');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 🎉 ALL TESTS PASSED! AUTHENTICATION IS WORKING! 🎉 🎉');
    console.log('🚀 Your login and registration functionality is ready for deployment!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server logs.');
  }
  
  console.log('\n💡 The server is still running. Use Ctrl+C to stop it.');
}

// Start the test suite
runAllTests().catch(console.error);