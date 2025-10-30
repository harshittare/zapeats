const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@zapeats.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@zapeats.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'ZapEats Admin',
      email: 'admin@zapeats.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      isVerified: true,
      loyaltyPoints: 0
    });

    // Generate referral code
    adminUser.referralCode = adminUser.generateReferralCode();

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@zapeats.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: admin');
    console.log('\nYou can now login with these credentials.');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();