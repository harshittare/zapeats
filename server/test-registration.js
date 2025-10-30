const axios = require('axios');

async function testRegistration() {
  try {
    console.log('Testing registration API...');
    const response = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    console.error('Full error:', error);
  }
}

testRegistration();