const mongoose = require('mongoose');
require('./models/Order');
require('./models/Restaurant');
require('./models/User');

async function checkRecentOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/zapeats');
    console.log('✅ Connected to MongoDB');
    
    const Order = mongoose.model('Order');
    
    console.log('\n=== LATEST ORDERS WITH RESTAURANT INFO ===');
    const orders = await Order.find()
      .populate('restaurant', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
      
    orders.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}:`);
      console.log(`  ID: ${order._id}`);
      console.log(`  User: ${order.user.name} (${order.user.email})`);
      console.log(`  Restaurant: ${order.restaurant.name}`);
      console.log(`  Restaurant ID: ${order.restaurant._id}`);
      console.log(`  Items: ${order.items.map(item => item.name).join(', ')}`);
      console.log(`  Total: $${order.totalAmount.toFixed(2)}`);
      console.log(`  Status: ${order.status}`);
      console.log(`  Created: ${order.createdAt}`);
    });
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkRecentOrders();