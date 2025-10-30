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
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Phone
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object({
  identifier: yup.string().required('Email or phone is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

type FormData = {
  identifier: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setError('');
      await login(data);
      toast.success('Login successful!');
      navigate('/');
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast(`${provider} login coming soon!`, { icon: 'ℹ️' });
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
              Welcome Back! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your ZapEats account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email or Phone"
              {...register('identifier')}
              error={!!errors.identifier}
              helperText={errors.identifier?.message}
              sx={{ mb: 3 }}
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Social Login */}
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
              Continue with Google
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
              Continue with Facebook
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<Phone />}
              onClick={() => handleSocialLogin('Phone')}
              sx={{
                py: 1.5,
                borderColor: '#FF6B35',
                color: '#FF6B35',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.04)'
                }
              }}
            >
              Continue with Phone
            </Button>
          </Box>

          {/* Footer */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                color="primary"
                fontWeight="bold"
                underline="hover"
              >
                Sign up here
              </Link>
            </Typography>
          </Box>

          {/* Guest Access */}
          <Box textAlign="center" mt={2}>
            <Button
              variant="text"
              onClick={() => navigate('/')}
              color="primary"
            >
              Continue as Guest
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;