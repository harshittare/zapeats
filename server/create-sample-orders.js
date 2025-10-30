const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/zapeats')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

async function createSampleOrders() {
  try {
    // Get existing data
    const users = await User.find({});
    const restaurants = await Restaurant.find({});
    const menuItems = await MenuItem.find({});

    if (users.length === 0 || restaurants.length === 0 || menuItems.length === 0) {
      console.log('❌ Need users, restaurants, and menu items to create orders');
      return;
    }

    const user = users[0];
    const restaurant = restaurants[0];
    const menuItem = menuItems[0];

    console.log(`👤 Using user: ${user.name}`);
    console.log(`🏪 Using restaurant: ${restaurant.name}`);
    console.log(`🍕 Using menu item: ${menuItem.name}`);

    // Create sample orders
    const sampleOrders = [
      {
        user: user._id,
        restaurant: restaurant._id,
        items: [
          {
            menuItem: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 2,
            customizations: [],
            itemTotal: menuItem.price * 2
          }
        ],
        subtotal: menuItem.price * 2,
        deliveryFee: restaurant.deliveryFee,
        serviceFee: (menuItem.price * 2) * 0.05, // 5% service fee
        tax: (menuItem.price * 2) * 0.08, // 8% tax
        totalAmount: (menuItem.price * 2) + restaurant.deliveryFee + ((menuItem.price * 2) * 0.05) + ((menuItem.price * 2) * 0.08),
        status: 'delivered',
        paymentMethod: 'card',
        deliveryAddress: {
          street: '123 Test Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          coordinates: {
            latitude: 19.0760,
            longitude: 72.8777
          }
        },
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        placedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            note: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 110 * 60 * 1000),
            note: 'Order confirmed by restaurant'
          },
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 100 * 60 * 1000),
            note: 'Food preparation started'
          },
          {
            status: 'ready',
            timestamp: new Date(Date.now() - 70 * 60 * 1000),
            note: 'Order ready for pickup'
          },
          {
            status: 'picked-up',
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            note: 'Order picked up by delivery partner'
          },
          {
            status: 'out-for-delivery',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            note: 'Out for delivery'
          },
          {
            status: 'delivered',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            note: 'Order delivered successfully'
          }
        ]
      },
      {
        user: user._id,
        restaurant: restaurants[1] || restaurant, // Use second restaurant if available
        items: [
          {
            menuItem: menuItems[1] ? menuItems[1]._id : menuItem._id,
            name: menuItems[1] ? menuItems[1].name : menuItem.name,
            price: menuItems[1] ? menuItems[1].price : menuItem.price,
            quantity: 1,
            customizations: [],
            itemTotal: menuItems[1] ? menuItems[1].price : menuItem.price
          }
        ],
        subtotal: menuItems[1] ? menuItems[1].price : menuItem.price,
        deliveryFee: (restaurants[1] || restaurant).deliveryFee,
        serviceFee: (menuItems[1] ? menuItems[1].price : menuItem.price) * 0.05,
        tax: (menuItems[1] ? menuItems[1].price : menuItem.price) * 0.08,
        totalAmount: (menuItems[1] ? menuItems[1].price : menuItem.price) + 
                    (restaurants[1] || restaurant).deliveryFee + 
                    ((menuItems[1] ? menuItems[1].price : menuItem.price) * 0.05) + 
                    ((menuItems[1] ? menuItems[1].price : menuItem.price) * 0.08),
        status: 'preparing',
        paymentMethod: 'cash',
        deliveryAddress: {
          street: '456 Another Street',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001',
          coordinates: {
            latitude: 28.7041,
            longitude: 77.1025
          }
        },
        estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        placedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            note: 'Order placed successfully'
          },
          {
            status: 'confirmed',
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            note: 'Order confirmed by restaurant'
          },
          {
            status: 'preparing',
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            note: 'Food preparation in progress'
          }
        ]
      },
      {
        user: user._id,
        restaurant: restaurant,
        items: [
          {
            menuItem: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
            customizations: [],
            itemTotal: menuItem.price
          }
        ],
        subtotal: menuItem.price,
        deliveryFee: restaurant.deliveryFee,
        serviceFee: menuItem.price * 0.05,
        tax: menuItem.price * 0.08,
        totalAmount: menuItem.price + restaurant.deliveryFee + (menuItem.price * 0.05) + (menuItem.price * 0.08),
        status: 'cancelled',
        paymentMethod: 'card',
        deliveryAddress: {
          street: '789 Test Avenue',
          city: 'Bangalore',
          state: 'Karnataka',
          zipCode: '560001',
          coordinates: {
            latitude: 12.9716,
            longitude: 77.5946
          }
        },
        estimatedDeliveryTime: new Date(Date.now() - 60 * 60 * 1000),
        placedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        statusHistory: [
          {
            status: 'pending',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            note: 'Order placed successfully'
          },
          {
            status: 'cancelled',
            timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
            note: 'Order cancelled by customer'
          }
        ]
      }
    ];

    // Create orders
    for (const orderData of sampleOrders) {
      const order = new Order(orderData);
      await order.save();
      console.log(`✅ Created order: ${order._id} (${order.status})`);
    }

    console.log(`🎉 Created ${sampleOrders.length} sample orders successfully!`);

  } catch (error) {
    console.error('❌ Error creating sample orders:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSampleOrders();