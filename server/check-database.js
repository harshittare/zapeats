const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/zapeats')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Get database instance
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📁 Collections in zapeats database:');
    
    if (collections.length === 0) {
      console.log('   No collections found - database is empty');
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments();
        console.log(`   📄 ${collection.name}: ${count} documents`);
      }
    }
    
    // Show sample data from each collection
    console.log('\n📊 Sample data from each collection:');
    for (const collection of collections) {
      console.log(`\n--- ${collection.name.toUpperCase()} ---`);
      const sampleDocs = await db.collection(collection.name).find({}).limit(2).toArray();
      
      if (sampleDocs.length === 0) {
        console.log('   (empty collection)');
      } else {
        sampleDocs.forEach((doc, index) => {
          console.log(`   Document ${index + 1}:`, JSON.stringify(doc, null, 2));
        });
      }
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });