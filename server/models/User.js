const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Social login
  googleId: String,
  facebookId: String,
  
  // Profile information
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  
  // Addresses
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  
  // Preferences
  preferences: {
    cuisine: [String],
    dietary: {
      type: [String],
      enum: ['vegetarian', 'vegan', 'gluten-free', 'keto', 'low-carb', 'halal']
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra-hot'],
      default: 'medium'
    },
    notifications: {
      orders: { type: Boolean, default: true },
      promotions: { type: Boolean, default: true },
      news: { type: Boolean, default: false }
    }
  },
  
  // Gamification
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    icon: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  orderStreak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastOrderDate: Date
  },
  
  // Favorites
  favoriteRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }],
  favoriteDishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  }],
  
  // Payment methods
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'wallet', 'upi']
    },
    provider: String,
    last4: String,
    isDefault: Boolean
  }],
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  
  // Referral system
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ "addresses.coordinates": "2dsphere" });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate referral code
userSchema.methods.generateReferralCode = function() {
  return this.name.replace(/\s/g, '').toLowerCase() + Math.random().toString(36).substr(2, 4);
};

module.exports = mongoose.model('User', userSchema);