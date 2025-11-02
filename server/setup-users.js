const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats');
    console.log('✅ Connected to MongoDB');

    // Check existing users
    const existingUsers = await User.find({});
    console.log(`📊 Found ${existingUsers.length} existing users`);
    
    // Try to find admin user
    const adminUser = await User.findOne({ email: 'admin@zapeats.com' });
    if (adminUser) {
      console.log('✅ Admin user exists:', adminUser.email, 'Role:', adminUser.role);
    } else {
      console.log('❌ Admin user not found, creating one...');
      
      // Create admin user
      const newAdmin = new User({
        name: 'ZapEats Admin',
        email: 'admin@zapeats.com',
        password: 'admin123',
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('✅ Admin user created successfully');
    }

    // Try to find test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (testUser) {
      console.log('✅ Test user exists:', testUser.email, 'Role:', testUser.role);
    } else {
      console.log('❌ Test user not found, creating one...');
      
      // Create test user
      const newUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'user'
      });
      
      await newUser.save();  
      console.log('✅ Test user created successfully');
    }

    // List all users
    const allUsers = await User.find({}, 'name email role');
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log('\n🎉 Setup complete! You can now try logging in with:');
    console.log('  Admin: admin@zapeats.com / admin123');
    console.log('  User: test@example.com / 123456');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testLogin();