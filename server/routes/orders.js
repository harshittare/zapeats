const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.userId;

    let query = { user: userId };
    if (status && status !== 'all') {
      if (status === 'active') {
        query.status = { $in: ['pending', 'confirmed', 'preparing', 'ready', 'picked-up', 'out-for-delivery'] };
      } else if (status === 'completed') {
        query.status = 'delivered';
      } else if (status === 'cancelled') {
        query.status = { $in: ['cancelled', 'refunded'] };
      } else {
        query.status = status;
      }
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name image cuisine rating')
      .populate('items.menuItem', 'name image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
});

// Get single order by ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, user: userId })
      .populate('restaurant', 'name image cuisine rating address phone')
      .populate('items.menuItem', 'name image description')
      .populate('deliveryPartner', 'name phone rating');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details'
    });
  }
});

// Create new order
router.post('/', [
  auth,
  body('restaurantId').isMongoId().withMessage('Valid restaurant ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.menuItemId').isMongoId().withMessage('Valid menu item ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress').isObject().withMessage('Delivery address is required'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Zip code is required'),
  body('paymentMethod').isIn(['card', 'cash', 'wallet', 'upi', 'gpay']).withMessage('Valid payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const userId = req.user.userId;
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      contactlessDelivery,
      couponCode
    } = req.body;

    // Verify restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Verify and calculate order items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || menuItem.restaurant.toString() !== restaurantId) {
        return res.status(400).json({
          success: false,
          message: `Invalid menu item: ${item.menuItemId}`
        });
      }

      const itemPrice = menuItem.price;
      const itemTotal = itemPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: itemPrice,
        quantity: item.quantity,
        variant: item.variant || '',
        customizations: item.customizations || [],
        itemTotal
      });
    }

    // Calculate fees and taxes
    const deliveryFee = 2.99;
    const serviceFee = subtotal * 0.05; // 5% service fee
    const gst = subtotal * 0.18; // 18% GST
    const deliveryTax = deliveryFee * 0.18;

    // Apply discount if coupon code provided
    let discount = { amount: 0, type: 'none' };
    if (couponCode) {
      // Simple coupon logic (in production, use a proper coupon system)
      if (couponCode === 'WELCOME10' && subtotal >= 20) {
        discount = {
          amount: subtotal * 0.1, // 10% off
          type: 'percentage',
          couponCode,
          description: '10% off on orders above $20'
        };
      } else if (couponCode === 'SAVE5' && subtotal >= 15) {
        discount = {
          amount: 5,
          type: 'fixed',
          couponCode,
          description: '$5 off on orders above $15'
        };
      }
    }

    const totalAmount = subtotal + deliveryFee + serviceFee + gst + deliveryTax - discount.amount;

    // Create order
    const order = new Order({
      user: userId,
      restaurant: restaurantId,
      items: orderItems,
      subtotal,
      deliveryFee,
      serviceFee,
      taxes: { gst, deliveryTax },
      discount,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      contactlessDelivery: contactlessDelivery || false,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      loyaltyPointsEarned: Math.floor(totalAmount * 0.1) // 10% in loyalty points
    });

    // Initialize status history
    order.updateStatus('pending', 'Order placed successfully');

    await order.save();

    // Update user loyalty points
    await User.findByIdAndUpdate(userId, {
      $inc: { loyaltyPoints: order.loyaltyPointsEarned }
    });

    // Populate order for response
    await order.populate('restaurant', 'name image cuisine');
    await order.populate('items.menuItem', 'name image');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// Update order status (for restaurants/admin)
router.patch('/:orderId/status', [
  auth,
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'picked-up', 'out-for-delivery', 'delivered', 'cancelled'])
    .withMessage('Valid status is required'),
  body('note').optional().isString()
], async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.updateStatus(status, note || '');
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
});

// Cancel order
router.patch('/:orderId/cancel', [
  auth,
  body('reason').notEmpty().withMessage('Cancellation reason is required')
], async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }

    order.updateStatus('cancelled', reason);
    order.cancellationReason = reason;
    order.cancelledBy = 'user';

    // Process refund if payment was completed
    if (order.paymentStatus === 'completed') {
      order.refundAmount = order.totalAmount;
      order.refundStatus = 'pending';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
});

// Add rating and review
router.post('/:orderId/review', [
  auth,
  body('rating.overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5'),
  body('rating.food').optional().isInt({ min: 1, max: 5 }),
  body('rating.delivery').optional().isInt({ min: 1, max: 5 }),
  body('review.comment').optional().isString()
], async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;
    const userId = req.user.userId;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered to add review'
      });
    }

    order.rating = rating;
    if (review && review.comment) {
      order.review = {
        comment: review.comment,
        images: review.images || [],
        createdAt: new Date()
      };
    }

    await order.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      order
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add review'
    });
  }
});

// Reorder
router.post('/:orderId/reorder', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const originalOrder = await Order.findOne({ _id: orderId, user: userId })
      .populate('items.menuItem');

    if (!originalOrder) {
      return res.status(404).json({
        success: false,
        message: 'Original order not found'
      });
    }

    // Check if all items are still available
    const availableItems = [];
    for (const item of originalOrder.items) {
      if (item.menuItem && item.menuItem.isAvailable) {
        availableItems.push({
          menuItem: item.menuItem._id,
          name: item.menuItem.name,
          price: item.menuItem.price, // Use current price
          quantity: item.quantity,
          variant: item.variant,
          customizations: item.customizations,
          itemTotal: item.menuItem.price * item.quantity
        });
      }
    }

    if (availableItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items from the original order are currently available'
      });
    }

    // Calculate new totals with current prices
    const subtotal = availableItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const deliveryFee = 2.99;
    const serviceFee = subtotal * 0.05;
    const gst = subtotal * 0.18;
    const deliveryTax = deliveryFee * 0.18;
    const totalAmount = subtotal + deliveryFee + serviceFee + gst + deliveryTax;

    const newOrder = new Order({
      user: userId,
      restaurant: originalOrder.restaurant,
      items: availableItems,
      subtotal,
      deliveryFee,
      serviceFee,
      taxes: { gst, deliveryTax },
      discount: { amount: 0, type: 'none' },
      totalAmount,
      deliveryAddress: originalOrder.deliveryAddress,
      paymentMethod: originalOrder.paymentMethod,
      specialInstructions: originalOrder.specialInstructions,
      contactlessDelivery: originalOrder.contactlessDelivery,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
      loyaltyPointsEarned: Math.floor(totalAmount * 0.1),
      isReorder: true,
      originalOrder: originalOrder._id
    });

    newOrder.updateStatus('pending', 'Reorder placed successfully');
    await newOrder.save();

    // Update user loyalty points
    await User.findByIdAndUpdate(userId, {
      $inc: { loyaltyPoints: newOrder.loyaltyPointsEarned }
    });

    await newOrder.populate('restaurant', 'name image cuisine');
    await newOrder.populate('items.menuItem', 'name image');

    res.status(201).json({
      success: true,
      message: 'Reorder created successfully',
      order: newOrder,
      unavailableItems: originalOrder.items.length - availableItems.length
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reorder'
    });
  }
});

module.exports = router;