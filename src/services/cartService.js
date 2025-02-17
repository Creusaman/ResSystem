export const cartService = {
    addItem(cartItems, newItem) {
      const existingItem = cartItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return cartItems.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...cartItems, { ...newItem, quantity: 1 }];
    },
  
    removeItem(cartItems, itemId) {
      return cartItems.filter(item => item.id !== itemId);
    },
  
    clearCart() {
      return [];
    },
  
    calculateTotal(cartItems) {
      return cartItems.reduce((total, item) => {
        let itemTotal = item.price * item.quantity;
        if (item.packageSuggestion) {
          itemTotal = Math.min(itemTotal, item.packageSuggestion.price);
        }
        return total + itemTotal;
      }, 0);
    }
  };
  