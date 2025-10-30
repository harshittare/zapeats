import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Import components
import Navbar from './components/Layout/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import RestaurantsPage from './pages/RestaurantsPage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';

// Context providers
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF6B35',
      light: '#FF8A65',
      dark: '#E65100'
    },
    secondary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }
      }
    }
  }
});

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router>
              <div className="App">
                <Navbar />
                <main style={{ minHeight: 'calc(100vh - 80px)' }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/restaurants" element={<RestaurantsPage />} />
                    <Route path="/restaurant/:id" element={<RestaurantDetailsPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/orders" element={<OrderHistoryPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                  </Routes>
                </main>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      borderRadius: '12px'
                    }
                  }}
                />
              </div>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
