import React, { useContext, useState } from "react";
import { CartContext } from "../Context/CartContextProvider";
import { createPayment } from "../services/MercadoPagoService";
import { validatePromoCode } from "../services/firestoreService";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { cartItems, calculateTotal } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      setError("Insira um código promocional válido.");
      return;
    }

    try {
      const discountValue = await validatePromoCode(promoCode);
      if (discountValue > 0) {
        setDiscount(discountValue);
        setError("");
      } else {
        setError("Código inválido ou expirado.");
      }
    } catch (err) {
      setError("Erro ao validar código promocional.");
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const totalWithDiscount = Math.max(0, calculateTotal() - discount);
      const paymentData = await createPayment(cartItems, totalWithDiscount);
      window.location.href = paymentData.init_point;
    } catch (error) {
      alert("Erro ao processar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Finalizar Reserva</h1>
      {cartItems.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className="summary">
            <h2>Resumo da Reserva</h2>
            {cartItems.map((item) => (
              <p key={item.id}>
                {item.name} - {item.quantity} hóspedes - R$ {item.price.toFixed(2)} por noite
              </p>
            ))}
            {discount > 0 && <h3 className="discount-info">Desconto Aplicado: R$ {discount.toFixed(2)}</h3>}
            <h2>Total a Pagar: R$ {Math.max(0, calculateTotal() - discount).toFixed(2)}</h2>
          </div>

          <div className="promo-code">
            <input
              type="text"
              placeholder="Insira o código promocional"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button onClick={applyPromoCode} disabled={!promoCode.trim()}>
              Aplicar Código
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>

          <button className="confirm-button" onClick={handlePayment} disabled={loading}>
            {loading ? "Processando..." : "Pagar com MercadoPago"}
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
