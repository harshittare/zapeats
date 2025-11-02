const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing ZapEats API...\n');

  try {
    // Test 1: Register a new user
    console.log('1️⃣ Testing user registration...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      name: 'Test User',
      email: 'testuser@example.com',
      password: '123456'
    });
    console.log('✅ Registration successful:', registerResponse.data);

    // Test 2: Login with the new user
    console.log('\n2️⃣ Testing user login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      identifier: 'testuser@example.com',
      password: '123456'
    });
    console.log('✅ Login successful:', loginResponse.data);
    const userToken = loginResponse.data.token;

    // Test 3: Login as admin
    console.log('\n3️⃣ Testing admin login...');
    const adminLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      identifier: 'admin@zapeats.com',
      password: 'admin123'
    });
    console.log('✅ Admin login successful:', adminLoginResponse.data);
    const adminToken = adminLoginResponse.data.token;

    // Test 4: Get current user info
    console.log('\n4️⃣ Testing get current user...');
    const meResponse = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('✅ User info retrieved:', meResponse.data);

    // Test 5: Get restaurants (if available)
    console.log('\n5️⃣ Testing get restaurants...');
    try {
      const restaurantsResponse = await axios.get(`${API_BASE_URL}/restaurants`);
      console.log('✅ Restaurants retrieved:', restaurantsResponse.data);
    } catch (error) {
      console.log('⚠️ Restaurants endpoint not available or empty');
    }

    console.log('\n🎉 All API tests completed successfully!');
    console.log('\n📝 Test Results:');
    console.log(`   - User Token: ${userToken.substring(0, 20)}...`);
    console.log(`   - Admin Token: ${adminToken.substring(0, 20)}...`);
    console.log(`   - Admin Role: ${adminLoginResponse.data.user.role}`);

  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
  }
}

testAPI();