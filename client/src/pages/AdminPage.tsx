import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  People,
  ShoppingCart,
  Analytics,
  Settings,
  Store,
  PersonOutline,
  Receipt
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDialog, setSelectedDialog] = useState<string | null>(null);

  const adminCards = [
    {
      title: 'Restaurants',
      icon: <Restaurant />,
      description: 'Manage restaurants and menus',
      color: '#FF6B35',
      dialogId: 'restaurants'
    },
    {
      title: 'Users',
      icon: <People />,
      description: 'View and manage users',
      color: '#2E7D32',
      dialogId: 'users'
    },
    {
      title: 'Orders',
      icon: <ShoppingCart />,
      description: 'Track all orders',
      color: '#1976D2',
      dialogId: 'orders'
    },
    {
      title: 'Analytics',
      icon: <Analytics />,
      description: 'View business analytics',
      color: '#7B1FA2',
      dialogId: 'analytics'
    },
    {
      title: 'Settings',
      icon: <Settings />,
      description: 'System configuration',
      color: '#F57C00',
      dialogId: 'settings'
    }
  ];

  const handleManageClick = (dialogId: string) => {
    setSelectedDialog(dialogId);
  };

  const handleCloseDialog = () => {
    setSelectedDialog(null);
  };

  const renderDialogContent = () => {
    switch (selectedDialog) {
      case 'restaurants':
        return (
          <Box>
            <List>
              <ListItem button onClick={() => navigate('/restaurants')}>
                <ListItemIcon><Store /></ListItemIcon>
                <ListItemText 
                  primary="View All Restaurants" 
                  secondary="Browse the restaurant directory"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Restaurant /></ListItemIcon>
                <ListItemText 
                  primary="Add New Restaurant" 
                  secondary="Register a new restaurant partner"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Analytics /></ListItemIcon>
                <ListItemText 
                  primary="Restaurant Analytics" 
                  secondary="View performance metrics"
                />
              </ListItem>
            </List>
          </Box>
        );
      case 'users':
        return (
          <Box>
            <List>
              <ListItem button>
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText 
                  primary="View All Users" 
                  secondary="Manage user accounts"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><PersonOutline /></ListItemIcon>
                <ListItemText 
                  primary="User Reports" 
                  secondary="View user activity reports"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText 
                  primary="User Permissions" 
                  secondary="Manage user roles and permissions"
                />
              </ListItem>
            </List>
          </Box>
        );
      case 'orders':
        return (
          <Box>
            <List>
              <ListItem button onClick={() => navigate('/orders')}>
                <ListItemIcon><Receipt /></ListItemIcon>
                <ListItemText 
                  primary="View All Orders" 
                  secondary="Monitor order activity"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><ShoppingCart /></ListItemIcon>
                <ListItemText 
                  primary="Order Analytics" 
                  secondary="View order statistics"
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Settings /></ListItemIcon>
                <ListItemText 
                  primary="Order Settings" 
                  secondary="Configure order processing"
                />
              </ListItem>
            </List>
          </Box>
        );
      case 'analytics':
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              📊 Analytics Dashboard Coming Soon
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View comprehensive business analytics, revenue reports, and performance metrics.
            </Typography>
          </Box>
        );
      case 'settings':
        return (
          <Box>
            <Typography variant="body1" gutterBottom>
              ⚙️ System Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure application settings, payment gateways, and system preferences.
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Dashboard color="primary" />
          <Typography variant="h4" fontWeight="bold">
            Admin Dashboard
          </Typography>
          <Chip
            label="ADMIN"
            color="primary"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Welcome back, {user?.name}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your ZapEats platform from this central dashboard.
        </Typography>
      </Box>

      {/* Admin Cards */}
      <Grid container spacing={3}>
        {adminCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${card.color}20`,
                      color: card.color,
                      mr: 2
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {card.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleManageClick(card.dialogId)}
                  sx={{
                    borderColor: card.color,
                    color: card.color,
                    '&:hover': {
                      borderColor: card.color,
                      backgroundColor: `${card.color}10`
                    }
                  }}
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Stats */}
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🎯 Admin Access Confirmed!
        </Typography>
        <Box display="flex" flex-wrap="wrap" gap={2}>
          <Chip label={`User: ${user?.name}`} variant="outlined" />
          <Chip label={`Email: ${user?.email}`} variant="outlined" />
          <Chip label={`Role: ${user?.role?.toUpperCase()}`} color="primary" />
          <Chip label={`Loyalty Points: ${user?.loyaltyPoints}`} variant="outlined" />
        </Box>
        <Typography variant="body2" color="text.secondary" mt={2}>
          This page is only accessible to users with admin role. Regular users will be redirected.
        </Typography>
      </Paper>

      {/* Management Dialog */}
      <Dialog
        open={selectedDialog !== null}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedDialog && adminCards.find(card => card.dialogId === selectedDialog)?.title} Management
        </DialogTitle>
        <DialogContent>
          {renderDialogContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;