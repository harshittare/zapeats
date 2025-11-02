const request = require('supertest');
const { createApp } = require('../app');
const { connectTestDB, closeTestDB } = require('./testDb');
const User = require('../models/User');

describe('Authentication API', () => {
  let app;

  beforeAll(async () => {
    await connectTestDB();
    app = createApp();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  beforeEach(async () => {
    // Clear users before each test and drop indexes to avoid unique constraints in tests
    await User.collection.drop().catch(() => {}); // Ignore error if collection doesn't exist
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.name).toBe('Test User');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.role).toBe('user');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.password).toBeUndefined();
    });

    it('should register admin user with admin email', async () => {
      const adminData = {
        name: 'Admin User',
        email: 'admin@zapeats.com',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(adminData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe('user'); // Should still be user unless manually set to admin
    });

    it('should fail with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail with short password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should fail with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      });
      await user.save();

      // Create admin user
      const admin = new User({
        name: 'Admin User',
        email: 'admin@zapeats.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();
    });

    it('should login successfully with email', async () => {
      const loginData = {
        identifier: 'test@example.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.role).toBe('user');
      expect(response.body.token).toBeDefined();
    });

    it('should login admin successfully', async () => {
      const loginData = {
        identifier: 'admin@zapeats.com',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('admin@zapeats.com');
      expect(response.body.user.role).toBe('admin');
      expect(response.body.token).toBeDefined();
    });

    it('should fail with wrong password', async () => {
      const loginData = {
        identifier: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should fail with non-existent user', async () => {
      const loginData = {
        identifier: 'nonexistent@example.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let userToken;
    let adminToken;

    beforeEach(async () => {
      // Create and login test user
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      });
      await user.save();

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'test@example.com',
          password: '123456'
        });
      userToken = loginResponse.body.token;

      // Create and login admin user
      const admin = new User({
        name: 'Admin User',
        email: 'admin@zapeats.com',
        password: 'admin123',
        role: 'admin'
      });
      await admin.save();

      const adminLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'admin@zapeats.com',
          password: 'admin123'
        });
      adminToken = adminLoginResponse.body.token;
    });

    it('should get user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.role).toBe('user');
      expect(response.body.user.password).toBeUndefined();
    });

    it('should get admin info with admin token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe('admin@zapeats.com');
      expect(response.body.user.role).toBe('admin');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});