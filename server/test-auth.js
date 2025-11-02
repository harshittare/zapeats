const axios = require('axios');

const testLogin = async () => {
  try {
    console.log('🔐 Testing login API...');
    
    const response = await axios.post('http://localhost:5001/api/auth/login', {
      identifier: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login API Response:', {
      success: response.data.success,
      message: response.data.message,
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      userName: response.data.user?.name
    });
    
    if (response.data.success) {
      console.log('🎉 Login working correctly!');
      console.log('User:', response.data.user.name, '(' + response.data.user.email + ')');
    }
    
  } catch (error) {
    console.error('❌ Login failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
  }
};

const testRegister = async () => {
  try {
    console.log('\n📝 Testing registration API...');
    
    const testEmail = `test${Date.now()}@example.com`;
    const response = await axios.post('http://localhost:5001/api/auth/register', {
      name: 'Test New User',
      email: testEmail,
      password: 'password123'
    });
    
    console.log('✅ Registration API Response:', {
      success: response.data.success,
      message: response.data.message,
      hasToken: !!response.data.token,
      hasUser: !!response.data.user,
      userName: response.data.user?.name
    });
    
    if (response.data.success) {
      console.log('🎉 Registration working correctly!');
      console.log('New User:', response.data.user.name, '(' + response.data.user.email + ')');
    }
    
  } catch (error) {
    console.error('❌ Registration failed:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
  }
};

// Run tests
testLogin().then(() => testRegister());