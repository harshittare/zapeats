const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zapeats');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Create restaurants
    const restaurants = [
      {
        name: 'Burger Palace',
        description: 'Gourmet burgers made with premium ingredients and served with love since 1995',
        logo: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
        images: [
          { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800', alt: 'Burger Palace Interior' },
          { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', alt: 'Burger Palace Food' }
        ],
        cuisines: ['American', 'Fast Food'],
        address: {
          street: '123 Burger Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          coordinates: { latitude: 40.7589, longitude: -73.9851 }
        },
        phone: '+1 (555) 123-4567',
        email: 'info@burgerpalace.com',
        rating: { average: 4.5, count: 1250 },
        priceRange: '$$',
        deliveryTime: { min: 25, max: 35 },
        deliveryFee: 2.99,
        minimumOrderAmount: 15,
        isOpen: true,
        operatingHours: {
          monday: { open: '11:00', close: '23:00' },
          tuesday: { open: '11:00', close: '23:00' },
          wednesday: { open: '11:00', close: '23:00' },
          thursday: { open: '11:00', close: '23:00' },
          friday: { open: '11:00', close: '23:30' },
          saturday: { open: '11:00', close: '23:30' },
          sunday: { open: '12:00', close: '22:00' }
        },
        features: ['vegetarian'],
        currentOffers: [
          {
            title: 'Buy 2 Get 1 Free',
            description: 'Buy any 2 burgers and get the 3rd one free',
            validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        name: 'Pizza Corner',
        description: 'Authentic Italian pizzas with fresh ingredients and traditional recipes',
        logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        images: [
          { url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800', alt: 'Pizza Corner Interior' },
          { url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800', alt: 'Fresh Pizza' }
        ],
        cuisines: ['Italian', 'Pizza'],
        address: {
          street: '456 Pizza St',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          coordinates: { latitude: 40.7614, longitude: -73.9776 }
        },
        phone: '+1 (555) 234-5678',
        email: 'orders@pizzacorner.com',
        rating: { average: 4.7, count: 987 },
        priceRange: '$$$',
        deliveryTime: { min: 30, max: 45 },
        deliveryFee: 3.49,
        minimumOrderAmount: 20,
        isOpen: true,
        operatingHours: {
          monday: { open: '16:00', close: '23:00' },
          tuesday: { open: '16:00', close: '23:00' },
          wednesday: { open: '16:00', close: '23:00' },
          thursday: { open: '16:00', close: '23:00' },
          friday: { open: '16:00', close: '24:00' },
          saturday: { open: '12:00', close: '24:00' },
          sunday: { open: '12:00', close: '22:00' }
        },
        features: ['vegetarian', 'vegan'],
        currentOffers: []
      },
      {
        name: 'Taco Fiesta',
        description: 'Fresh Mexican flavors with authentic spices and traditional cooking methods',
        logo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        images: [
          { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', alt: 'Taco Fiesta Interior' },
          { url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800', alt: 'Fresh Tacos' }
        ],
        cuisines: ['Mexican', 'Latin American'],
        address: {
          street: '789 Taco Blvd',
          city: 'New York',
          state: 'NY',
          zipCode: '10003',
          coordinates: { latitude: 40.7505, longitude: -73.9934 }
        },
        phone: '+1 (555) 345-6789',
        email: 'hola@tacofiesta.com',
        rating: { average: 4.3, count: 756 },
        priceRange: '$$',
        deliveryTime: { min: 20, max: 30 },
        deliveryFee: 2.49,
        minimumOrderAmount: 12,
        isOpen: true,
        operatingHours: {
          monday: { open: '11:00', close: '22:00' },
          tuesday: { open: '11:00', close: '22:00' },
          wednesday: { open: '11:00', close: '22:00' },
          thursday: { open: '11:00', close: '22:00' },
          friday: { open: '11:00', close: '23:00' },
          saturday: { open: '10:00', close: '23:00' },
          sunday: { open: '10:00', close: '21:00' }
        },
        features: ['vegetarian', 'gluten-free'],
        currentOffers: [
          {
            title: 'Taco Tuesday',
            description: '20% off on all tacos every Tuesday',
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        name: 'Sushi Zen',
        description: 'Premium sushi and Japanese cuisine crafted by master chefs',
        logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        images: [
          { url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', alt: 'Sushi Zen Interior' },
          { url: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800', alt: 'Fresh Sushi' }
        ],
        cuisines: ['Japanese', 'Sushi', 'Asian'],
        address: {
          street: '321 Zen Way',
          city: 'New York',
          state: 'NY',
          zipCode: '10004',
          coordinates: { latitude: 40.7648, longitude: -73.9808 }
        },
        phone: '+1 (555) 456-7890',
        email: 'info@sushizen.com',
        rating: { average: 4.8, count: 543 },
        priceRange: '$$$$',
        deliveryTime: { min: 35, max: 50 },
        deliveryFee: 4.99,
        minimumOrderAmount: 30,
        isOpen: true,
        operatingHours: {
          monday: { open: '17:00', close: '22:00' },
          tuesday: { open: '17:00', close: '22:00' },
          wednesday: { open: '17:00', close: '22:00' },
          thursday: { open: '17:00', close: '22:00' },
          friday: { open: '17:00', close: '23:00' },
          saturday: { open: '16:00', close: '23:00' },
          sunday: { open: '16:00', close: '21:00' }
        },
        features: ['organic'],
        currentOffers: []
      }
    ];

    const savedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`✅ Created ${savedRestaurants.length} restaurants`);

    // Create menu items for each restaurant
    const menuItems = [];

    // Burger Palace menu
    const burgerPalace = savedRestaurants.find(r => r.name === 'Burger Palace');
    menuItems.push(
      {
        restaurant: burgerPalace._id,
        name: 'Classic Beef Burger',
        description: 'Juicy beef patty with lettuce, tomato, onion, pickles, and our special sauce',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false
        },
        allergens: ['wheat', 'dairy'],
        spiceLevel: 1,
        nutrition: {
          calories: 650
        },
        customizations: [
          {
            name: 'Cheese',
            options: [
              { name: 'No Cheese', price: 0 },
              { name: 'American Cheese', price: 1.00 },
              { name: 'Swiss Cheese', price: 1.50 },
              { name: 'Cheddar Cheese', price: 1.00 }
            ]
          },
          {
            name: 'Add-ons',
            options: [
              { name: 'Bacon', price: 2.00 },
              { name: 'Avocado', price: 1.50 },
              { name: 'Extra Patty', price: 4.00 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 15
      },
      {
        restaurant: burgerPalace._id,
        name: 'Veggie Delight Burger',
        description: 'Plant-based patty with fresh vegetables and vegan mayo',
        price: 11.99,
        image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: true,
          isVegan: true,
          isGlutenFree: false
        },
        allergens: ['wheat'],
        spiceLevel: 1,
        cookingTime: 10,
        calories: 520,
        customizations: [
          {
            name: 'Add-ons',
            options: [
              { name: 'Avocado', price: 1.50 },
              { name: 'Mushrooms', price: 1.00 },
              { name: 'Extra Patty', price: 3.50 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 12
      },
      {
        restaurant: burgerPalace._id,
        name: 'French Fries',
        description: 'Crispy golden fries seasoned with sea salt',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
        category: 'appetizers',
        dietary: {
          isVegetarian: true,
          isVegan: true,
          isGlutenFree: false
        },
        allergens: [],
        spiceLevel: 1,
        cookingTime: 8,
        calories: 365,
        customizations: [
          {
            name: 'Size',
            options: [
              { name: 'Regular', price: 0 },
              { name: 'Large', price: 2.00 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 8
      }
    );

    // Pizza Corner menu
    const pizzaCorner = savedRestaurants.find(r => r.name === 'Pizza Corner');
    menuItems.push(
      {
        restaurant: pizzaCorner._id,
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false
        },
        allergens: ['wheat', 'dairy'],
        spiceLevel: 1,
        cookingTime: 18,
        calories: 800,
        customizations: [
          {
            name: 'Size',
            options: [
              { name: 'Personal (8")', price: -3.00 },
              { name: 'Medium (12")', price: 0 },
              { name: 'Large (16")', price: 5.00 }
            ]
          },
          {
            name: 'Extra Toppings',
            options: [
              { name: 'Pepperoni', price: 2.50 },
              { name: 'Mushrooms', price: 1.50 },
              { name: 'Bell Peppers', price: 1.50 },
              { name: 'Olives', price: 1.50 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 20
      },
      {
        restaurant: pizzaCorner._id,
        name: 'Pepperoni Supreme',
        description: 'Loaded with pepperoni, mozzarella cheese, and Italian herbs',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false
        },
        allergens: ['wheat', 'dairy'],
        spiceLevel: 2,
        cookingTime: 18,
        calories: 950,
        customizations: [
          {
            name: 'Size',
            options: [
              { name: 'Personal (8")', price: -3.00 },
              { name: 'Medium (12")', price: 0 },
              { name: 'Large (16")', price: 5.00 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 20
      }
    );

    // Taco Fiesta menu
    const tacoFiesta = savedRestaurants.find(r => r.name === 'Taco Fiesta');
    menuItems.push(
      {
        restaurant: tacoFiesta._id,
        name: 'Chicken Tacos',
        description: 'Three soft tacos with grilled chicken, lettuce, cheese, and salsa',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false
        },
        allergens: ['dairy'],
        spiceLevel: 2,
        cookingTime: 12,
        calories: 480,
        customizations: [
          {
            name: 'Spice Level',
            options: [
              { name: 'Mild', price: 0 },
              { name: 'Medium', price: 0 },
              { name: 'Hot', price: 0 },
              { name: 'Extra Hot', price: 0 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 12
      },
      {
        restaurant: tacoFiesta._id,
        name: 'Veggie Quesadilla',
        description: 'Grilled tortilla filled with cheese, peppers, onions, and mushrooms',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1599974624518-218c7d90fb02?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false
        },
        allergens: ['wheat', 'dairy'],
        spiceLevel: 1,
        cookingTime: 10,
        calories: 620,
        customizations: [
          {
            name: 'Add-ons',
            options: [
              { name: 'Guacamole', price: 1.50 },
              { name: 'Sour Cream', price: 1.00 },
              { name: 'Extra Cheese', price: 1.50 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 10
      }
    );

    // Sushi Zen menu
    const sushiZen = savedRestaurants.find(r => r.name === 'Sushi Zen');
    menuItems.push(
      {
        restaurant: sushiZen._id,
        name: 'Salmon Sashimi',
        description: 'Fresh Atlantic salmon, expertly sliced and served with wasabi and ginger',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: true
        },
        allergens: ['fish'],
        spiceLevel: 0,
        cookingTime: 5,
        calories: 250,
        customizations: [
          {
            name: 'Pieces',
            options: [
              { name: '6 pieces', price: 0 },
              { name: '9 pieces', price: 6.00 },
              { name: '12 pieces', price: 12.00 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 8
      },
      {
        restaurant: sushiZen._id,
        name: 'California Roll',
        description: 'Crab, avocado, and cucumber wrapped in seaweed and rice',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400',
        category: 'main-course',
        dietary: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false
        },
        allergens: ['shellfish', 'wheat'],
        spiceLevel: 0,
        cookingTime: 10,
        calories: 320,
        customizations: [
          {
            name: 'Style',
            options: [
              { name: 'Regular', price: 0 },
              { name: 'Inside-out', price: 1.00 }
            ]
          }
        ],
        isAvailable: true,
        preparationTime: 12
      }
    );

    const savedMenuItems = await MenuItem.insertMany(menuItems);
    console.log(`✅ Created ${savedMenuItems.length} menu items`);

    console.log('\n🎉 Database populated successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Restaurants: ${savedRestaurants.length}`);
    console.log(`   - Menu Items: ${savedMenuItems.length}`);
    console.log('\n🏪 Restaurants created:');
    savedRestaurants.forEach(restaurant => {
      console.log(`   - ${restaurant.name} (${restaurant.cuisines.join(', ')})`);
    });

  } catch (error) {
    console.error('❌ Error populating database:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

populateDatabase();