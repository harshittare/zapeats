import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
interface CartItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  restaurant: {
    id: string;
    name: string;
  };
  variant?: string;
  customizations?: {
    name: string;
    options: string[];
    additionalPrice: number;
  }[];
  itemTotal: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  restaurant: {
    id: string;
    name: string;
  } | null;
}

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'itemTotal'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  addTestItems: () => void;
  getItemById: (itemId: string) => CartItem | undefined;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'itemTotal'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_RESTAURANT'; payload: { id: string; name: string } };

// Helper function to calculate item total
const calculateItemTotal = (item: Omit<CartItem, 'itemTotal'>): number => {
  let total = item.price * item.quantity;
  
  if (item.customizations) {
    const customizationTotal = item.customizations.reduce(
      (sum, customization) => sum + customization.additionalPrice,
      0
    );
    total += customizationTotal * item.quantity;
  }
  
  return total;
};

// Helper function to calculate cart totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  
  return { totalItems, subtotal };
};

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  restaurant: null
};

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = {
        ...action.payload,
        itemTotal: calculateItemTotal(action.payload)
      };

      // Check if item already exists (same item with same customizations)
      const existingItemIndex = state.items.findIndex(
        item => 
          item.menuItemId === newItem.menuItemId &&
          item.variant === newItem.variant &&
          JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
      );

      let updatedItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
                itemTotal: calculateItemTotal({
                  ...item,
                  quantity: item.quantity + newItem.quantity
                })
              }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, newItem];
      }

      // If this is the first item or from a different restaurant, update restaurant
      const restaurant = state.restaurant || newItem.restaurant;

      const { totalItems, subtotal } = calculateTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotal,
        restaurant
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      const { totalItems, subtotal } = calculateTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotal,
        restaurant: updatedItems.length === 0 ? null : state.restaurant
      };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: itemId });
      }

      const updatedItems = state.items.map(item => 
        item.id === itemId 
          ? {
              ...item,
              quantity,
              itemTotal: calculateItemTotal({ ...item, quantity })
            }
          : item
      );

      const { totalItems, subtotal } = calculateTotals(updatedItems);

      return {
        ...state,
        items: updatedItems,
        totalItems,
        subtotal
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'SET_RESTAURANT':
      return {
        ...state,
        restaurant: action.payload
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item: Omit<CartItem, 'itemTotal'>) => {
    // If adding item from different restaurant, show confirmation
    if (state.restaurant && state.restaurant.id !== item.restaurant.id) {
      const confirmSwitch = window.confirm(
        `You have items from ${state.restaurant.name} in your cart. Adding items from ${item.restaurant.name} will clear your current cart. Continue?`
      );
      
      if (confirmSwitch) {
        dispatch({ type: 'CLEAR_CART' });
        dispatch({ type: 'ADD_ITEM', payload: item });
      }
    } else {
      dispatch({ type: 'ADD_ITEM', payload: item });
    }
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addTestItems = () => {
    // Add valid test items with proper MongoDB ObjectIds
    const testRestaurant = {
      id: "68fe6677c25dd029fae03c2c",
      name: "Pizza Palace"
    };

    const testItems = [
      {
        id: "68fe6678c25dd029fae03c38",
        menuItemId: "68fe6678c25dd029fae03c38",
        name: "Margherita Pizza",
        price: 16.99,
        quantity: 1,
        restaurant: testRestaurant,
        customizations: [],
        itemTotal: 16.99
      },
      {
        id: "68fe6678c25dd029fae03c43", 
        menuItemId: "68fe6678c25dd029fae03c43",
        name: "Pepperoni Pizza",
        price: 19.99,
        quantity: 1,
        restaurant: testRestaurant,
        customizations: [],
        itemTotal: 19.99
      }
    ];

    // Clear cart first
    dispatch({ type: 'CLEAR_CART' });

    // Add test items
    testItems.forEach(item => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    });

    // Set restaurant
    dispatch({ type: 'SET_RESTAURANT', payload: testRestaurant });
  };

  const getItemById = (itemId: string) => {
    return state.items.find(item => item.id === itemId);
  };

  const getTotalPrice = () => {
    return state.subtotal;
  };

  const getTotalItems = () => {
    return state.totalItems;
  };

  const value: CartContextType = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    addTestItems,
    getItemById,
    getTotalPrice,
    getTotalItems
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};