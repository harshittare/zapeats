const request = require('supertest');
const mongoose = require('mongoose');
const { createApp } = require('../app');
const { connectTestDB, closeTestDB } = require('./testDb');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

describe('Orders API', () => {
  let app;
  let userToken;
  let userId;
  let restaurantId;
  let menuItemId;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    // Clear collections and drop to avoid unique constraints in tests
    await User.collection.drop().catch(() => {});
    await Restaurant.collection.drop().catch(() => {});
    await MenuItem.collection.drop().catch(() => {});
    await Order.collection.drop().catch(() => {});

    // Create test user
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    });
    await user.save();
    userId = user._id;

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        identifier: 'test@example.com',
        password: '123456'
      });
    userToken = loginResponse.body.token;

    // Create test restaurant
    const restaurant = new Restaurant({
      name: 'Test Restaurant',
      description: 'Test description',
      logo: 'https://example.com/logo.png',
      cuisines: ['Italian'],
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        coordinates: { latitude: 40.7589, longitude: -73.9851 }
      },
      phone: '+1234567890',
      email: 'test@restaurant.com'
    });
    await restaurant.save();
    restaurantId = restaurant._id;

    // Create test menu item
    const menuItem = new MenuItem({
      restaurant: restaurantId,
      name: 'Test Pizza',
      description: 'Delicious test pizza',
      price: 15.99,
      category: 'main-course',
      dietary: {
        isVegetarian: true,
        isVegan: false
      },
      preparationTime: 20
    });
    await menuItem.save();
    menuItemId = menuItem._id;
  });

  describe('POST /api/orders', () => {
    it('should create order successfully', async () => {
      const orderData = {
        restaurantId: restaurantId.toString(),
        items: [
          {
            menuItemId: menuItemId.toString(),
            quantity: 2,
            price: 15.99,
            customizations: [],
            specialInstructions: 'Extra cheese'
          }
        ],
        deliveryAddress: {
          street: '456 Delivery St',
          city: 'Delivery City', 
          state: 'DC',
          zipCode: '54321',
          coordinates: { latitude: 40.7505, longitude: -73.9934 }
        },
        paymentMethod: 'cash',
        specialInstructions: 'Ring doorbell',
        contactlessDelivery: false
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.order.restaurant._id).toBe(restaurantId.toString());
      expect(response.body.order.user).toBe(userId.toString());
      expect(response.body.order.items).toHaveLength(1);
      expect(response.body.order.items[0].quantity).toBe(2);
      expect(response.body.order.status).toBe('pending');
      expect(response.body.order.paymentMethod).toBe('cash');
    });

    it('should fail without authentication', async () => {
      const orderData = {
        restaurantId: restaurantId.toString(),
        items: [
          {
            menuItemId: menuItemId.toString(),
            quantity: 1,
            price: 15.99
          }
        ],
        deliveryAddress: {
          street: '456 Delivery St',
          city: 'Delivery City',
          state: 'DC', 
          zipCode: '54321'
        },
        paymentMethod: 'cash'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid restaurant ID', async () => {
      const orderData = {
        restaurantId: new mongoose.Types.ObjectId().toString(),
        items: [
          {
            menuItemId: menuItemId.toString(),
            quantity: 1,
            price: 15.99
          }
        ],
        deliveryAddress: {
          street: '456 Delivery St',
          city: 'Delivery City',
          state: 'DC',
          zipCode: '54321'
        },
        paymentMethod: 'cash'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Restaurant not found');
    });

    it('should fail with invalid menu item ID', async () => {
      const orderData = {
        restaurantId: restaurantId.toString(),
        items: [
          {
            menuItemId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
            price: 15.99
          }
        ],
        deliveryAddress: {
          street: '456 Delivery St',
          city: 'Delivery City',
          state: 'DC',
          zipCode: '54321'
        },
        paymentMethod: 'cash'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid menu item');
    });
  });

  describe('GET /api/orders', () => {
    beforeEach(async () => {
      // Create test orders
      const order1 = new Order({
        user: userId,
        restaurant: restaurantId,
        items: [
          {
            menuItem: menuItemId,
            quantity: 1,
            price: 15.99,
            itemTotal: 15.99
          }
        ],
        subtotal: 15.99,
        deliveryFee: 2.99,
        taxes: 1.28,
        totalAmount: 20.26,
        deliveryAddress: {
          street: '456 Delivery St',
          city: 'Delivery City',
          state: 'DC',
          zipCode: '54321'
        },
        paymentMethod: 'cash',
        status: 'delivered'
      });
      await order1.save();

      const order2 = new Order({
        user: userId,
        restaurant: restaurantId,
        items: [
          {
            menuItem: menuItemId,
            quantity: 2,
            price: 15.99,
            itemTotal: 31.98
          }
        ],
        subtotal: 31.98,
        deliveryFee: 2.99,
        taxes: 2.80,
        totalAmount: 37.77,
        deliveryAddress: {
          street: '456 Delivery St',
          city: 'Delivery City',
          state: 'DC',
          zipCode: '54321'
        },
        paymentMethod: 'card',
        status: 'preparing'
      });
      await order2.save();
    });

    it('should get user orders successfully', async () => {
      const response = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.orders).toHaveLength(2);
      expect(response.body.orders[0].user).toBe(userId.toString());
      expect(response.body.orders[0].status).toBe('preparing'); // Most recent first
    });

    it('should filter orders by status', async () => {
      const response = await request(app)
        .get('/api/orders?status=delivered')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.orders).toHaveLength(1);
      expect(response.body.orders[0].status).toBe('delivered');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});