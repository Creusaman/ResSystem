import React, { createContext, useState, useEffect } from "react";
import { cartService } from "../services/cartService";

export const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("reservationCart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erro ao carregar o carrinho do localStorage:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("reservationCart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Erro ao salvar o carrinho no localStorage:", error);
    }
  }, [cartItems]);

  const addItemToCart = (item) => {
    setCartItems(prev => cartService.addItem(prev, item));
  };

  const removeItemFromCart = (itemId) => {
    setCartItems(prev => cartService.removeItem(prev, itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartService.calculateTotal(cartItems);
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, clearCart, calculateTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
