const axios = require('axios');

async function simpleTest() {
  try {
    console.log('Testing connection to server...');
    
    // Test health endpoint first
    const healthResponse = await axios.get('http://localhost:5001/api/health');
    console.log('✅ Health check:', healthResponse.data);
    
    // Test registration
    console.log('\nTesting registration...');
    const registerResponse = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Debug User',
      email: 'debug@test.com',
      password: '123456'
    });
    console.log('✅ Registration success:', registerResponse.data);
    
  } catch (error) {
    console.error('❌ Error details:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }
    if (error.request) {
      console.error('Request:', error.request);
    }
  }
}

simpleTest();