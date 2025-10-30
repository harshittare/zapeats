const axios = require('axios');

const testPaymentValidation = async () => {
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
    
    // Test Cash on Delivery Order
    console.log('\n💸 Testing Cash on Delivery order...');
    const cashOrderPayload = {
      restaurantId: '68fe6677c25dd029fae03c2c', // Pizza Palace
      items: [{
        menuItemId: '68fe6678c25dd029fae03c38', // Margherita Pizza
        quantity: 1,
        customizations: [],
        specialInstructions: ''
      }],
      deliveryAddress: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        coordinates: { latitude: 19.076, longitude: 72.8777 }
      },
      paymentMethod: 'cash',
      specialInstructions: 'Ring the bell twice',
      contactlessDelivery: false,
      couponCode: ''
    };
    
    const cashResponse = await axios.post('http://localhost:5001/api/orders', cashOrderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (cashResponse.data.success) {
      console.log('✅ Cash on Delivery order created successfully!');
      console.log('📦 Order ID:', cashResponse.data.order._id);
      console.log('💰 Total:', cashResponse.data.order.totalAmount);
    } else {
      console.log('❌ Cash order failed:', cashResponse.data.message);
    }
    
    // Test GPay Order
    console.log('\n📱 Testing GPay order...');
    const gpayOrderPayload = {
      ...cashOrderPayload,
      paymentMethod: 'gpay'
    };
    
    const gpayResponse = await axios.post('http://localhost:5001/api/orders', gpayOrderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (gpayResponse.data.success) {
      console.log('✅ GPay order created successfully!');
      console.log('📦 Order ID:', gpayResponse.data.order._id);
      console.log('💰 Total:', gpayResponse.data.order.totalAmount);
    } else {
      console.log('❌ GPay order failed:', gpayResponse.data.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('❌ Full error:', error);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
};

testPaymentValidation();