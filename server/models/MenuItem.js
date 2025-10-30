const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
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
  
  // Category & Classification
  category: {
    type: String,
    required: true,
    enum: ['appetizers', 'starters', 'soups', 'salads', 'main-course', 'desserts', 'beverages', 'combos', 'specials']
  },
  subcategory: String,
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: Number, // for showing discounts
  
  // Variants/Customizations
  variants: [{
    name: String, // Small, Medium, Large
    price: Number,
    isDefault: Boolean
  }],
  
  customizations: [{
    name: String, // Extra Cheese, Spice Level, etc.
    type: {
      type: String,
      enum: ['single', 'multiple'], // single choice or multiple choice
      default: 'single'
    },
    required: {
      type: Boolean,
      default: false
    },
    options: [{
      name: String,
      price: Number // additional price
    }]
  }],
  
  // Dietary Information
  dietary: {
    isVegetarian: { type: Boolean, default: false },
    isVegan: { type: Boolean, default: false },
    isGlutenFree: { type: Boolean, default: false },
    isHalal: { type: Boolean, default: false },
    isKeto: { type: Boolean, default: false },
    isSpicy: { type: Boolean, default: false }
  },
  
  spiceLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  // Nutritional Information
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sodium: Number
  },
  
  // Ingredients & Allergens
  ingredients: [String],
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'eggs', 'soy', 'wheat', 'shellfish', 'fish']
  }],
  
  // Availability & Status
  isAvailable: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  
  // Time-based availability
  availableHours: {
    start: String,
    end: String
  },
  
  // Preparation
  preparationTime: {
    type: Number,
    default: 15 // in minutes
  },
  
  // Ratings & Reviews
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  
  // Tags for search and filtering
  tags: [String], // chef-special, healthy, comfort-food, etc.
  
  // Sales data
  orderCount: {
    type: Number,
    default: 0
  },
  
  // Combo/Bundle information
  isCombo: {
    type: Boolean,
    default: false
  },
  comboItems: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem'
    },
    quantity: Number
  }],
  
  // Seasonal availability
  seasonal: {
    isActive: { type: Boolean, default: false },
    startDate: Date,
    endDate: Date
  }
}, {
  timestamps: true
});

// Index for search
menuItemSchema.index({ 
  name: 'text', 
  description: 'text', 
  tags: 'text',
  ingredients: 'text'
});

// Index for filtering
menuItemSchema.index({ restaurant: 1, category: 1, isAvailable: 1 });
menuItemSchema.index({ restaurant: 1, 'dietary.isVegetarian': 1 });
menuItemSchema.index({ restaurant: 1, 'dietary.isVegan': 1 });

// Virtual for discounted price
menuItemSchema.virtual('discountedPrice').get(function() {
  return this.originalPrice ? this.price : null;
});

// Virtual for discount percentage
menuItemSchema.virtual('discountPercentage').get(function() {
  if (!this.originalPrice) return 0;
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
});

module.exports = mongoose.model('MenuItem', menuItemSchema);