import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Search,
  LocationOn,
  Star,
  LocalOffer,
  DeliveryDining,
  Restaurant,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  // Mock data for featured restaurants
  const featuredRestaurants = [
    {
      id: '1',
      name: 'Burger Palace',
      cuisine: 'American',
      rating: 4.5,
      deliveryTime: '25-30 min',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
      offer: '20% OFF'
    },
    {
      id: '2',
      name: 'Pizza Corner',
      cuisine: 'Italian',
      rating: 4.3,
      deliveryTime: '30-35 min',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
      offer: 'Buy 1 Get 1'
    },
    {
      id: '3',
      name: 'Sushi Zen',
      cuisine: 'Japanese',
      rating: 4.7,
      deliveryTime: '20-25 min',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
      offer: 'Free Delivery'
    }
  ];

  const categories = [
    { name: 'Fast Food', icon: '🍔', color: '#FF6B35' },
    { name: 'Pizza', icon: '🍕', color: '#E91E63' },
    { name: 'Asian', icon: '🍜', color: '#9C27B0' },
    { name: 'Desserts', icon: '🍰', color: '#673AB7' },
    { name: 'Healthy', icon: '🥗', color: '#4CAF50' },
    { name: 'Beverages', icon: '🧋', color: '#00BCD4' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ fontSize: { xs: '2rem', md: '3rem' } }}
                >
                  Delicious Food,
                  <br />
                  Delivered Fast! ⚡
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ mb: 4, opacity: 0.9 }}
                >
                  Order from your favorite local restaurants and get it delivered in minutes.
                </Typography>
                
                {/* Search Bar */}
                <Paper
                  elevation={3}
                  sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 3,
                    mb: 3
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search for restaurants, food..."
                    variant="outlined"
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton color="primary" size="large">
                            <Search />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { border: 'none', '& fieldset': { border: 'none' } }
                    }}
                  />
                </Paper>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/restaurants')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)'
                    }
                  }}
                >
                  Explore Restaurants
                </Button>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600"
                  alt="Delicious Food"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 4,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
          color="text.primary"
        >
          What are you craving? 🤤
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Browse by your favorite cuisine
        </Typography>

        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={6} sm={4} md={2} key={category.name}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 8,
                      backgroundColor: category.color,
                      color: 'white'
                    }
                  }}
                  onClick={() => navigate(`/restaurants?category=${category.name.toLowerCase()}`)}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {category.name}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Restaurants */}
      <Box sx={{ backgroundColor: 'background.default', py: 6 }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
            <Box>
              <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                Featured Restaurants ⭐
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Top-rated restaurants near you
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<TrendingUp />}
              onClick={() => navigate('/restaurants')}
            >
              View All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {featuredRestaurants.map((restaurant, index) => (
              <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    <Box position="relative">
                      <CardMedia
                        component="img"
                        height="200"
                        image={restaurant.image}
                        alt={restaurant.name}
                      />
                      <Chip
                        label={restaurant.offer}
                        color="primary"
                        size="small"
                        icon={<LocalOffer />}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {restaurant.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {restaurant.cuisine}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Star color="warning" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {restaurant.rating}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <DeliveryDining color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {restaurant.deliveryTime}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Why Choose ZapEats? 🚀
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {[
            {
              icon: '⚡',
              title: 'Lightning Fast',
              description: 'Get your food delivered in under 30 minutes'
            },
            {
              icon: '🌟',
              title: 'Top Quality',
              description: 'Only the best restaurants and verified reviews'
            },
            {
              icon: '📱',
              title: 'Easy Ordering',
              description: 'Simple app interface with smart recommendations'
            }
          ].map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Box textAlign="center" p={3}>
                  <Typography variant="h2" sx={{ mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;