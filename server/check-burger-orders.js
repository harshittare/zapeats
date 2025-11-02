const mongoose = require('mongoose');
require('./models/Order');
require('./models/Restaurant');
require('./models/User');

async function checkBurgerOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/zapeats');
    console.log('✅ Connected to MongoDB');
    
    const Order = mongoose.model('Order');
    const Restaurant = mongoose.model('Restaurant');
    
    // Find Burger Barn restaurant
    const burgerBarn = await Restaurant.findOne({ name: 'Burger Barn' });
    console.log('Burger Barn restaurant found:', burgerBarn ? `${burgerBarn.name} (${burgerBarn._id})` : 'Not found');
    
    if (burgerBarn) {
      console.log('\n=== ORDERS FROM BURGER BARN ===');
      const burgerOrders = await Order.find({ restaurant: burgerBarn._id })
        .populate('user', 'name email')
        .populate('restaurant', 'name')
        .sort({ createdAt: -1 });
      
      if (burgerOrders.length > 0) {
        burgerOrders.forEach((order, index) => {
          console.log(`\nOrder ${index + 1}:`);
          console.log(`  ID: ${order._id}`);
          console.log(`  User: ${order.user.name} (${order.user.email})`);
          console.log(`  Restaurant: ${order.restaurant.name}`);
          console.log(`  Items: ${order.items.map(item => item.name).join(', ')}`);
          console.log(`  Total: $${order.totalAmount.toFixed(2)}`);
          console.log(`  Status: ${order.status}`);
          console.log(`  Created: ${order.createdAt}`);
        });
      } else {
        console.log('No orders found from Burger Barn');
      }
    }
    
    // Also check recent orders for the current user to see what they're seeing
    console.log('\n=== RECENT ORDERS FOR CURRENT USER ===');
    const testUser = await mongoose.model('User').findOne({ email: 'test@example.com' });
    if (testUser) {
      const userOrders = await Order.find({ user: testUser._id })
        .populate('restaurant', 'name')
        .sort({ createdAt: -1 })
        .limit(5);
        
      userOrders.forEach((order, index) => {
        console.log(`\nUser Order ${index + 1}:`);
        console.log(`  Restaurant: ${order.restaurant ? order.restaurant.name : 'RESTAURANT NOT POPULATED'}`);
        console.log(`  Items: ${order.items.map(item => item.name).join(', ')}`);
        console.log(`  Status: ${order.status}`);
        console.log(`  Created: ${order.createdAt}`);
      });
    }
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkBurgerOrders();