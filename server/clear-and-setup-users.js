const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function clearAndSetupUsers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats');
    console.log('✅ Connected to MongoDB');

    // Clear existing users to reset indexes
    console.log('🗑️ Clearing existing users...');
    await User.collection.drop().catch(() => console.log('Users collection not found, creating new'));
    
    console.log('✅ Users collection cleared');

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User({
      name: 'ZapEats Admin',
      email: 'admin@zapeats.com',
      password: 'admin123',
      role: 'admin'
    });
    adminUser.referralCode = adminUser.generateReferralCode();
    await adminUser.save();
    console.log('✅ Admin user created:', adminUser.email);

    // Create test user
    console.log('👤 Creating test user...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456',
      role: 'user'
    });
    testUser.referralCode = testUser.generateReferralCode();
    await testUser.save();
    console.log('✅ Test user created:', testUser.email);

    // Verify users
    const allUsers = await User.find({}, 'name email role referralCode');
    console.log('\n📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role} [${user.referralCode}]`);
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

clearAndSetupUsers();