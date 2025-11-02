const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/zapeats')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function fixInconsistentOrders() {
  try {
    console.log('🔍 Looking for orders with inconsistent restaurant-menu item associations...');
    
    // Find all orders
    const orders = await Order.find({})
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name restaurant');
    
    let inconsistentOrders = [];
    
    for (const order of orders) {
      for (const item of order.items) {
        if (item.menuItem && item.menuItem.restaurant.toString() !== order.restaurant._id.toString()) {
          inconsistentOrders.push({
            orderId: order._id,
            orderRestaurant: order.restaurant.name,
            orderRestaurantId: order.restaurant._id,
            itemName: item.menuItem.name,
            itemActualRestaurant: item.menuItem.restaurant,
            itemStoredName: item.name
          });
        }
      }
    }
    
    if (inconsistentOrders.length > 0) {
      console.log(`❌ Found ${inconsistentOrders.length} inconsistent orders:`);
      inconsistentOrders.forEach((issue, index) => {
        console.log(`\n${index + 1}. Order ${issue.orderId}:`);
        console.log(`   Order says restaurant: ${issue.orderRestaurant} (${issue.orderRestaurantId})`);
        console.log(`   But item "${issue.itemName}" actually belongs to restaurant: ${issue.itemActualRestaurant}`);
        console.log(`   Item name stored in order: "${issue.itemStoredName}"`);
      });
      
      // Fix these orders by updating the restaurant to match the menu item's restaurant
      console.log(`\n🔧 Fixing inconsistent orders...`);
      
      for (const issue of inconsistentOrders) {
        const menuItem = await MenuItem.findOne({ name: issue.itemName });
        if (menuItem) {
          await Order.findByIdAndUpdate(issue.orderId, {
            restaurant: menuItem.restaurant
          });
          console.log(`✅ Fixed order ${issue.orderId} - updated restaurant to match menu item`);
        }
      }
    } else {
      console.log('✅ No inconsistent orders found - all orders have correct restaurant-menu item associations');
    }
    
  } catch (error) {
    console.error('❌ Error fixing inconsistent orders:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixInconsistentOrders();