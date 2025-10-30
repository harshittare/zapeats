// Debug script to test frontend API connection
console.log('Testing API connection...');

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: 'admin@zapeats.com',
        password: 'admin123'
      })
    });

    const data = await response.json();
    console.log('Login test result:', data);

    if (data.success) {
      console.log('✅ Login successful');
      console.log('User:', data.user);
      console.log('Token:', data.token);
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

testLogin();