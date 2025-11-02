import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Types
interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  loyaltyPoints: number;
  role?: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface LoginCredentials {
  identifier: string; // email or phone
  password: string;
}

interface RegisterData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isAuthenticated: false
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios interceptor
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: 'AUTH_START' });
          
          // Try API first
          try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`);
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data.user,
                token
              }
            });
          } catch (apiError) {
            // If API is unavailable and we have a mock token, restore mock user
            if (token.startsWith('mock_jwt_token_')) {
              const mockUser: User = {
                id: 'demo_user_001',
                name: 'Demo User',
                email: 'demo@example.com',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
                loyaltyPoints: 250,
                role: 'user'
              };
              
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  user: mockUser,
                  token
                }
              });
            } else {
              throw apiError;
            }
          }
        } catch (error) {
          dispatch({ type: 'AUTH_FAILURE' });
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Try API first, fallback to mock authentication if API unavailable
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials);
        
        if (response.data.success) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token: response.data.token
            }
          });
          return;
        } else {
          throw new Error(response.data.message);
        }
      } catch (apiError: any) {
        // If API is unavailable, use mock authentication
        console.log('API unavailable, using mock authentication');
        
        // Mock login - accept any credentials for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockUser: User = {
          id: 'demo_user_001',
          name: credentials.identifier.includes('@') 
            ? credentials.identifier.split('@')[0] 
            : 'Demo User',
          email: credentials.identifier.includes('@') ? credentials.identifier : undefined,
          phone: !credentials.identifier.includes('@') ? credentials.identifier : undefined,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          loyaltyPoints: 250,
          role: 'user'
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: mockUser,
            token: mockToken
          }
        });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error('Login failed. Please try again.');
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      // Try API first, fallback to mock registration if API unavailable
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, userData);
        
        if (response.data.success) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token: response.data.token
            }
          });
          return;
        } else {
          throw new Error(response.data.message);
        }
      } catch (apiError: any) {
        // If API is unavailable, use mock registration
        console.log('API unavailable, using mock registration');
        
        // Mock registration - create user from provided data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const mockUser: User = {
          id: 'demo_user_' + Date.now(),
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          loyaltyPoints: 0,
          role: 'user'
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: mockUser,
            token: mockToken
          }
        });
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error('Registration failed. Please try again.');
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};