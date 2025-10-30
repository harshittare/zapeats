const axios = require('axios');
require('dotenv').config();

async function testOrderCreation() {
  try {
    console.log('🧪 Testing order creation...');
    
    // First, get a valid user token (we'll need to login)
    console.log('1. Getting restaurants...');
    const restaurantsResponse = await axios.get('http://localhost:5001/api/restaurants');
    console.log('Restaurants response:', restaurantsResponse.data.data.restaurants.length, 'restaurants found');
    
    const restaurant = restaurantsResponse.data.data.restaurants[0];
    console.log('Using restaurant:', restaurant.name, 'ID:', restaurant._id);
    
    // Get menu items for this restaurant
    console.log('2. Getting menu items...');
    const menuResponse = await axios.get(`http://localhost:5001/api/restaurants/${restaurant._id}/menu`);
    console.log('Menu response success:', menuResponse.data.success);
    
    if (menuResponse.data.success && menuResponse.data.data) {
      // The menu is grouped by category, get the first item from any category
      const categories = Object.keys(menuResponse.data.data);
      if (categories.length === 0) {
        throw new Error('No menu categories found');
      }
      const firstCategory = menuResponse.data.data[categories[0]];
      if (!firstCategory || firstCategory.length === 0) {
        throw new Error('No menu items found in first category');
      }
      const menuItem = firstCategory[0];
      console.log('Using menu item:', menuItem.name, 'ID:', menuItem._id);
      
      // Login with existing test user
      console.log('3. Logging in with existing test user...');
      const loginResponse = await axios.post('http://localhost:5001/api/auth/login', {
        identifier: 'test@example.com',
        password: 'password123'
      });
      
      if (!loginResponse.data.success) {
        throw new Error('Login failed: ' + loginResponse.data.message);
      }
      
      const token = loginResponse.data.token;
      console.log('Login successful, got token');
      
      // Now create an order
      console.log('4. Creating order...');
      const orderPayload = {
        restaurantId: restaurant._id,
        items: [{
          menuItemId: menuItem._id,
          quantity: 2,
          customizations: [],
          specialInstructions: '',
          price: menuItem.price || 15.99
        }],
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
          coordinates: { latitude: 40.7128, longitude: -74.006 }
        },
        paymentMethod: 'cash',
        specialInstructions: 'Test order',
        contactlessDelivery: false,
        couponCode: ''
      };
      
      console.log('Order payload:');
      console.log(JSON.stringify(orderPayload, null, 2));
      
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
      
      console.log('✅ Order creation SUCCESS!');
      console.log('Order ID:', orderResponse.data.order._id);
      console.log('Order status:', orderResponse.data.order.status);
      
    } else {
      console.log('❌ No menu items found for restaurant');
    }
    
  } catch (error) {
    console.error('❌ Order creation FAILED:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testOrderCreation();