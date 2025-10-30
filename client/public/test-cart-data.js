// Test script to add valid cart items
// Run this in browser console on the checkout page to add valid test data

const addTestItemsToCart = () => {
  const validRestaurant = {
    id: "68fe6677c25dd029fae03c2c", // Pizza Palace
    name: "Pizza Palace"
  };

  const validCartItems = [
    {
      id: "68fe6678c25dd029fae03c38", // Margherita Pizza
      menuItemId: "68fe6678c25dd029fae03c38",
      name: "Margherita Pizza",
      price: 16.99,
      quantity: 1,
      restaurant: validRestaurant,
      customizations: [],
      itemTotal: 16.99
    },
    {
      id: "68fe6678c25dd029fae03c43", // Pepperoni Pizza  
      menuItemId: "68fe6678c25dd029fae03c43",
      name: "Pepperoni Pizza",
      price: 19.99,
      quantity: 2,
      restaurant: validRestaurant,
      customizations: [],
      itemTotal: 39.98
    }
  ];

  // Store in localStorage for testing
  localStorage.setItem('testCartItems', JSON.stringify(validCartItems));
  localStorage.setItem('testRestaurant', JSON.stringify(validRestaurant));
  
  console.log('✅ Test cart data saved!');
  console.log('Valid cart items:', validCartItems);
  console.log('Valid restaurant:', validRestaurant);
  console.log('You can now test the checkout with valid MongoDB ObjectIds');
  
  // Reload page to use test data
  alert('Test data added! Please refresh the page to use valid cart data.');
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  addTestItemsToCart();
}