const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all restaurants with filters
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      cuisine,
      priceRange,
      rating,
      features,
      search,
      sortBy = 'rating',
      latitude,
      longitude,
      radius = 10
    } = req.query;

    const skip = (page - 1) * limit;
    let query = { isActive: true };

    // Apply filters
    if (cuisine) {
      query.cuisines = { $in: cuisine.split(',') };
    }

    if (priceRange) {
      query.priceRange = { $in: priceRange.split(',') };
    }

    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    if (features) {
      query.features = { $in: features.split(',') };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Geospatial query if coordinates provided
    if (latitude && longitude) {
      query['address.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      };
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'rating':
        sortOptions = { 'rating.average': -1 };
        break;
      case 'deliveryTime':
        sortOptions = { 'deliveryTime.min': 1 };
        break;
      case 'priceRange':
        sortOptions = { priceRange: 1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { 'rating.average': -1 };
    }

    const restaurants = await Restaurant.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('currentOffers');

    const total = await Restaurant.countDocuments(query);

    res.json({
      success: true,
      data: {
        restaurants,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalRestaurants: total,
        hasNextPage: skip + restaurants.length < total
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurants'
    });
  }
});

// Get featured restaurants
router.get('/featured', async (req, res) => {
  try {
    const featuredRestaurants = await Restaurant.find({
      isActive: true,
      isFeatured: true
    })
    .sort({ 'rating.average': -1 })
    .limit(6);

    res.json({
      success: true,
      data: featuredRestaurants
    });
  } catch (error) {
    console.error('Get featured restaurants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured restaurants'
    });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('currentOffers');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching restaurant'
    });
  }
});

// Get restaurant menu
router.get('/:id/menu', async (req, res) => {
  try {
    const { category, dietary, search } = req.query;
    let query = {
      restaurant: req.params.id,
      isAvailable: true
    };

    if (category) {
      query.category = category;
    }

    if (dietary) {
      const dietaryFilters = dietary.split(',');
      dietaryFilters.forEach(filter => {
        switch (filter) {
          case 'vegetarian':
            query['dietary.isVegetarian'] = true;
            break;
          case 'vegan':
            query['dietary.isVegan'] = true;
            break;
          case 'gluten-free':
            query['dietary.isGlutenFree'] = true;
            break;
          case 'halal':
            query['dietary.isHalal'] = true;
            break;
        }
      });
    }

    if (search) {
      query.$text = { $search: search };
    }

    const menuItems = await MenuItem.find(query)
      .sort({ category: 1, name: 1 })
      .populate('restaurant', 'name');

    // Group by category
    const groupedMenu = menuItems.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedMenu
    });
  } catch (error) {
    console.error('Get menu error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching menu'
    });
  }
});

// Add restaurant to favorites (requires auth)
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);
    
    if (!user.favoriteRestaurants.includes(req.params.id)) {
      user.favoriteRestaurants.push(req.params.id);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Restaurant added to favorites'
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites'
    });
  }
});

// Remove restaurant from favorites (requires auth)
router.delete('/:id/favorite', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.userId);
    
    user.favoriteRestaurants = user.favoriteRestaurants.filter(
      id => id.toString() !== req.params.id
    );
    await user.save();

    res.json({
      success: true,
      message: 'Restaurant removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites'
    });
  }
});

// Get restaurant reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const Order = require('../models/Order');
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Order.find({
      restaurant: req.params.id,
      'review.comment': { $exists: true, $ne: '' }
    })
    .populate('user', 'name avatar')
    .select('rating review createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Order.countDocuments({
      restaurant: req.params.id,
      'review.comment': { $exists: true, $ne: '' }
    });

    res.json({
      success: true,
      data: {
        reviews,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

module.exports = router;