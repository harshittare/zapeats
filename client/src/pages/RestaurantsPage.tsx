import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  IconButton,
  Rating
} from '@mui/material';
import {
  Search,
  FilterList,
  ViewList,
  ViewModule,
  AccessTime,
  LocalOffer,
  DeliveryDining,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock data for restaurants
const mockRestaurants = [
  {
    id: '1',
    name: 'Burger Palace',
    description: 'Gourmet burgers made with premium ingredients',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    cuisines: ['American', 'Fast Food'],
    rating: 4.5,
    reviewCount: 324,
    deliveryTime: '25-30 min',
    deliveryFee: 249,
    minimumOrder: 1249,
    priceRange: '$$',
    distance: 1.2,
    isOpen: true,
    features: ['vegetarian-options'],
    offers: ['20% OFF on first order'],
    isFavorite: false
  },
  {
    id: '2',
    name: 'Pizza Corner',
    description: 'Authentic Italian pizza with fresh toppings',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    cuisines: ['Italian', 'Pizza'],
    rating: 4.3,
    reviewCount: 189,
    deliveryTime: '30-35 min',
    deliveryFee: 289,
    minimumOrder: 1660,
    priceRange: '$$',
    distance: 2.1,
    isOpen: true,
    features: ['vegetarian-options', 'vegan-options'],
    offers: ['Buy 1 Get 1 Free'],
    isFavorite: true
  },
  {
    id: '3',
    name: 'Sushi Zen',
    description: 'Fresh sushi and Japanese cuisine',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    cuisines: ['Japanese', 'Sushi'],
    rating: 4.7,
    reviewCount: 256,
    deliveryTime: '20-25 min',
    deliveryFee: 0,
    minimumOrder: 2075,
    priceRange: '$$$',
    distance: 0.8,
    isOpen: true,
    features: ['gluten-free'],
    offers: ['Free Delivery'],
    isFavorite: false
  },
  {
    id: '4',
    name: 'Healthy Bowls',
    description: 'Nutritious bowls and salads for a healthy lifestyle',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
    cuisines: ['Healthy', 'Salads'],
    rating: 4.2,
    reviewCount: 98,
    deliveryTime: '15-20 min',
    deliveryFee: 207,
    minimumOrder: 996,
    priceRange: '$',
    distance: 1.5,
    isOpen: false,
    features: ['vegetarian-options', 'vegan-options', 'gluten-free'],
    offers: [],
    isFavorite: false
  }
];

const RestaurantsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [features, setFeatures] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['2']);

  // All available options
  const allCuisines = ['American', 'Italian', 'Japanese', 'Chinese', 'Mexican', 'Indian', 'Thai', 'Fast Food', 'Healthy', 'Pizza', 'Sushi', 'Salads'];
  const allPriceRanges = ['$', '$$', '$$$', '$$$$'];
  const allFeatures = [
    { id: 'vegetarian-options', label: 'Vegetarian' },
    { id: 'vegan-options', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten Free' },
    { id: 'halal', label: 'Halal' }
  ];

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    let filtered = mockRestaurants.filter(restaurant => {
      // Search filter
      if (searchQuery && !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !restaurant.cuisines.some(cuisine => cuisine.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Cuisine filter
      if (selectedCuisines.length > 0 && !selectedCuisines.some(cuisine => restaurant.cuisines.includes(cuisine))) {
        return false;
      }

      // Price range filter
      if (priceRange.length > 0 && !priceRange.includes(restaurant.priceRange)) {
        return false;
      }

      // Rating filter
      if (rating > 0 && restaurant.rating < rating) {
        return false;
      }

      // Features filter
      if (features.length > 0 && !features.some(feature => restaurant.features.includes(feature))) {
        return false;
      }

      return true;
    });

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'delivery-time':
          return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
        case 'distance':
          return a.distance - b.distance;
        case 'price-low':
          return a.priceRange.length - b.priceRange.length;
        case 'price-high':
          return b.priceRange.length - a.priceRange.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCuisines, priceRange, rating, features, sortBy]);

  const toggleFavorite = (restaurantId: string) => {
    setFavorites(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const RestaurantCard = ({ restaurant, index }: { restaurant: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }
        }}
        onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      >
        {/* Restaurant Image */}
        <Box position="relative">
          <CardMedia
            component="img"
            height="200"
            image={restaurant.image}
            alt={restaurant.name}
          />
          
          {/* Favorite Button */}
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(restaurant.id);
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            {favorites.includes(restaurant.id) ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>

          {/* Offers */}
          {restaurant.offers.length > 0 && (
            <Chip
              label={restaurant.offers[0]}
              color="primary"
              size="small"
              icon={<LocalOffer />}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                fontWeight: 'bold'
              }}
            />
          )}

          {/* Status */}
          {!restaurant.isOpen && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h6" color="white" fontWeight="bold">
                Currently Closed
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent sx={{ pb: 1 }}>
          {/* Restaurant Name & Description */}
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {restaurant.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {restaurant.description}
          </Typography>

          {/* Cuisines */}
          <Box display="flex" gap={0.5} mb={2} flexWrap="wrap">
            {restaurant.cuisines.map((cuisine: string) => (
              <Chip
                key={cuisine}
                label={cuisine}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>

          {/* Rating & Reviews */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Rating value={restaurant.rating} readOnly size="small" precision={0.1} />
            <Typography variant="body2" color="text.secondary">
              {restaurant.rating} ({restaurant.reviewCount} reviews)
            </Typography>
          </Box>

          {/* Delivery Info */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime fontSize="small" color="primary" />
              <Typography variant="body2">{restaurant.deliveryTime}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <DeliveryDining fontSize="small" color="primary" />
              <Typography variant="body2">
                {restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {restaurant.distance} km
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Restaurants Near You 🍽️
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover amazing food from local restaurants
        </Typography>
      </Box>

      {/* Search & Filters */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search for restaurants, cuisines, or dishes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />

        {/* Filter Toggle & View Mode */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={showFilters ? 3 : 0}>
          <Box display="flex" gap={2}>
            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="delivery-time">Delivery Time</MenuItem>
                <MenuItem value="distance">Distance</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="grid">
              <ViewModule />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {/* Cuisines */}
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cuisines
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {allCuisines.map((cuisine) => (
                      <Chip
                        key={cuisine}
                        label={cuisine}
                        clickable
                        color={selectedCuisines.includes(cuisine) ? 'primary' : 'default'}
                        onClick={() => {
                          setSelectedCuisines(prev =>
                            prev.includes(cuisine)
                              ? prev.filter(c => c !== cuisine)
                              : [...prev, cuisine]
                          );
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Price Range */}
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Price Range
                  </Typography>
                  <Box display="flex" gap={0.5}>
                    {allPriceRanges.map((price) => (
                      <Chip
                        key={price}
                        label={price}
                        clickable
                        color={priceRange.includes(price) ? 'primary' : 'default'}
                        onClick={() => {
                          setPriceRange(prev =>
                            prev.includes(price)
                              ? prev.filter(p => p !== price)
                              : [...prev, price]
                          );
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Rating */}
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Minimum Rating
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Rating
                      value={rating}
                      onChange={(_, newValue) => setRating(newValue || 0)}
                    />
                    <Typography variant="body2">& above</Typography>
                  </Box>
                </Grid>

                {/* Features */}
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Dietary Options
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {allFeatures.map((feature) => (
                      <Chip
                        key={feature.id}
                        label={feature.label}
                        clickable
                        color={features.includes(feature.id) ? 'primary' : 'default'}
                        onClick={() => {
                          setFeatures(prev =>
                            prev.includes(feature.id)
                              ? prev.filter(f => f !== feature.id)
                              : [...prev, feature.id]
                          );
                        }}
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      {/* Results Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          {filteredRestaurants.length} restaurants found
        </Typography>
        <Box display="flex" gap={1}>
          {(selectedCuisines.length > 0 || priceRange.length > 0 || rating > 0 || features.length > 0) && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedCuisines([]);
                setPriceRange([]);
                setRating(0);
                setFeatures([]);
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Box>

      {/* Restaurant Grid */}
      <Grid container spacing={3}>
        {filteredRestaurants.map((restaurant, index) => (
          <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={restaurant.id}>
            <RestaurantCard restaurant={restaurant} index={index} />
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {filteredRestaurants.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" gutterBottom>
            No restaurants found
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Try adjusting your filters or search terms
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              setSearchQuery('');
              setSelectedCuisines([]);
              setPriceRange([]);
              setRating(0);
              setFeatures([]);
            }}
          >
            Reset All Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default RestaurantsPage;