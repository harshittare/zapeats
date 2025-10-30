const mongoose = require('mongoose');

async function testMongoDB() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect('mongodb://localhost:27017/zapeats');
    console.log('Successfully connected to MongoDB');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ name: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ name: 'Test' });
    await testDoc.save();
    console.log('Successfully created test document');
    
    await testDoc.deleteOne();
    console.log('Successfully deleted test document');
    
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('MongoDB error:', error);
  }
}

testMongoDB();