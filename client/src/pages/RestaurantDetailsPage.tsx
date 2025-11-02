import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Rating,
  Divider,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  IconButton,
  Paper
} from '@mui/material';
import {
  ArrowBack,
  Share,
  Favorite,
  FavoriteBorder,
  AccessTime,
  Add,
  Remove,
  ShoppingCart,
  LocalOffer,
  DeliveryDining
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Mock restaurants data - matching the ones from RestaurantsPage
const mockRestaurants = {
  '1': {
    id: '1',
    name: 'Burger Palace',
    description: 'Gourmet burgers made with premium ingredients and served with love since 1995',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
    images: [
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800',
      'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=800'
    ],
    rating: 4.5,
    reviewCount: 324,
    deliveryTime: '25-30 min',
    deliveryFee: 249,
    minimumOrder: 1249,
    priceRange: '$$',
    phone: '+91 98765 43210',
    address: '123 Food Street, Foodie District, Mumbai',
    cuisines: ['American', 'Fast Food'],
    features: ['vegetarian-options', 'outdoor-seating'],
    isOpen: true,
    openingHours: {
      monday: '11:00 AM - 10:00 PM',
      tuesday: '11:00 AM - 10:00 PM',
      wednesday: '11:00 AM - 10:00 PM',
      thursday: '11:00 AM - 10:00 PM',
      friday: '11:00 AM - 11:00 PM',
      saturday: '10:00 AM - 11:00 PM',
      sunday: '10:00 AM - 9:00 PM'
    },
    offers: ['20% OFF on first order', 'Free delivery on orders over ₹2490']
  },
  '2': {
    id: '2',
    name: 'Pizza Corner',
    description: 'Authentic Italian pizza with fresh toppings and traditional wood-fired oven',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800'
    ],
    rating: 4.3,
    reviewCount: 189,
    deliveryTime: '30-35 min',
    deliveryFee: 289,
    minimumOrder: 1660,
    priceRange: '$$',
    phone: '+91 98765 43211',
    address: '456 Italian Lane, Pizza District, Delhi',
    cuisines: ['Italian', 'Pizza'],
    features: ['vegetarian-options', 'vegan-options'],
    isOpen: true,
    openingHours: {
      monday: '12:00 PM - 11:00 PM',
      tuesday: '12:00 PM - 11:00 PM',
      wednesday: '12:00 PM - 11:00 PM',
      thursday: '12:00 PM - 11:00 PM',
      friday: '12:00 PM - 12:00 AM',
      saturday: '11:00 AM - 12:00 AM',
      sunday: '11:00 AM - 10:00 PM'
    },
    offers: ['Buy 1 Get 1 Free', 'Free delivery on orders over ₹1500']
  },
  '3': {
    id: '3',
    name: 'Sushi Zen',
    description: 'Fresh sushi and authentic Japanese cuisine prepared by expert chefs',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
    images: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800',
      'https://images.unsplash.com/photo-1559320672-b5b0b6d7b3d1?w=800'
    ],
    rating: 4.7,
    reviewCount: 256,
    deliveryTime: '20-25 min',
    deliveryFee: 0,
    minimumOrder: 2075,
    priceRange: '$$$',
    phone: '+91 98765 43212',
    address: '789 Sushi Street, Japanese Quarter, Bangalore',
    cuisines: ['Japanese', 'Sushi'],
    features: ['gluten-free'],
    isOpen: true,
    openingHours: {
      monday: '6:00 PM - 11:00 PM',
      tuesday: '6:00 PM - 11:00 PM',
      wednesday: '6:00 PM - 11:00 PM',
      thursday: '6:00 PM - 11:00 PM',
      friday: '6:00 PM - 12:00 AM',
      saturday: '5:00 PM - 12:00 AM',
      sunday: '5:00 PM - 10:00 PM'
    },
    offers: ['Free Delivery', '10% off on orders above ₹3000']
  },
  '4': {
    id: '4',
    name: 'Healthy Bowls',
    description: 'Nutritious bowls and salads for a healthy lifestyle with organic ingredients',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    images: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800'
    ],
    rating: 4.2,
    reviewCount: 98,
    deliveryTime: '15-20 min',
    deliveryFee: 207,
    minimumOrder: 996,
    priceRange: '$',
    phone: '+91 98765 43213',
    address: '321 Health Street, Organic District, Pune',
    cuisines: ['Healthy', 'Salads'],
    features: ['vegetarian-options', 'vegan-options', 'gluten-free'],
    isOpen: false,
    openingHours: {
      monday: '8:00 AM - 8:00 PM',
      tuesday: '8:00 AM - 8:00 PM',
      wednesday: '8:00 AM - 8:00 PM',
      thursday: '8:00 AM - 8:00 PM',
      friday: '8:00 AM - 9:00 PM',
      saturday: '9:00 AM - 9:00 PM',
      sunday: 'Closed'
    },
    offers: ['15% off on first healthy meal']
  }
};

// Mock menu data with restaurant-specific menus
const mockMenus = {
  '1': { // Burger Palace
    'starters': [
      {
        id: 'st1',
        name: 'Classic Wings',
        description: 'Crispy chicken wings tossed in your choice of sauce',
        price: 1079,
        image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=300',
        isPopular: true,
        isVegetarian: false,
        spiceLevel: 2,
        customizations: [
          {
            name: 'Sauce',
            type: 'single',
            required: true,
            options: [
              { name: 'Buffalo', price: 0 },
              { name: 'BBQ', price: 0 },
              { name: 'Honey Garlic', price: 0 },
              { name: 'Extra Hot', price: 83 }
            ]
          },
          {
            name: 'Size',
            type: 'single',
            required: true,
            options: [
              { name: '6 pieces', price: 0 },
              { name: '12 pieces', price: 664 },
              { name: '18 pieces', price: 1245 }
            ]
          }
        ]
      }
    ],
    'burgers': [
      {
        id: 'bg1',
        name: 'The Palace Burger',
        description: 'Our signature burger with double beef patty, special sauce, lettuce, tomato, and cheese',
        price: 1410,
        originalPrice: 1659,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
        isPopular: true,
        isVegetarian: false,
        spiceLevel: 1,
        customizations: [
          {
            name: 'Cook Level',
            type: 'single',
            required: true,
            options: [
              { name: 'Medium Rare', price: 0 },
              { name: 'Medium', price: 0 },
              { name: 'Well Done', price: 0 }
            ]
          },
          {
            name: 'Extras',
            type: 'multiple',
            required: false,
            options: [
              { name: 'Extra Cheese', price: 125 },
              { name: 'Bacon', price: 208 },
              { name: 'Avocado', price: 166 },
              { name: 'Extra Patty', price: 415 }
            ]
          }
        ]
      },
      {
        id: 'bg2',
        name: 'Veggie Delight',
        description: 'Plant-based patty with fresh vegetables and special vegan sauce',
        price: 1244,
        image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=300',
        isPopular: false,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: [
          {
            name: 'Patty Type',
            type: 'single',
            required: true,
            options: [
              { name: 'Beyond Meat', price: 0 },
              { name: 'Black Bean', price: -166 },
              { name: 'Quinoa', price: -83 }
            ]
          }
        ]
      }
    ],
    'sides': [
      {
        id: 'sd1',
        name: 'Truffle Fries',
        description: 'Golden fries topped with truffle oil and parmesan',
        price: 746,
        image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300',
        isPopular: true,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: []
      }
    ],
    'beverages': [
      {
        id: 'bv1',
        name: 'Craft Milkshake',
        description: 'Thick and creamy milkshake made with premium ice cream',
        price: 580,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=300',
        isPopular: false,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: [
          {
            name: 'Flavor',
            type: 'single',
            required: true,
            options: [
              { name: 'Vanilla', price: 0 },
              { name: 'Chocolate', price: 0 },
              { name: 'Strawberry', price: 0 },
              { name: 'Cookies & Cream', price: 83 }
            ]
          }
        ]
      }
    ]
  },
  '2': { // Pizza Corner
    'starters': [
      {
        id: 'st2',
        name: 'Garlic Bread',
        description: 'Fresh baked bread with garlic butter and herbs',
        price: 415,
        image: 'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=300',
        isPopular: true,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: []
      }
    ],
    'pizzas': [
      {
        id: 'pz1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
        price: 1244,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300',
        isPopular: true,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: [
          {
            name: 'Size',
            type: 'single',
            required: true,
            options: [
              { name: 'Regular (8")', price: 0 },
              { name: 'Medium (10")', price: 332 },
              { name: 'Large (12")', price: 664 }
            ]
          }
        ]
      }
    ],
    'beverages': [
      {
        id: 'bv2',
        name: 'Italian Soda',
        description: 'Refreshing flavored soda with a hint of Italy',
        price: 332,
        image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
        isPopular: false,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: []
      }
    ]
  },
  '3': { // Sushi Zen
    'sushi': [
      {
        id: 'su1',
        name: 'California Roll',
        description: 'Classic roll with crab, avocado, and cucumber',
        price: 1493,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300',
        isPopular: true,
        isVegetarian: false,
        spiceLevel: 0,
        customizations: []
      }
    ],
    'mains': [
      {
        id: 'mn1',
        name: 'Teriyaki Salmon',
        description: 'Grilled salmon with teriyaki glaze and steamed rice',
        price: 2489,
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300',
        isPopular: true,
        isVegetarian: false,
        spiceLevel: 0,
        customizations: []
      }
    ],
    'beverages': [
      {
        id: 'bv3',
        name: 'Green Tea',
        description: 'Traditional Japanese green tea',
        price: 249,
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=300',
        isPopular: false,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: []
      }
    ]
  },
  '4': { // Healthy Bowls
    'bowls': [
      {
        id: 'bw1',
        name: 'Quinoa Power Bowl',
        description: 'Nutritious bowl with quinoa, fresh vegetables, and tahini dressing',
        price: 996,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300',
        isPopular: true,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: []
      }
    ],
    'salads': [
      {
        id: 'sl1',
        name: 'Mediterranean Salad',
        description: 'Fresh greens with olives, feta cheese, and olive oil dressing',
        price: 830,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300',
        isPopular: true,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: []
      }
    ],
    'beverages': [
      {
        id: 'bv4',
        name: 'Fresh Juice',
        description: 'Freshly squeezed seasonal fruit juice',
        price: 415,
        image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300',
        isPopular: false,
        isVegetarian: true,
        spiceLevel: 0,
        customizations: []
      }
    ]
  }
};

const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // Get restaurant data based on ID
  const restaurant = mockRestaurants[id as keyof typeof mockRestaurants];
  const menuData = mockMenus[id as keyof typeof mockMenus];
  
  // Get available menu categories for this restaurant
  const menuCategories = menuData ? Object.keys(menuData) : [];
  const [activeTab, setActiveTab] = useState(menuCategories[0] || 'starters');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [customizations, setCustomizations] = useState<any>({});
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Redirect if restaurant not found
  useEffect(() => {
    if (!restaurant) {
      navigate('/restaurants');
    }
  }, [restaurant, navigate]);

  if (!restaurant) {
    return null; // Or a loading spinner
  }

  const handleAddToCart = () => {
    if (!selectedItem) return;

    const selectedCustomizations: any[] = [];

    // Calculate customization prices
    selectedItem.customizations?.forEach((customization: any) => {
      const selectedOptions = customizations[customization.name];
      if (selectedOptions) {
        if (customization.type === 'single') {
          const option = customization.options.find((opt: any) => opt.name === selectedOptions);
          if (option) {
            selectedCustomizations.push({
              name: customization.name,
              options: [option.name],
              additionalPrice: option.price
            });
          }
        } else {
          const additionalPrice = selectedOptions.reduce((sum: number, optionName: string) => {
            const option = customization.options.find((opt: any) => opt.name === optionName);
            return sum + (option ? option.price : 0);
          }, 0);
          selectedCustomizations.push({
            name: customization.name,
            options: selectedOptions,
            additionalPrice
          });
        }
      }
    });

    const cartItem = {
      id: `${selectedItem.id}-${Date.now()}`,
      menuItemId: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity,
      image: selectedItem.image,
      restaurant: {
        id: restaurant?.id,
        name: restaurant?.name
      },
      customizations: selectedCustomizations.length > 0 ? selectedCustomizations : undefined
    };

    addItem(cartItem);
    toast.success(`${selectedItem.name} added to cart!`);
    setSelectedItem(null);
    setCustomizations({});
    setQuantity(1);
    setSpecialInstructions('');
  };

  const isCustomizationComplete = () => {
    if (!selectedItem?.customizations) return true;
    
    return selectedItem.customizations.every((customization: any) => {
      if (!customization.required) return true;
      return customizations[customization.name];
    });
  };

  const MenuItemCard = ({ item }: { item: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        sx={{
          mb: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': { boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }
        }}
        onClick={() => setSelectedItem(item)}
      >
        <Grid container>
          <Grid item xs={8}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h6" fontWeight="bold">
                  {item.name}
                </Typography>
                {item.isPopular && (
                  <Chip
                    label="Popular"
                    color="primary"
                    size="small"
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
                {item.isVegetarian && (
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      border: '2px solid green',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: 'green',
                        borderRadius: '50%'
                      }}
                    />
                  </Box>
                )}
              </Box>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {item.description}
              </Typography>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  {item.originalPrice && (
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                    >
                      ₹{item.originalPrice}
                    </Typography>
                  )}
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ₹{item.price}
                  </Typography>
                </Box>
                
                {item.spiceLevel > 0 && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {Array.from({ length: item.spiceLevel }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 6,
                          height: 6,
                          backgroundColor: 'orange',
                          borderRadius: '50%'
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Grid>
          <Grid item xs={4}>
            <Box position="relative" height="100%">
              <CardMedia
                component="img"
                image={item.image}
                alt={item.name}
                sx={{
                  height: '100%',
                  minHeight: 120,
                  objectFit: 'cover'
                }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<Add />}
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  minWidth: 'auto',
                  px: 2
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item);
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" flex={1}>
          {restaurant?.name}
        </Typography>
        <IconButton onClick={() => setIsFavorite(!isFavorite)}>
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <IconButton>
          <Share />
        </IconButton>
      </Box>

      {/* Restaurant Info */}
      <Card sx={{ mb: 3 }}>
        <CardMedia
          component="img"
          height="250"
          image={restaurant?.image}
          alt={restaurant?.name}
        />
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {restaurant?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {restaurant?.description}
              </Typography>
              
              <Box display="flex" gap={1} mb={2}>
                {restaurant?.cuisines.map((cuisine) => (
                  <Chip key={cuisine} label={cuisine} size="small" />
                ))}
              </Box>
            </Box>
            
            <Box textAlign="right">
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Rating value={restaurant?.rating} readOnly size="small" precision={0.1} />
                <Typography variant="body2">
                  {restaurant?.rating} ({restaurant?.reviewCount})
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {restaurant?.priceRange} • {restaurant?.deliveryTime}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Delivery Time
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {restaurant?.deliveryTime}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <DeliveryDining color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Delivery Fee
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {restaurant?.deliveryFee === 0 ? 'Free' : `₹${restaurant?.deliveryFee}`}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box display="flex" alignItems="center" gap={1}>
                <ShoppingCart color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Minimum Order
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{restaurant?.minimumOrder}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Offers */}
          {restaurant?.offers && restaurant.offers.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Current Offers
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {restaurant.offers.map((offer, index) => (
                  <Chip
                    key={index}
                    label={offer}
                    color="primary"
                    variant="outlined"
                    size="small"
                    icon={<LocalOffer />}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Menu Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {menuCategories.map((category) => (
            <Tab 
              key={category} 
              label={category.charAt(0).toUpperCase() + category.slice(1)} 
              value={category} 
            />
          ))}
        </Tabs>
      </Paper>

      {/* Menu Items */}
      <Box>
        {menuData && menuData[activeTab as keyof typeof menuData]?.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </Box>

      {/* Customization Dialog */}
      <Dialog
        open={!!selectedItem}
        onClose={() => {
          setSelectedItem(null);
          setCustomizations({});
          setQuantity(1);
        }}
        maxWidth="md"
        fullWidth
      >
        {selectedItem && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <img
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
                />
                <Box>
                  <Typography variant="h6">{selectedItem.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{selectedItem.price}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedItem.description}
              </Typography>

              {/* Customizations */}
              {selectedItem.customizations?.map((customization: any) => (
                <Box key={customization.name} mb={3}>
                  <FormControl component="fieldset" fullWidth>
                    <FormLabel component="legend">
                      {customization.name}
                      {customization.required && <span style={{ color: 'red' }}> *</span>}
                    </FormLabel>
                    
                    {customization.type === 'single' ? (
                      <RadioGroup
                        value={customizations[customization.name] || ''}
                        onChange={(e) => setCustomizations((prev: any) => ({
                          ...prev,
                          [customization.name]: e.target.value
                        }))}
                      >
                        {customization.options.map((option: any) => (
                          <FormControlLabel
                            key={option.name}
                            value={option.name}
                            control={<Radio />}
                            label={
                              <Box display="flex" justifyContent="space-between" width="100%">
                                <span>{option.name}</span>
                                {option.price > 0 && (
                                  <span>+₹{option.price}</span>
                                )}
                              </Box>
                            }
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <Box>
                        {customization.options.map((option: any) => (
                          <FormControlLabel
                            key={option.name}
                            control={
                              <Checkbox
                                checked={customizations[customization.name]?.includes(option.name) || false}
                                onChange={(e) => {
                                  const currentOptions = customizations[customization.name] || [];
                                  const newOptions = e.target.checked
                                    ? [...currentOptions, option.name]
                                    : currentOptions.filter((opt: string) => opt !== option.name);
                                  
                                  setCustomizations((prev: any) => ({
                                    ...prev,
                                    [customization.name]: newOptions
                                  }));
                                }}
                              />
                            }
                            label={
                              <Box display="flex" justifyContent="space-between" width="100%">
                                <span>{option.name}</span>
                                {option.price > 0 && (
                                  <span>+₹{option.price}</span>
                                )}
                              </Box>
                            }
                          />
                        ))}
                      </Box>
                    )}
                  </FormControl>
                </Box>
              ))}

              {/* Special Instructions */}
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Special Instructions (Optional)"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests for this item..."
                sx={{ mb: 3 }}
              />

              {/* Quantity */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1">Quantity</Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Remove />
                  </IconButton>
                  <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center' }}>
                    {quantity}
                  </Typography>
                  <IconButton onClick={() => setQuantity(quantity + 1)}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => {
                  setSelectedItem(null);
                  setCustomizations({});
                  setQuantity(1);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddToCart}
                disabled={!isCustomizationComplete()}
                startIcon={<ShoppingCart />}
                sx={{ minWidth: 120 }}
              >
                Add to Cart
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default RestaurantDetailsPage;