import React, { useState, useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Restaurant,
  AccessTime,
  LocationOn,
  Star,
  RateReview,
  Replay,
  Receipt,
  DeliveryDining,
  CheckCircle,
  Cancel,
  Schedule,
  ExpandMore,
  Phone,
  Help
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated, token } = useAuth();
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch orders from API
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
  }, [selectedTab, isAuthenticated]);

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