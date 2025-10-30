const axios = require('axios');

const testOrdersAPI = async () => {
  try {
    console.log('🔐 Testing login...');
    
    // Login first
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      identifier: 'test@example.com',
      password: 'password123'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }
    
    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log('✅ Login successful for user:', user.name);
    console.log('🔑 Token:', token.substring(0, 20) + '...');
    
    // Test orders endpoint
    console.log('\n📋 Testing orders API...');
    const ordersResponse = await axios.get('http://localhost:5001/api/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (ordersResponse.data.success) {
      console.log('✅ Orders API working!');
      console.log('📊 Found', ordersResponse.data.orders.length, 'orders');
      
      ordersResponse.data.orders.forEach((order, index) => {
        console.log(`\n📦 Order ${index + 1}:`);
        console.log(`   ID: ${order._id}`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Restaurant: ${order.restaurant?.name || 'Unknown'}`);
        console.log(`   Total: ₹${order.totalAmount}`);
        console.log(`   Items: ${order.items.length}`);
        console.log(`   Created: ${new Date(order.createdAt).toLocaleString()}`);
      });
    } else {
      console.log('❌ Orders API returned success: false');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
};

testOrdersAPI();