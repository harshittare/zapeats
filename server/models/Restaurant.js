const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    alt: String
  }],
  logo: {
    type: String,
    required: true
  },
  
  // Contact & Location
  phone: String,
  email: String,
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  
  // Business Details
  cuisines: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['restaurant', 'cafe', 'bakery', 'fast-food', 'fine-dining', 'food-truck'],
    default: 'restaurant'
  },
  
  // Operational Details
  isOpen: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    monday: { open: String, close: String, isClosed: Boolean },
    tuesday: { open: String, close: String, isClosed: Boolean },
    wednesday: { open: String, close: String, isClosed: Boolean },
    thursday: { open: String, close: String, isClosed: Boolean },
    friday: { open: String, close: String, isClosed: Boolean },
    saturday: { open: String, close: String, isClosed: Boolean },
    sunday: { open: String, close: String, isClosed: Boolean }
  },
  
  // Delivery Details
  deliveryRadius: {
    type: Number,
    default: 5 // in kilometers
  },
  deliveryTime: {
    min: { type: Number, default: 30 },
    max: { type: Number, default: 45 }
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  minimumOrderAmount: {
    type: Number,
    default: 0
  },
  
  // Ratings & Reviews
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  
  // Features
  features: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'halal', 'gluten-free', 'organic', 'farm-to-table', 'live-music', 'outdoor-seating']
  }],
  
  // Pricing
  priceRange: {
    type: String,
    enum: ['$', '$$', '$$$', '$$$$'],
    default: '$$'
  },
  
  // Promotions & Offers
  currentOffers: [{
    title: String,
    description: String,
    discount: Number,
    validUntil: Date,
    minOrderAmount: Number
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Owner/Manager
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Statistics
  totalOrders: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  
  // Social Media
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    website: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
restaurantSchema.index({ "address.coordinates": "2dsphere" });

// Index for search
restaurantSchema.index({ 
  name: 'text', 
  description: 'text', 
  cuisines: 'text' 
});

// Virtual for checking if restaurant is currently open
restaurantSchema.virtual('isCurrentlyOpen').get(function() {
  if (!this.isOpen) return false;
  
  const now = new Date();
  const day = now.toLocaleLowerCase().slice(0, 3); // mon, tue, etc.
  const currentTime = now.getHours() * 100 + now.getMinutes(); // HHMM format
  
  const todayHours = this.operatingHours[day];
  if (!todayHours || todayHours.isClosed) return false;
  
  const openTime = parseInt(todayHours.open.replace(':', ''));
  const closeTime = parseInt(todayHours.close.replace(':', ''));
  
  return currentTime >= openTime && currentTime <= closeTime;
});

module.exports = mongoose.model('Restaurant', restaurantSchema);