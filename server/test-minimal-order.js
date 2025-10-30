const mongoose = require('mongoose');
const Order = require('./models/Order');
require('dotenv').config();

async function testOrderCreation() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats');
    console.log('Connected to MongoDB');
    
    // Test creating a simple order
    const testOrderData = {
      user: new mongoose.Types.ObjectId(),
      restaurant: new mongoose.Types.ObjectId(),
      items: [{
        menuItem: new mongoose.Types.ObjectId(),
        name: 'Test Item',
        price: 15.99,
        quantity: 1,
        itemTotal: 15.99
      }],
      subtotal: 15.99,
      deliveryFee: 2.99,
      serviceFee: 0.8,
      taxes: { gst: 2.88, deliveryTax: 0.54 },
      discount: {
        amount: 0,
        type: 'none',
        couponCode: '',
        description: ''
      },
      totalAmount: 22.2,
      deliveryAddress: {
        street: '123 Test Street',
        city: 'Test City',  
        state: 'Test State',
        zipCode: '12345'
      },
      paymentMethod: 'cash'
    };
    
    console.log('Creating order with data:', JSON.stringify(testOrderData.discount, null, 2));
    
    const order = new Order(testOrderData);
    console.log('Order instance created successfully');
    
    const result = await order.save();
    console.log('Order saved successfully with ID:', result._id);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error creating order:', error.message);
    if (error.errors) {
      console.error('Validation errors:', Object.keys(error.errors));
      for (const [field, err] of Object.entries(error.errors)) {
        console.error(`- ${field}:`, err.message);
      }
    }
  }
}

testOrderCreation();