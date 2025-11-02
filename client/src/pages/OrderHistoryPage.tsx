import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Divider,
  Grid,
  IconButton,
  Chip,
  Avatar,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  Tab,
  Tabs,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Restaurant,
  AccessTime,
  LocationOn,
  RateReview,
  Replay,
  Receipt,
  DeliveryDining,
  CheckCircle,
  Cancel,
  Schedule
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Mock order data to match your familiar restaurants
const mockOrders = [
  {
    _id: 'order_001',
    restaurant: {
      name: 'Burger Palace',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
    },
    items: [
      {
        name: 'Classic Beef Burger',
        quantity: 2,
        itemTotal: 25.98,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100'
        }
      },
      {
        name: 'French Fries',
        quantity: 1,
        itemTotal: 4.99,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100'
        }
      }
    ],
    totalAmount: 32.97,
    status: 'delivered',
    createdAt: '2025-10-30T18:30:00Z',
    deliveryAddress: {
      street: '123 Main Street',
      city: 'New York',
      zipCode: '10001'
    },
    actualDeliveryTime: '2025-10-30T19:15:00Z',
    rating: {
      overall: 5
    },
    review: {
      comment: 'Amazing burgers! Fast delivery and great taste.'
    }
  },
  {
    _id: 'order_002',
    restaurant: {
      name: 'Pizza Corner',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'
    },
    items: [
      {
        name: 'Margherita Pizza',
        quantity: 1,
        itemTotal: 18.99,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100'
        }
      }
    ],
    totalAmount: 24.48,
    status: 'preparing',
    createdAt: '2025-10-31T12:15:00Z',
    deliveryAddress: {
      street: '456 Oak Avenue',
      city: 'New York',
      zipCode: '10002'
    }
  },
  {
    _id: 'order_003',
    restaurant: {
      name: 'Sushi Zen',
      image: 'https://images.unsplash.com/photo-1563612202-1314901db998?w=400'
    },
    items: [
      {
        name: 'California Roll',
        quantity: 2,
        itemTotal: 16.98,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1563612202-1314901db998?w=100'
        }
      },
      {
        name: 'Salmon Nigiri',
        quantity: 4,
        itemTotal: 12.96,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=100'
        }
      }
    ],
    totalAmount: 32.94,
    status: 'delivered',
    createdAt: '2025-10-29T20:45:00Z',
    deliveryAddress: {
      street: '789 Pine Street',
      city: 'New York',
      zipCode: '10003'
    },
    actualDeliveryTime: '2025-10-29T21:30:00Z'
  },
  {
    _id: 'order_004',
    restaurant: {
      name: 'Healthy Bowls',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400'
    },
    items: [
      {
        name: 'Mediterranean Bowl',
        quantity: 1,
        itemTotal: 12.99,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100'
        }
      },
      {
        name: 'Green Smoothie',
        quantity: 1,
        itemTotal: 6.99,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=100'
        }
      }
    ],
    totalAmount: 21.98,
    status: 'cancelled',
    createdAt: '2025-10-28T14:20:00Z',
    deliveryAddress: {
      street: '321 Elm Street',
      city: 'New York',
      zipCode: '10004'
    }
  },
  {
    _id: 'order_005',
    restaurant: {
      name: 'Burger Palace',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
    },
    items: [
      {
        name: 'Double Cheeseburger',
        quantity: 1,
        itemTotal: 15.99,
        menuItem: {
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100'
        }
      }
    ],
    totalAmount: 19.48,
    status: 'out-for-delivery',
    createdAt: '2025-10-31T13:45:00Z',
    deliveryAddress: {
      street: '555 Broadway',
      city: 'New York',
      zipCode: '10005'
    }
  }
];

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Use mock orders (to match your familiar restaurants)
  const fetchOrders = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setRefreshing(!showLoading);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter mock orders based on selected tab
      const statusFilter = getStatusFilter(selectedTab);
      let filteredOrders = mockOrders;

      if (statusFilter !== 'all') {
        if (statusFilter === 'active') {
          filteredOrders = mockOrders.filter(order => 
            ['preparing', 'confirmed', 'ready', 'picked-up', 'out-for-delivery'].includes(order.status)
          );
        } else if (statusFilter === 'completed') {
          filteredOrders = mockOrders.filter(order => order.status === 'delivered');
        } else if (statusFilter === 'cancelled') {
          filteredOrders = mockOrders.filter(order => order.status === 'cancelled');
        } else {
          filteredOrders = mockOrders.filter(order => order.status === statusFilter);
        }
      }

      setOrders(filteredOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedTab]);

  // Uncomment below to use real API instead of mock data
  /*
  const fetchOrders = async (showLoading = true) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (showLoading) setLoading(true);
      setRefreshing(!showLoading);

      const statusFilter = getStatusFilter(selectedTab);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
        params: { status: statusFilter, limit: 50 },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  */

  // Get status filter for API
  const getStatusFilter = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: return 'all';
      case 1: return 'active';
      case 2: return 'completed';
      case 3: return 'cancelled';
      default: return 'all';
    }
  };

  // Fetch orders on component mount and tab change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success';
      case 'preparing': return 'warning';
      case 'on_the_way': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle />;
      case 'preparing': return <Restaurant />;
      case 'ready': return <Schedule />;
      case 'picked-up': return <DeliveryDining />;
      case 'out-for-delivery': return <DeliveryDining />;
      case 'cancelled': return <Cancel />;
      case 'confirmed': return <CheckCircle />;
      default: return <Schedule />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'preparing': return 'Preparing';
      case 'ready': return 'Ready for pickup';
      case 'picked-up': return 'Picked up';
      case 'out-for-delivery': return 'Out for delivery';
      case 'cancelled': return 'Cancelled';
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Orders are already filtered by the API, so just return them
  const filterOrders = (orders: any[]) => {
    return orders;
  };

  const handleReorder = async (order: any) => {
    try {
      // Simulate reorder with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Reordering ${order.items.map((item: any) => item.name).join(', ')} from ${order.restaurant.name}`);
      
      // Navigate to restaurants page to show the restaurant
      navigate('/restaurants');
    } catch (error: any) {
      console.error('Reorder failed:', error);
      toast.error('Failed to reorder');
    }
  };

  // Uncomment below to use real API reorder
  /*
  const handleReorder = async (order: any) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders/${order._id}/reorder`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        toast.success('Order placed successfully!');
        navigate('/checkout', { 
          state: { 
            order: response.data.order,
            isReorder: true 
          } 
        });
      }
    } catch (error: any) {
      console.error('Reorder failed:', error);
      toast.error(error.response?.data?.message || 'Failed to reorder');
    }
  };
  */

  const handleSubmitReview = async () => {
    if (!selectedOrder || rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    try {
      // Simulate review submission with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const reviewData = {
        rating: {
          overall: rating,
          food: rating,
          delivery: rating
        },
        review: {
          comment: reviewText
        }
      };

      // Update local order data
      const updatedOrders = orders.map(order => 
        order._id === selectedOrder._id 
          ? { ...order, rating: reviewData.rating, review: reviewData.review }
          : order
      );
      setOrders(updatedOrders);
      
      setReviewDialog(false);
      setRating(0);
      setReviewText('');
      toast.success('Review submitted successfully!');
    } catch (error: any) {
      console.error('Submit review failed:', error);
      toast.error('Failed to submit review');
    }
  };

  // Uncomment below to use real API review submission
  /*
  const handleSubmitReview = async () => {
    if (!selectedOrder || rating === 0) {
      toast.error('Please provide a rating');
      return;
    }
    
    try {
      const reviewData = {
        rating: {
          overall: rating,
          food: rating,
          delivery: rating
        },
        review: {
          comment: reviewText
        }
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders/${selectedOrder._id}/review`,
        reviewData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update local order data
        const updatedOrders = orders.map(order => 
          order._id === selectedOrder._id 
            ? { ...order, rating: reviewData.rating, review: reviewData.review }
            : order
        );
        setOrders(updatedOrders);
        
        setReviewDialog(false);
        setRating(0);
        setReviewText('');
        toast.success('Review submitted successfully!');
      }
    } catch (error: any) {
      console.error('Submit review failed:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };
  */

  const getTrackingProgress = (status: string) => {
    switch (status) {
      case 'pending': return 10;
      case 'confirmed': return 20;
      case 'preparing': return 40;
      case 'ready': return 60;
      case 'picked-up': return 80;
      case 'out-for-delivery': return 90;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold" flex={1}>
          Order History
        </Typography>
        <IconButton onClick={() => fetchOrders(false)} disabled={refreshing}>
          {refreshing ? <CircularProgress size={24} /> : <Refresh />}
        </IconButton>
      </Box>

      {/* Filter Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          variant="fullWidth"
        >
          <Tab label="All Orders" />
          <Tab label="Active" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Paper>

      {/* Orders List */}
      <Box>
        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <AnimatePresence>
            {filterOrders(orders).map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Avatar
                        src={order.restaurant?.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100'}
                        alt={order.restaurant?.name || 'Restaurant'}
                        sx={{ width: 60, height: 60 }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {order.restaurant?.name || 'Restaurant'}
                          </Typography>
                          <Chip
                            label={getStatusText(order.status)}
                            color={getStatusColor(order.status) as any}
                            size="small"
                            icon={getStatusIcon(order.status)}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Order #{order._id?.slice(-8)} • {formatDate(order.createdAt)}
                        </Typography>
                        
                        <Typography variant="body2" gutterBottom>
                          {order.items.length} item{order.items.length > 1 ? 's' : ''} • ₹{order.totalAmount}
                        </Typography>
                        
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <LocationOn sx={{ fontSize: 16 }} color="disabled" />
                          <Typography variant="caption" color="text.secondary">
                            {`${order.deliveryAddress.street}, ${order.deliveryAddress.city}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <Box display="flex" flexDirection="column" gap={1}>
                        {/* Active Order Progress */}
                        {(['preparing', 'ready', 'picked-up', 'out-for-delivery'].includes(order.status)) && (
                          <Box mb={2}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="caption" color="text.secondary">
                                Order Progress
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {getTrackingProgress(order.status)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={getTrackingProgress(order.status)}
                              sx={{ height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        )}
                        
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Receipt />}
                            onClick={() => setSelectedOrder(order)}
                          >
                            Details
                          </Button>
                          
                          {order.status === 'delivered' && (
                            <>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Replay />}
                                onClick={() => handleReorder(order)}
                              >
                                Reorder
                              </Button>
                              
                              {!order.rating && (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<RateReview />}
                                  onClick={() => {
                                    setSelectedOrder(order);
                                    setReviewDialog(true);
                                  }}
                                >
                                  Review
                                </Button>
                              )}
                            </>
                          )}
                          
                          {(['preparing', 'ready', 'picked-up', 'out-for-delivery'].includes(order.status)) && (
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<DeliveryDining />}
                            >
                              Track
                            </Button>
                          )}
                        </Box>
                        
                        {order.rating?.overall > 0 && (
                          <Box display="flex" alignItems="center" gap={1} mt={1}>
                            <Rating value={order.rating.overall} readOnly size="small" />
                            <Typography variant="caption" color="text.secondary">
                              Your rating
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && filterOrders(orders).length === 0 && (
          <Box textAlign="center" py={8}>
            <Restaurant sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedTab === 1 && "You don't have any active orders at the moment."}
              {selectedTab === 2 && "You haven't completed any orders yet."}
              {selectedTab === 3 && "You don't have any cancelled orders."}
              {selectedTab === 0 && "You haven't placed any orders yet."}
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/restaurants')}
              sx={{ mt: 2 }}
            >
              Browse Restaurants
            </Button>
          </Box>
        )}
      </Box>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder && !reviewDialog}
        onClose={() => setSelectedOrder(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={selectedOrder.restaurant?.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100'}
                  alt={selectedOrder.restaurant?.name || 'Restaurant'}
                  sx={{ width: 40, height: 40 }}
                />
                <Box>
                  <Typography variant="h6">Order #{selectedOrder._id?.slice(-8)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedOrder.restaurant?.name || 'Restaurant'} • {formatDate(selectedOrder.createdAt)}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Order Status
                </Typography>
                <Chip
                  label={getStatusText(selectedOrder.status)}
                  color={getStatusColor(selectedOrder.status) as any}
                  icon={getStatusIcon(selectedOrder.status)}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Items Ordered
                </Typography>
                {selectedOrder.items.map((item: any, index: number) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} py={1}>
                    <img
                      src={item.menuItem?.image || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100'}
                      alt={item.name}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                    />
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight="medium">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      ₹{item.itemTotal}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box mb={3}>
                <Typography variant="subtitle1" gutterBottom>
                  Delivery Information
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <LocationOn sx={{ fontSize: 16 }} />
                  <Typography variant="body2">
                    {`${selectedOrder.deliveryAddress.street}, ${selectedOrder.deliveryAddress.city}, ${selectedOrder.deliveryAddress.zipCode}`}
                  </Typography>
                </Box>
                {selectedOrder.actualDeliveryTime && (
                  <Box display="flex" alignItems="center" gap={1}>
                    <AccessTime sx={{ fontSize: 16 }} />
                    <Typography variant="body2">
                      Delivered at {formatDate(selectedOrder.actualDeliveryTime)}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  Total Paid
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ₹{selectedOrder.totalAmount}
                </Typography>
              </Box>

              {selectedOrder.review?.comment && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Your Review
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Rating value={selectedOrder.rating?.overall || 0} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        {selectedOrder.rating?.overall || 0}/5 stars
                      </Typography>
                    </Box>
                    <Typography variant="body2">{selectedOrder.review.comment}</Typography>
                  </Box>
                </>
              )}
            </DialogContent>

            <DialogActions>
              <Button onClick={() => setSelectedOrder(null)}>Close</Button>
              {selectedOrder.status === 'delivered' && (
                <Button
                  variant="contained"
                  startIcon={<Replay />}
                  onClick={() => {
                    handleReorder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                >
                  Reorder
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Review Dialog */}
      <Dialog
        open={reviewDialog}
        onClose={() => setReviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rate Your Order</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box textAlign="center" mb={3}>
              <Avatar
                src={selectedOrder.restaurant?.image || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100'}
                alt={selectedOrder.restaurant?.name || 'Restaurant'}
                sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {selectedOrder.restaurant?.name || 'Restaurant'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order #{selectedOrder._id?.slice(-8)}
              </Typography>
            </Box>
          )}
          
          <Box textAlign="center" mb={3}>
            <Typography variant="subtitle1" gutterBottom>
              How was your experience?
            </Typography>
            <Rating
              size="large"
              value={rating}
              onChange={(_, newValue) => setRating(newValue || 0)}
            />
          </Box>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Write a review (optional)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Tell us about your experience..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={rating === 0}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderHistoryPage;