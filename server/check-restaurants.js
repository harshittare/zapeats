const mongoose = require('mongoose');
require('./models/Restaurant');

async function checkRestaurants() {
  try {
    await mongoose.connect('mongodb://localhost:27017/zapeats');
    console.log('✅ Connected to MongoDB');
    
    const Restaurant = mongoose.model('Restaurant');
    
    console.log('\n=== ALL RESTAURANTS ===');
    const restaurants = await Restaurant.find({}, 'name _id');
    
    restaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name} (ID: ${restaurant._id})`);
    });
    
    console.log('\n=== RESTAURANTS WITH "BURGER" IN NAME ===');
    const burgerRestaurants = await Restaurant.find({ 
      name: { $regex: /burger/i } 
    }, 'name _id');
    
    if (burgerRestaurants.length > 0) {
      burgerRestaurants.forEach((restaurant, index) => {
        console.log(`${index + 1}. ${restaurant.name} (ID: ${restaurant._id})`);
      });
    } else {
      console.log('No restaurants found with "burger" in the name');
    }
    
    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkRestaurants();