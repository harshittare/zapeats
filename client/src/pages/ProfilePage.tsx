import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  IconButton,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Edit,
  LocationOn,
  CreditCard,
  Star,
  Notifications,
  Security,
  Language,
  DarkMode,
  Add,
  Delete,
  Phone,
  Email,
  Person,
  Home,
  Work,
  Favorite,
  LocalOffer,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

// Default user data structure (for fallback)
const getDefaultUserData = (user: any) => ({
  id: user?.id || 'user_001',
  name: user?.name || 'User',
  email: user?.email || 'user@example.com',
  phone: user?.phone || '+1 (555) 000-0000',
  avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  joinDate: user?.createdAt || new Date().toISOString().split('T')[0],
  loyaltyPoints: user?.loyaltyPoints || 0,
  totalOrders: user?.totalOrders || 0,
  favoriteRestaurants: user?.favoriteRestaurants || ['Burger Palace', 'Sushi Zen', 'Pizza Corner'],
  addresses: user?.addresses || [
    {
      id: 'addr_1',
      type: 'Home',
      name: 'Home',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true
    }
  ],
  paymentMethods: user?.paymentMethods || [
    {
      id: 'card_1',
      type: 'Credit Card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true
    }
  ],
  preferences: user?.preferences || {
    notifications: true,
    marketing: false,
    darkMode: false,
    language: 'English'
  }
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();
  
  // Get user data from auth context, with fallbacks
  const userData = getDefaultUserData(authUser);
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [addressDialog, setAddressDialog] = useState(false);
  const [user, setUser] = useState(userData);
  const [editForm, setEditForm] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone
  });

  // Update user data when auth user changes
  useEffect(() => {
    if (authUser) {
      const updatedUserData = getDefaultUserData(authUser);
      setUser(updatedUserData);
      setEditForm({
        name: updatedUserData.name,
        email: updatedUserData.email,
        phone: updatedUserData.phone
      });
    }
  }, [authUser]);

  const handleSaveProfile = () => {
    // Update local state
    setUser({ ...user, ...editForm });
    
    // Update auth context
    updateUser(editForm);
    
    setEditDialog(false);
    toast.success('Profile updated successfully!');
  };

  const handleTogglePreference = (key: string) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [key]: !user.preferences[key as keyof typeof user.preferences]
      }
    });
    toast.success('Preference updated!');
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      {/* Profile Card */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Avatar
              src={user.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.phone}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Member since {new Date(user.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
            <Box mt={2}>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => setEditDialog(true)}
              >
                Edit Profile
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {user.totalOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="secondary">
                {user.loyaltyPoints}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Loyalty Points
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {user.favoriteRestaurants.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Favorites
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                4.8
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Rating
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Favorite Restaurants */}
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Favorite sx={{ mr: 1, verticalAlign: 'middle' }} />
              Favorite Restaurants
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {user.favoriteRestaurants.map((restaurant: string, index: number) => (
                <Chip
                  key={index}
                  label={restaurant}
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate('/restaurants')}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAddressesTab = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Saved Addresses</Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setAddressDialog(true)}
          >
            Add Address
          </Button>
        </Box>
        <List>
          {user.addresses.map((address: any, index: number) => (
            <ListItem key={address.id}>
              <ListItemIcon>
                {address.type === 'Home' ? <Home /> : <Work />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    {address.name}
                    {address.isDefault && (
                      <Chip size="small" label="Default" color="primary" />
                    )}
                  </Box>
                }
                secondary={`${address.street}, ${address.city}, ${address.state} ${address.zipCode}`}
              />
              <ListItemSecondaryAction>
                <IconButton size="small">
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderPaymentTab = () => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Payment Methods</Typography>
          <Button variant="outlined" startIcon={<Add />}>
            Add Card
          </Button>
        </Box>
        <List>
          {user.paymentMethods.map((method: any) => (
            <ListItem key={method.id}>
              <ListItemIcon>
                <CreditCard />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    {method.brand} ending in {method.last4}
                    {method.isDefault && (
                      <Chip size="small" label="Default" color="primary" />
                    )}
                  </Box>
                }
                secondary={method.type}
              />
              <ListItemSecondaryAction>
                <IconButton size="small">
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error">
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderSettingsTab = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Preferences
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText primary="Push Notifications" secondary="Receive order updates" />
            <ListItemSecondaryAction>
              <Switch
                checked={user.preferences.notifications}
                onChange={() => handleTogglePreference('notifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocalOffer />
            </ListItemIcon>
            <ListItemText primary="Marketing Emails" secondary="Receive promotional offers" />
            <ListItemSecondaryAction>
              <Switch
                checked={user.preferences.marketing}
                onChange={() => handleTogglePreference('marketing')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DarkMode />
            </ListItemIcon>
            <ListItemText primary="Dark Mode" secondary="Use dark theme" />
            <ListItemSecondaryAction>
              <Switch
                checked={user.preferences.darkMode}
                onChange={() => handleTogglePreference('darkMode')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Profile" icon={<Person />} />
            <Tab label="Addresses" icon={<LocationOn />} />
            <Tab label="Payment" icon={<CreditCard />} />
            <Tab label="Settings" icon={<Security />} />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box>
          {selectedTab === 0 && renderProfileTab()}
          {selectedTab === 1 && renderAddressesTab()}
          {selectedTab === 2 && renderPaymentTab()}
          {selectedTab === 3 && renderSettingsTab()}
        </Box>

        {/* Edit Profile Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              margin="normal"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              margin="normal"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default ProfilePage;