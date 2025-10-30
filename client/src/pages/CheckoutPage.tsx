import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import {
  ArrowBack,
  Payment,
  Security,
  CheckCircle,
  CreditCard,
  AccountBalanceWallet,
  LocalAtm,
  LocationOn,
  AccessTime,
  Restaurant,
  DeliveryDining,
  Phone,
  Email,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const steps = [
  'Order Review',
  'Payment Details', 
  'Confirmation'
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const { user } = useAuth();
  
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    gpayEmail: '',
    showCvv: false
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    phone: '+1 (555) 123-4567',
    email: 'user@example.com'
  });

  useEffect(() => {
    // Get order data from navigation state
    if (location.state) {
      const data = location.state;
      // Ensure paymentMethod has a default value
      if (!data.paymentMethod) {
        data.paymentMethod = 'cash';
      }
      setOrderData(data);
    } else {
      // Redirect to cart if no order data
      navigate('/cart');
    }
  }, [location.state, navigate]);

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    
    // Validate payment method specific fields
    if (orderData.paymentMethod === 'card') {
      if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardholderName) {
        toast.error('Please fill in all card details');
        setIsProcessing(false);
        return;
      }
    } else if (orderData.paymentMethod === 'gpay') {
      // GPay validation - email is optional since GPay can work with phone numbers
      if (paymentForm.gpayEmail && !paymentForm.gpayEmail.includes('@')) {
        toast.error('Please enter a valid Google Pay email');
        setIsProcessing(false);
        return;
      }
    }

    // Validate user authentication
    if (!user) {
      toast.error('Please log in to place an order');
      setIsProcessing(false);
      return;
    }
    
    // Create order in database
    try {
      // Prepare order data for API
      const orderPayload = {
        restaurantId: orderData.items[0]?.restaurant?.id || orderData.items[0]?.restaurantId || orderData.restaurantId, // Get restaurant ID from first item
        items: orderData.items.map((item: any) => ({
          menuItemId: item.menuItemId || item.id,
          quantity: item.quantity,
          customizations: item.customizations || [],
          specialInstructions: item.specialInstructions || ''
        })),
        deliveryAddress: {
          street: orderData.address?.street || orderData.deliveryAddress?.street || '123 Default Street',
          city: orderData.address?.city || orderData.deliveryAddress?.city || 'Default City',
          state: orderData.address?.state || orderData.deliveryAddress?.state || 'Default State',
          zipCode: orderData.address?.zipCode || orderData.deliveryAddress?.zipCode || '12345',
          coordinates: orderData.address?.coordinates || orderData.deliveryAddress?.coordinates || { latitude: 0, longitude: 0 }
        },
        paymentMethod: orderData.paymentMethod,
        specialInstructions: orderData.specialInstructions || '',
        contactlessDelivery: orderData.contactlessDelivery || false,
        couponCode: orderData.couponCode || ''
      };

      // Make API call to create order
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/orders`,
        orderPayload,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        const createdOrder = response.data.order;
        setOrderId(createdOrder._id);
        
        // Clear cart
        clearCart();
        
        // Move to confirmation step
        setActiveStep(2);
        
        let successMessage = 'Payment successful! Your order has been placed.';
        if (orderData.paymentMethod === 'cash') {
          successMessage = 'Order confirmed! You will pay in cash upon delivery.';
        }
        
        toast.success(successMessage);
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      
      let errorMessage = 'Order processing failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (value: string) => {
    // Format card number (XXXX XXXX XXXX XXXX)
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      setPaymentForm(prev => ({ ...prev, cardNumber: parts.join(' ') }));
    } else {
      setPaymentForm(prev => ({ ...prev, cardNumber: v }));
    }
  };

  const handleExpiryChange = (value: string) => {
    // Format expiry date (MM/YY)
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      setPaymentForm(prev => ({ ...prev, expiryDate: `${v.slice(0, 2)}/${v.slice(2, 4)}` }));
    } else {
      setPaymentForm(prev => ({ ...prev, expiryDate: v }));
    }
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5') || (num.startsWith('2') && num.length > 3 && parseInt(num.slice(0, 4)) >= 2221 && parseInt(num.slice(0, 4)) <= 2720)) return 'Mastercard';
    if (num.startsWith('3')) return 'American Express';
    return 'Card';
  };

  if (!orderData) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center">
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading checkout...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Checkout
        </Typography>
      </Box>

      {/* Progress Stepper */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <AnimatePresence mode="wait">
            {/* Step 1: Order Review */}
            {activeStep === 0 && (
              <motion.div
                key="order-review"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Review
                    </Typography>
                    
                    {/* Order Items */}
                    <Box mb={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Items ({orderData.items.length})
                      </Typography>
                      {orderData.items.map((item: any) => (
                        <Box key={item.id} display="flex" alignItems="center" gap={2} py={1}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                          />
                          <Box flex={1}>
                            <Typography variant="body2" fontWeight="medium">
                              {item.name} x{item.quantity}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.restaurant.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="medium">
                            ₹{item.price * item.quantity}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Delivery Details */}
                    <Box mb={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Delivery Details
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <LocationOn color="primary" />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {orderData.address?.type || orderData.deliveryAddress?.type || 'Home'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {orderData.address?.address || orderData.address?.street || orderData.deliveryAddress?.street || 'Address'}, {orderData.address?.city || orderData.deliveryAddress?.city || 'City'} {orderData.address?.zipCode || orderData.deliveryAddress?.zipCode || ''}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center" gap={2}>
                        <AccessTime color="primary" />
                        <Typography variant="body2">
                          {orderData.deliveryTime === 'asap' ? 'ASAP (25-35 min)' : orderData.deliveryTime}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Contact Information */}
                    <Box mb={3}>
                      <Typography variant="subtitle2" gutterBottom>
                        Contact Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => setActiveStep(1)}
                      sx={{ mt: 2 }}
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 2: Payment Details */}
            {activeStep === 1 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Payment Method
                    </Typography>

                    {/* Payment Options */}
                    <Box mb={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Paper
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              border: orderData.paymentMethod === 'card' ? '2px solid' : '1px solid',
                              borderColor: orderData.paymentMethod === 'card' ? 'primary.main' : 'divider',
                              bgcolor: orderData.paymentMethod === 'card' ? 'primary.50' : 'transparent'
                            }}
                            onClick={() => {
                              setOrderData((prev: any) => ({ ...prev, paymentMethod: 'card' }));
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <CreditCard color={orderData.paymentMethod === 'card' ? 'primary' : 'inherit'} />
                              <Box>
                                <Typography variant="subtitle2">Credit/Debit Card</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Visa, Mastercard, Amex
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Paper
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              border: orderData.paymentMethod === 'gpay' ? '2px solid' : '1px solid',
                              borderColor: orderData.paymentMethod === 'gpay' ? 'primary.main' : 'divider',
                              bgcolor: orderData.paymentMethod === 'gpay' ? 'primary.50' : 'transparent'
                            }}
                            onClick={() => {
                              setOrderData((prev: any) => ({ ...prev, paymentMethod: 'gpay' }));
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <AccountBalanceWallet color={orderData.paymentMethod === 'gpay' ? 'primary' : 'inherit'} />
                              <Box>
                                <Typography variant="subtitle2">Google Pay</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Pay with Google Pay
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <Paper
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              border: orderData.paymentMethod === 'cash' ? '2px solid' : '1px solid',
                              borderColor: orderData.paymentMethod === 'cash' ? 'primary.main' : 'divider',
                              bgcolor: orderData.paymentMethod === 'cash' ? 'primary.50' : 'transparent'
                            }}
                            onClick={() => {
                              setOrderData((prev: any) => ({ ...prev, paymentMethod: 'cash' }));
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={2}>
                              <LocalAtm color={orderData.paymentMethod === 'cash' ? 'primary' : 'inherit'} />
                              <Box>
                                <Typography variant="subtitle2">Cash on Delivery</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Pay when order arrives
                                </Typography>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Card Details */}
                    {orderData.paymentMethod === 'card' && (
                      <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom>
                          Card Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Card Number"
                              value={paymentForm.cardNumber}
                              onChange={(e) => handleCardNumberChange(e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              inputProps={{ maxLength: 19 }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <CreditCard />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Typography variant="caption" color="text.secondary">
                                      {getCardType(paymentForm.cardNumber)}
                                    </Typography>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Cardholder Name"
                              value={paymentForm.cardholderName}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, cardholderName: e.target.value }))}
                              placeholder="John Doe"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="MM/YY"
                              value={paymentForm.expiryDate}
                              onChange={(e) => handleExpiryChange(e.target.value)}
                              placeholder="12/25"
                              inputProps={{ maxLength: 5 }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              fullWidth
                              label="CVV"
                              type={paymentForm.showCvv ? 'text' : 'password'}
                              value={paymentForm.cvv}
                              onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '') }))}
                              placeholder="123"
                              inputProps={{ maxLength: 4 }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setPaymentForm(prev => ({ ...prev, showCvv: !prev.showCvv }))}
                                      edge="end"
                                    >
                                      {paymentForm.showCvv ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Google Pay Details */}
                    {orderData.paymentMethod === 'gpay' && (
                      <Box mb={3}>
                        <Typography variant="subtitle2" gutterBottom>
                          Google Pay Account
                        </Typography>
                        <TextField
                          fullWidth
                          label="Google Pay Email (Optional)"
                          value={paymentForm.gpayEmail}
                          onChange={(e) => setPaymentForm(prev => ({ ...prev, gpayEmail: e.target.value }))}
                          placeholder="your.email@gmail.com (or use your phone number in GPay)"
                          type="email"
                          helperText="You can also use GPay with your phone number during payment"
                        />
                      </Box>
                    )}

                    {/* Cash on Delivery Info */}
                    {orderData.paymentMethod === 'cash' && (
                      <Box mb={3}>
                        <Alert severity="info">
                          <Typography variant="body2">
                            You will pay in cash when your order is delivered. Please have the exact amount ready: ₹{orderData.pricing?.total || orderData.total || '0'}
                          </Typography>
                        </Alert>
                      </Box>
                    )}

                    {/* Security Notice */}
                    <Alert severity="info" sx={{ mb: 3 }}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Security />
                        <Typography variant="body2">
                          Your payment information is encrypted and secure
                        </Typography>
                      </Box>
                    </Alert>

                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={() => setActiveStep(0)}
                        sx={{ flex: 1 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handlePaymentSubmit}
                        disabled={isProcessing}
                        startIcon={isProcessing ? <CircularProgress size={20} /> : <Payment />}
                        sx={{ flex: 2 }}
                      >
                        {isProcessing 
                          ? (orderData.paymentMethod === 'cash' ? 'Confirming...' : 'Processing...') 
                          : (orderData.paymentMethod === 'cash' 
                            ? `Confirm Order ₹${orderData.pricing?.total || orderData.total || '0'}` 
                            : `Pay ₹${orderData.pricing?.total || orderData.total || '0'}`)}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 2 && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 4 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                    </motion.div>
                    
                    <Typography variant="h4" gutterBottom color="success.main" fontWeight="bold">
                      Order Confirmed!
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom>
                      Order #{orderId}
                    </Typography>
                    
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Thank you for your order! 
                      {orderData.paymentMethod === 'cash' 
                        ? "Your order is confirmed and being prepared. You'll pay in cash upon delivery." 
                        : "We've received your payment and your food is being prepared."} 
                      You'll receive updates via SMS and email.
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={4} my={4}>
                      <Box textAlign="center">
                        <Restaurant sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">Preparing</Typography>
                        <Typography variant="caption" color="text.secondary">5-10 min</Typography>
                      </Box>
                      <Box textAlign="center">
                        <DeliveryDining sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">On the way</Typography>
                        <Typography variant="caption" color="text.secondary">15-20 min</Typography>
                      </Box>
                      <Box textAlign="center">
                        <CheckCircle sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography variant="body2" fontWeight="medium">Delivered</Typography>
                        <Typography variant="caption" color="text.secondary">25-35 min</Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
                      <Button
                        variant="contained"
                        onClick={() => navigate('/orders', { state: { orderId } })}
                        size="large"
                      >
                        Track Order
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/restaurants')}
                        size="large"
                      >
                        Order Again
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">₹{orderData.pricing?.subtotal || orderData.subtotal || '0'}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Delivery Fee</Typography>
                  <Typography variant="body2">₹{orderData.pricing?.deliveryFee || orderData.deliveryFee || '0'}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Service Fee</Typography>
                  <Typography variant="body2">₹{orderData.pricing?.serviceFee || orderData.serviceFee || '0'}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">₹{orderData.pricing?.tax || orderData.tax || '0'}</Typography>
                </Box>
                
                {(orderData.pricing?.discount || orderData.discount || 0) > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="success.main">
                      Discount
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      -₹{orderData.pricing?.discount || orderData.discount || '0'}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{orderData.pricing?.total || orderData.total || '0'}
                  </Typography>
                </Box>
              </Box>

              {activeStep < 2 && (
                <Box mt={3}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      You'll be charged ₹{orderData.pricing?.total || orderData.total || '0'} when you complete your order.
                    </Typography>
                  </Alert>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;