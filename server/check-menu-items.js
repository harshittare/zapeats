const mongoose = require('mongoose');
require('./models/MenuItem');
require('./models/Restaurant');

async function checkMenuItems() {
  try {
    await mongoose.connect('mongodb://localhost:27017/zapeats');
    console.log('✅ Connected to MongoDB');
    
    const MenuItem = mongoose.model('MenuItem');
    const Restaurant = mongoose.model('Restaurant');
    
    console.log('\n=== MENU ITEMS BY RESTAURANT ===');
    
    const restaurants = await Restaurant.find({}, 'name _id');
    
    for (const restaurant of restaurants) {
      console.log(`\n--- ${restaurant.name} (${restaurant._id}) ---`);
      const menuItems = await MenuItem.find({ restaurant: restaurant._id });
      
      if (menuItems.length > 0) {
        menuItems.forEach((item, index) => {
          console.log(`  ${index + 1}. ${item.name} - $${item.price}`);
        });
      } else {
        console.log('  No menu items found');
      }
    }
    
    // Check specific items mentioned in orders
    console.log('\n=== SPECIFIC ITEM CHECKS ===');
    
    const pepperoniPizza = await MenuItem.findOne({ name: 'Pepperoni Pizza' })
      .populate('restaurant', 'name');
    if (pepperoniPizza) {
      console.log(`Pepperoni Pizza belongs to: ${pepperoniPizza.restaurant.name}`);
    }
    
    const margheritaPizza = await MenuItem.findOne({ name: 'Margherita Pizza' })
      .populate('restaurant', 'name');
    if (margheritaPizza) {
      console.log(`Margherita Pizza belongs to: ${margheritaPizza.restaurant.name}`);
    }
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMenuItems();