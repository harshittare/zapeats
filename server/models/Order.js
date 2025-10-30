const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  
  // Order Items
  items: [{
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuItem',
      required: true
    },
    name: String, // Store name at time of order
    price: Number, // Store price at time of order
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    variant: String, // Selected variant (Small, Medium, Large)
    customizations: [{
      name: String,
      options: [String],
      additionalPrice: Number
    }],
    itemTotal: Number
  }],
  
  // Pricing
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  serviceFee: {
    type: Number,
    default: 0
  },
  taxes: {
    gst: Number,
    deliveryTax: Number
  },
  discount: {
    amount: { type: Number, default: 0 },
    type: String, // 'percentage', 'fixed', 'loyalty-points'
    couponCode: String,
    description: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  
  // Delivery Information
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    landmark: String,
    contactPerson: String,
    contactPhone: String
  },
  
  // Order Status & Tracking
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'preparing',
      'ready',
      'picked-up',
      'out-for-delivery',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  // Timing
  estimatedDeliveryTime: Date,
  actualDeliveryTime: Date,
  preparationTime: Number, // in minutes
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'wallet', 'upi'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  
  // Delivery Information
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryPartner'
  },
  deliveryInstructions: String,
  
  // Special Requests
  specialInstructions: String,
  contactlessDelivery: {
    type: Boolean,
    default: false
  },
  
  // Ratings & Reviews
  rating: {
    food: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 }
  },
  review: {
    comment: String,
    images: [String],
    createdAt: Date
  },
  
  // Cancellation
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['user', 'restaurant', 'admin', 'system']
  },
  refundAmount: Number,
  refundStatus: {
    type: String,
    enum: ['none', 'pending', 'processed', 'completed']
  },
  
  // Loyalty & Gamification
  loyaltyPointsEarned: {
    type: Number,
    default: 0
  },
  loyaltyPointsUsed: {
    type: Number,
    default: 0
  },
  
  // Notifications
  notifications: {
    orderConfirmed: { sent: Boolean, sentAt: Date },
    preparing: { sent: Boolean, sentAt: Date },
    outForDelivery: { sent: Boolean, sentAt: Date },
    delivered: { sent: Boolean, sentAt: Date }
  },
  
  // Reorder functionality
  isReorder: {
    type: Boolean,
    default: false
  },
  originalOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ restaurant: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ deliveryPartner: 1 });
orderSchema.index({ "deliveryAddress.coordinates": "2dsphere" });

// Virtual for delivery time estimate
orderSchema.virtual('estimatedDeliveryDuration').get(function() {
  if (!this.estimatedDeliveryTime) return null;
  const now = new Date();
  const diff = this.estimatedDeliveryTime.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60))); // in minutes
});

// Method to calculate total with all fees
orderSchema.methods.calculateTotal = function() {
  let total = this.subtotal;
  total += this.deliveryFee;
  total += this.serviceFee;
  total += (this.taxes.gst || 0);
  total += (this.taxes.deliveryTax || 0);
  total -= this.discount.amount;
  return Math.max(0, total);
};

// Method to update status with history
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note
  });
  
  if (newStatus === 'delivered') {
    this.actualDeliveryTime = new Date();
  }
};

module.exports = mongoose.model('Order', orderSchema);