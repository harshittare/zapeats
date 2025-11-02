const axios = require('axios');

async function quickTest() {
  try {
    console.log('🧪 Quick login test...');
    
    // Test login with existing user
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      identifier: 'test@example.com',
      password: '123456'
    });
    
    console.log('✅ LOGIN SUCCESS!');
    console.log('User:', response.data.user.name);
    console.log('Role:', response.data.user.role);
    console.log('Token received:', !!response.data.token);
    
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
  }
}

quickTest();