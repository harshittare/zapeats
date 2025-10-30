const mongoose = require('mongoose');
require('dotenv').config();

async function checkOrderSchema() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats');
    console.log('Connected to MongoDB');
    
    // Get the Order collection
    const db = mongoose.connection.db;
    const collection = db.collection('orders');
    
    // Get a sample order to see the current structure
    const sampleOrder = await collection.findOne({});
    
    if (sampleOrder) {
      console.log('Sample order structure:');
      console.log('Discount field type:', typeof sampleOrder.discount);
      console.log('Discount value:', JSON.stringify(sampleOrder.discount, null, 2));
    } else {
      console.log('No orders found in database');
    }
    
    // Check the schema validation for the collection
    const collectionInfo = await db.listCollections({ name: 'orders' }).toArray();
    console.log('Collection info:', JSON.stringify(collectionInfo, null, 2));
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkOrderSchema();