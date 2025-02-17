// src/components/CartSidebar.jsx
import React, { useContext, useState } from "react";
import { CartContext } from "../Context/CartContextProvider";
import { useNavigate } from "react-router-dom";
import "./CartSidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeItemFromCart, updateItemQuantity, calculateTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > item.maxPeople) {
      setErrorMessage(`Você não pode adicionar mais de ${item.maxPeople} pessoas para ${item.name}.`);
      return;
    }
    setErrorMessage("");
    updateItemQuantity(item.id, newQuantity);
  };

  return (
    <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
      <div className="cart-header">
        <h3>Meu Carrinho</h3>
        <button onClick={onClose} className="close-button">X</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {cartItems.length === 0 ? (
        <p className="empty-cart">Seu carrinho está vazio.</p>
      ) : (
        <div className="cart-content">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <p><strong>{item.name}</strong></p>
              <p>R$ {item.price.toFixed(2)} / noite</p>
              <p>Máx. Hóspedes: {item.maxPeople}</p>

              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span>{item.quantity} {item.quantity === 1 ? "hóspede" : "hóspedes"}</span>
                <button
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                  disabled={item.quantity >= item.maxPeople}
                >
                  +
                </button>
              </div>

              <button className="remove-button" onClick={() => removeItemFromCart(item.id)}>Remover</button>
            </div>
          ))}
          <div className="cart-footer">
            <h4>Total: R$ {calculateTotal().toFixed(2)}</h4>
            <button className="checkout-button" onClick={() => navigate("/checkout")}>Finalizar Reserva</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
