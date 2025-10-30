import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Remove,
  Delete,
  LocalOffer,
  LocationOn,
  Payment,
  Schedule,
  ShoppingCart,
  ArrowBack,
  ExpandMore,
  CheckCircle,
  AccessTime,
  DeliveryDining,
  Person,
  Phone,
  Edit
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

// Mock addresses
const mockAddresses = [
  {
    id: '1',
    type: 'Home',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    zipCode: '10001',
    instructions: 'Ring doorbell twice'
  },
  {
    id: '2',
    type: 'Work',
    address: '456 Business Ave, Floor 12',
    city: 'New York',
    zipCode: '10002',
    instructions: 'Ask for John at reception'
  }
];

// Mock promo codes
const promoCodes = [
  { code: 'FIRST20', discount: 20, type: 'percentage', minOrder: 25 },
  { code: 'SAVE5', discount: 5, type: 'fixed', minOrder: 15 },
  { code: 'FREEDEL', discount: 0, type: 'free_delivery', minOrder: 20 }
];

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCart();
  
  const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0]);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [deliveryTime, setDeliveryTime] = useState('asap');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const subtotal = getTotalPrice();
  const deliveryFee = 2.99;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const tax = subtotal * 0.08; // 8% tax
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = subtotal * (appliedPromo.discount / 100);
    } else if (appliedPromo.type === 'fixed') {
      discount = appliedPromo.discount;
    }
  }
  
  const finalDeliveryFee = appliedPromo?.type === 'free_delivery' ? 0 : deliveryFee;
  const total = subtotal + finalDeliveryFee + serviceFee + tax - discount;

  const handleApplyPromo = () => {
    const promo = promoCodes.find(p => p.code === promoCode.toUpperCase());
    if (!promo) {
      toast.error('Invalid promo code');
      return;
    }
    
    if (subtotal < promo.minOrder) {
      toast.error(`Minimum order of $${promo.minOrder} required for this promo`);
      return;
    }
    
    setAppliedPromo(promo);
    setPromoCode('');
    setShowPromoDialog(false);
    toast.success(`Promo code applied: ${promo.code}`);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    if (total < 15) {
      toast.error('Minimum order amount is $15');
      return;
    }

    // Additional validation for payment methods
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }
    
    // Navigate to checkout
    navigate('/checkout', {
      state: {
        items,
        address: selectedAddress,
        promoCode: appliedPromo,
        deliveryTime,
        paymentMethod,
        specialInstructions,
        pricing: {
          subtotal,
          deliveryFee: finalDeliveryFee,
          serviceFee,
          tax,
          discount,
          total
        }
      }
    });

    toast.success('Proceeding to checkout...');
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Looks like you haven't added any items to your cart yet.
              <br />
              Explore restaurants and find something delicious!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/restaurants')}
              sx={{ mt: 2 }}
            >
              Browse Restaurants
            </Button>
          </motion.div>
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
          Your Cart ({getTotalItems()} items)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ py: 2 }}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={3} sm={2}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 8
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={6} sm={7}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.restaurant.name}
                          </Typography>
                          
                          {item.customizations && item.customizations.length > 0 && (
                            <Box mt={1}>
                              {item.customizations.map((customization) => (
                                <Typography
                                  key={customization.name}
                                  variant="caption"
                                  display="block"
                                  color="text.secondary"
                                >
                                  {customization.name}: {customization.options.join(', ')}
                                </Typography>
                              ))}
                            </Box>
                          )}
                          
                          <Typography variant="subtitle2" color="primary" sx={{ mt: 1 }}>
                            ₹{item.price * item.quantity}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={3} sm={3}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                              >
                                <Remove />
                              </IconButton>
                              <Typography sx={{ mx: 1, minWidth: 20, textAlign: 'center' }}>
                                {item.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Add />
                              </IconButton>
                            </Box>
                            
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                removeItem(item.id);
                                toast.success('Item removed from cart');
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>
                      <Divider sx={{ mt: 2 }} />
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Special Instructions */}
              <Box mt={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Special Instructions for Restaurant"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests for your order..."
                />
              </Box>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Delivery Details
              </Typography>
              
              {/* Address */}
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <LocationOn color="primary" />
                  <Box>
                    <Typography variant="subtitle2">
                      {selectedAddress.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedAddress.address}, {selectedAddress.city} {selectedAddress.zipCode}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setShowAddressDialog(true)}
                  startIcon={<Edit />}
                >
                  Change
                </Button>
              </Box>

              {/* Delivery Time */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Delivery Time</InputLabel>
                <Select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  label="Delivery Time"
                >
                  <MenuItem value="asap">ASAP (25-35 min)</MenuItem>
                  <MenuItem value="30min">In 30 minutes</MenuItem>
                  <MenuItem value="1hour">In 1 hour</MenuItem>
                  <MenuItem value="2hours">In 2 hours</MenuItem>
                </Select>
              </FormControl>

              {/* Payment Method */}
              <FormControl component="fieldset">
                <Typography variant="subtitle2" gutterBottom>
                  Payment Method
                </Typography>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio />}
                    label="Credit/Debit Card"
                  />
                  <FormControlLabel
                    value="gpay"
                    control={<Radio />}
                    label="Google Pay"
                  />
                  <FormControlLabel
                    value="cash"
                    control={<Radio />}
                    label="Cash on Delivery"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 20 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              {/* Pricing Breakdown */}
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">₹{subtotal}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Delivery Fee</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textDecoration: appliedPromo?.type === 'free_delivery' ? 'line-through' : 'none',
                      color: appliedPromo?.type === 'free_delivery' ? 'text.secondary' : 'inherit'
                    }}
                  >
                    ₹{deliveryFee}
                  </Typography>
                </Box>
                
                {appliedPromo?.type === 'free_delivery' && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="success.main">
                      Free Delivery
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      $0.00
                    </Typography>
                  </Box>
                )}
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Service Fee</Typography>
                  <Typography variant="body2">₹{serviceFee}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">₹{tax}</Typography>
                </Box>
                
                {discount > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="success.main">
                      Discount ({appliedPromo.code})
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      -₹{discount}
                    </Typography>
                  </Box>
                )}
                
                <Divider sx={{ my: 2 }} />
                
                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    ₹{total}
                  </Typography>
                </Box>
              </Box>

              {/* Promo Code */}
              <Box mb={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LocalOffer />}
                  onClick={() => setShowPromoDialog(true)}
                  sx={{ mb: 1 }}
                >
                  {appliedPromo ? `${appliedPromo.code} Applied` : 'Add Promo Code'}
                </Button>
                
                {appliedPromo && (
                  <Alert severity="success" sx={{ mt: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <span>Promo code applied successfully!</span>
                      <Button
                        size="small"
                        onClick={() => {
                          setAppliedPromo(null);
                          toast.success('Promo code removed');
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Alert>
                )}
              </Box>

              {/* Minimum Order Alert */}
              {total < 15 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Minimum order amount is ₹1249. Add ₹{1249 - total} more to proceed.
                </Alert>
              )}

              {/* Checkout Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleCheckout}
                disabled={total < 15}
                sx={{ py: 1.5 }}
              >
                Proceed to Checkout
              </Button>

              <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }}>
                Estimated delivery: 25-35 minutes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Address Selection Dialog */}
      <Dialog
        open={showAddressDialog}
        onClose={() => setShowAddressDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select Delivery Address</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={selectedAddress.id}
            onChange={(e) => {
              const address = mockAddresses.find(addr => addr.id === e.target.value);
              if (address) setSelectedAddress(address);
            }}
          >
            {mockAddresses.map((address) => (
              <FormControlLabel
                key={address.id}
                value={address.id}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle2">{address.type}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {address.address}, {address.city} {address.zipCode}
                    </Typography>
                    {address.instructions && (
                      <Typography variant="caption" color="text.secondary">
                        Instructions: {address.instructions}
                      </Typography>
                    )}
                  </Box>
                }
                sx={{ alignItems: 'flex-start', mb: 2 }}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddressDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setShowAddressDialog(false)}>
            Confirm Address
          </Button>
        </DialogActions>
      </Dialog>

      {/* Promo Code Dialog */}
      <Dialog
        open={showPromoDialog}
        onClose={() => setShowPromoDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Apply Promo Code</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Promo Code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            sx={{ mb: 3 }}
          />
          
          <Typography variant="subtitle2" gutterBottom>
            Available Promo Codes:
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {promoCodes.map((promo) => (
              <Chip
                key={promo.code}
                label={`${promo.code} - ${promo.type === 'percentage' ? `${promo.discount}% OFF` : 
                  promo.type === 'fixed' ? `$${promo.discount} OFF` : 'FREE DELIVERY'}`}
                onClick={() => setPromoCode(promo.code)}
                variant={promoCode === promo.code ? "filled" : "outlined"}
                size="small"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPromoDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleApplyPromo}
            disabled={!promoCode}
          >
            Apply Code
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CartPage;