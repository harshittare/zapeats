const axios = require('axios');

async function testFullCheckoutFlow() {
  try {
    console.log('🧪 Testing full checkout flow...');
    
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
      identifier: 'test@example.com',
      password: 'password123'
    });
    
    if (!loginResponse.data.success) {
      throw new Error('Login failed');
    }
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Step 2: Get restaurants
    console.log('2. Getting restaurants...');
    const restaurantsResponse = await axios.get('http://localhost:5001/api/restaurants');
    const restaurant = restaurantsResponse.data.data.restaurants[0];
    console.log(`✅ Using restaurant: ${restaurant.name}`);
    
    // Step 3: Get menu items
    console.log('3. Getting menu items...');
    const menuResponse = await axios.get(`http://localhost:5001/api/restaurants/${restaurant._id}/menu`);
    const categories = Object.keys(menuResponse.data.data);
    const menuItem = menuResponse.data.data[categories[0]][0];
    console.log(`✅ Using menu item: ${menuItem.name}`);
    
    // Step 4: Create order (simulating checkout)
    console.log('4. Creating order through checkout...');
    const orderPayload = {
      restaurantId: restaurant._id,
      items: [{
        menuItemId: menuItem._id,
        quantity: 1,
        customizations: [],
        specialInstructions: '',
        price: menuItem.price
      }],
      deliveryAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        coordinates: { latitude: 40.7128, longitude: -74.006 }
      },
      paymentMethod: 'cash',
      specialInstructions: 'Test checkout order',
      contactlessDelivery: false,
      couponCode: ''
    };
    
    const orderResponse = await axios.post(
      'http://localhost:5001/api/orders',
      orderPayload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (orderResponse.data.success) {
      console.log('✅ Order created successfully!');
      console.log('📋 Order Details:');
      console.log(`   Order ID: ${orderResponse.data.order._id}`);
      console.log(`   Status: ${orderResponse.data.order.status}`);
      console.log(`   Total: $${orderResponse.data.order.totalAmount.toFixed(2)}`);
      console.log(`   Items: ${orderResponse.data.order.items.length}`);
      console.log(`   Payment: ${orderResponse.data.order.paymentMethod}`);
      
      // Step 5: Verify order can be retrieved
      console.log('5. Retrieving order...');
      const retrieveResponse = await axios.get(
        `http://localhost:5001/api/orders/${orderResponse.data.order._id}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (retrieveResponse.data.success) {
        console.log('✅ Order retrieval successful');
        console.log('🎉 Full checkout flow completed successfully!');
        return true;
      } else {
        console.log('❌ Order retrieval failed');
        return false;
      }
    } else {
      console.log('❌ Order creation failed');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Checkout flow failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    return false;
  }
}

testFullCheckoutFlow().then(success => {
  console.log('\n' + '='.repeat(50));
  console.log(success ? '🎉 ALL TESTS PASSED! Checkout is working!' : '❌ Tests failed');
  console.log('='.repeat(50));
});