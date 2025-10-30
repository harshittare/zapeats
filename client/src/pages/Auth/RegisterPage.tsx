import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  IconButton,
  InputAdornment,
  Link,
  Tabs,
  Tab
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Email,
  Phone
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';

const emailSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

const phoneSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  phone: yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

type EmailFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type PhoneFormData = {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  const emailForm = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema)
  });

  const phoneForm = useForm<PhoneFormData>({
    resolver: yupResolver(phoneSchema)
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      toast.success('Registration successful!');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const onPhoneSubmit = async (data: PhoneFormData) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
      toast.success('Registration successful!');
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast(`${provider} signup coming soon!`, { icon: 'ℹ️' });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
          }}
        >
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              Join ZapEats! 🎉
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your account and start ordering
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Registration Method Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, newValue: number) => setTabValue(newValue)}
              variant="fullWidth"
            >
              <Tab icon={<Email />} label="Email" />
              <Tab icon={<Phone />} label="Phone" />
            </Tabs>
          </Box>

          {/* Email Registration Form */}
          {tabValue === 0 && (
            <Box component="form" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
              <TextField
                fullWidth
                label="Full Name"
                {...emailForm.register('name')}
                error={!!emailForm.formState.errors.name}
                helperText={emailForm.formState.errors.name?.message}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Email Address"
                type="email"
                {...emailForm.register('email')}
                error={!!emailForm.formState.errors.email}
                helperText={emailForm.formState.errors.email?.message}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...emailForm.register('password')}
                error={!!emailForm.formState.errors.password}
                helperText={emailForm.formState.errors.password?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...emailForm.register('confirmPassword')}
                error={!!emailForm.formState.errors.confirmPassword}
                helperText={emailForm.formState.errors.confirmPassword?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: '1.1rem',
                  borderRadius: 2
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>
          )}

          {/* Phone Registration Form */}
          {tabValue === 1 && (
            <Box component="form" onSubmit={phoneForm.handleSubmit(onPhoneSubmit)}>
              <TextField
                fullWidth
                label="Full Name"
                {...phoneForm.register('name')}
                error={!!phoneForm.formState.errors.name}
                helperText={phoneForm.formState.errors.name?.message}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                {...phoneForm.register('phone')}
                error={!!phoneForm.formState.errors.phone}
                helperText={phoneForm.formState.errors.phone?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      +1
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...phoneForm.register('password')}
                error={!!phoneForm.formState.errors.password}
                helperText={phoneForm.formState.errors.password?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...phoneForm.register('confirmPassword')}
                error={!!phoneForm.formState.errors.confirmPassword}
                helperText={phoneForm.formState.errors.confirmPassword?.message}
                sx={{ mb: 3 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  fontSize: '1.1rem',
                  borderRadius: 2
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </Box>
          )}

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Social Registration */}
          <Box display="flex" flexDirection="column" gap={2} mb={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('Google')}
              sx={{
                py: 1.5,
                borderColor: '#DB4437',
                color: '#DB4437',
                '&:hover': {
                  borderColor: '#DB4437',
                  backgroundColor: 'rgba(219, 68, 55, 0.04)'
                }
              }}
            >
              Sign up with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Facebook />}
              onClick={() => handleSocialLogin('Facebook')}
              sx={{
                py: 1.5,
                borderColor: '#4267B2',
                color: '#4267B2',
                '&:hover': {
                  borderColor: '#4267B2',
                  backgroundColor: 'rgba(66, 103, 178, 0.04)'
                }
              }}
            >
              Sign up with Facebook
            </Button>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                color="primary"
                fontWeight="bold"
                underline="hover"
              >
                Sign in here
              </Link>
            </Typography>
          </Box>

          {/* Terms */}
          <Box textAlign="center" mt={2}>
            <Typography variant="caption" color="text.secondary">
              By signing up, you agree to our{' '}
              <Link href="#" color="primary">Terms of Service</Link> and{' '}
              <Link href="#" color="primary">Privacy Policy</Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default RegisterPage;