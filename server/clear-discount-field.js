const mongoose = require('mongoose');
require('dotenv').config();

async function clearDiscountField() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats');
    console.log('Connected to MongoDB');
    
    // Get the Order collection directly
    const db = mongoose.connection.db;
    const collection = db.collection('orders');
    
    // Count orders with discount field
    const ordersWithDiscount = await collection.countDocuments({ discount: { $exists: true } });
    console.log('Orders with discount field:', ordersWithDiscount);
    
    // If there are orders with discount field, remove it to reset schema
    if (ordersWithDiscount > 0) {
      const result = await collection.updateMany({}, { $unset: { discount: 1 } });
      console.log('Removed discount field from', result.modifiedCount, 'orders');
    }
    
    // Check the collection info again
    const sampleOrder = await collection.findOne({});
    if (sampleOrder) {
      console.log('Sample order after cleanup - has discount:', 'discount' in sampleOrder);
    }
    
    await mongoose.disconnect();
    console.log('Cleanup completed');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

clearDiscountField();