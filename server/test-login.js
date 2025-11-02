const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testLogin() {
  try {
    console.log('🧪 Testing login functionality...\n');

    // Test 1: Login with test user
    console.log('1️⃣ Testing user login...');
    try {
      const userResponse = await axios.post(`${API_BASE}/auth/login`, {
        identifier: 'test@example.com',
        password: '123456'
      });
      console.log('✅ User login successful!');
      console.log('   User:', userResponse.data.user.name);
      console.log('   Role:', userResponse.data.user.role);
      console.log('   Token:', userResponse.data.token ? 'Generated' : 'Missing');
    } catch (error) {
      console.log('❌ User login failed:', error.response?.data?.message || error.message);
      console.log('   Error details:', error.code, error.errno);
      if (error.response) {
        console.log('   Response status:', error.response.status);
        console.log('   Response data:', error.response.data);
      }
    }

    console.log();

    // Test 2: Login with admin user
    console.log('2️⃣ Testing admin login...');
    try {
      const adminResponse = await axios.post(`${API_BASE}/auth/login`, {
        identifier: 'admin@zapeats.com',
        password: 'admin123'
      });
      console.log('✅ Admin login successful!');
      console.log('   User:', adminResponse.data.user.name);
      console.log('   Role:', adminResponse.data.user.role);
      console.log('   Token:', adminResponse.data.token ? 'Generated' : 'Missing');
    } catch (error) {
      console.log('❌ Admin login failed:', error.response?.data?.message || error.message);
      console.log('   Error details:', error.code, error.errno);
      if (error.response) {
        console.log('   Response status:', error.response.status);
        console.log('   Response data:', error.response.data);
      }
    }

    console.log();

    // Test 3: Login with wrong password
    console.log('3️⃣ Testing wrong password...');
    try {
      const wrongResponse = await axios.post(`${API_BASE}/auth/login`, {
        identifier: 'test@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ Wrong password should have failed but succeeded');
    } catch (error) {
      console.log('✅ Wrong password correctly rejected:', error.response?.data?.message);
    }

    console.log();

    // Test 4: Test registration
    console.log('4️⃣ Testing registration...');
    try {
      const regResponse = await axios.post(`${API_BASE}/auth/register`, {
        name: 'New User',
        email: 'newuser@example.com',
        password: '123456'
      });
      console.log('✅ Registration successful!');
      console.log('   User:', regResponse.data.user.name);
      console.log('   Role:', regResponse.data.user.role);
    } catch (error) {
      console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ Test setup failed:', error.message);
  }
}

// Wait a moment for server to be ready
console.log('⏳ Waiting for server...');
setTimeout(testLogin, 2000);