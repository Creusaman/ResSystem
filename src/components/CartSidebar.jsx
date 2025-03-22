// src/components/CartSidebar.jsx
import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../Context/CartContextProvider";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import { 
  FaShoppingCart, 
  FaTimes, 
  FaTrash, 
  FaExclamationCircle, 
  FaEdit, 
  FaArrowRight, 
  FaUser, 
  FaBaby, 
  FaSyncAlt,
  FaCalendarAlt,
  FaSave,
  FaUndoAlt,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import "./CartSidebar.css";

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeItemFromCart, updateItemQuantity, calculateTotal, updateCartItem } = useContext(CartContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [allAvailable, setAllAvailable] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    adults: 1,
    children: 0,
    startDate: null,
    endDate: null
  });

  // Verifica disponibilidade quando o carrinho é aberto
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      refreshAvailability();
    }
  }, [isOpen, cartItems]);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > item.maxPeople) {
      setErrorMessage(`Você não pode adicionar mais de ${item.maxPeople} pessoas para ${item.name}.`);
      return;
    }
    setErrorMessage("");
    updateItemQuantity(item.id, newQuantity);
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditFormData({
      adults: item.adults || 1,
      children: item.children || 0,
      startDate: item.startDate ? new Date(item.startDate) : null,
      endDate: item.endDate ? new Date(item.endDate) : null
    });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditFormData({
      adults: 1,
      children: 0,
      startDate: null,
      endDate: null
    });
  };

  const handleSaveEdit = (item) => {
    // Validar as datas
    if (!editFormData.startDate || !editFormData.endDate) {
      setErrorMessage("As datas de check-in e check-out são obrigatórias.");
      return;
    }

    if (editFormData.startDate >= editFormData.endDate) {
      setErrorMessage("A data de check-in deve ser anterior à data de check-out.");
      return;
    }

    // Validar número de hóspedes
    const totalGuests = editFormData.adults + editFormData.children;
    if (totalGuests <= 0) {
      setErrorMessage("Deve haver pelo menos um hóspede.");
      return;
    }

    if (totalGuests > item.maxPeople) {
      setErrorMessage(`O número máximo de hóspedes para ${item.name} é ${item.maxPeople}.`);
      return;
    }

    // Atualizar o item
    const updatedItem = {
      ...item,
      adults: editFormData.adults,
      children: editFormData.children,
      startDate: editFormData.startDate,
      endDate: editFormData.endDate
    };

    updateCartItem(item.id, updatedItem);
    setEditingItemId(null);
    refreshAvailability();
  };

  const handleEditFormChange = (field, value) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });
  };

  const refreshAvailability = async () => {
    if (cartItems.length === 0) return;
    
    setIsLoading(true);
    try {
      // Aqui implementaríamos a verificação real de disponibilidade
      // Para este exemplo, vamos apenas simular com um timer
      
      // Simula verificação com 70% de chance de estar disponível
      await new Promise(resolve => setTimeout(resolve, 1000));
      const available = Math.random() > 0.3;
      
      setAllAvailable(available);
      if (!available) {
        setErrorMessage("Algumas acomodações não estão mais disponíveis.");
      } else {
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error);
      setErrorMessage("Erro ao verificar disponibilidade.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!allAvailable) {
      setErrorMessage("Remova os itens indisponíveis antes de finalizar.");
      return;
    }
    
    navigate("/checkout");
    onClose();
  };

  const renderPersonIcons = (item) => {
    const { adults = 1, children = 0 } = item;
    
    return (
      <div className="person-icons">
        {Array.from({ length: adults }).map((_, i) => (
          <div 
            key={`adult-${i}`} 
            className="person-icon adult"
            title="Adulto"
          >
            <FaUser />
          </div>
        ))}
        {Array.from({ length: children }).map((_, i) => (
          <div 
            key={`child-${i}`} 
            className="person-icon child"
            title="Criança"
          >
            <FaBaby />
          </div>
        ))}
      </div>
    );
  };

  const calculateItemPrice = (item) => {
    if (!item.startDate || !item.endDate) return item.price;
    
    const diffTime = Math.abs(new Date(item.endDate) - new Date(item.startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return item.price * diffDays;
  };

  return (
    <div className={`cart-sidebar-container ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <>
          <div className="cart-sidebar">
            <div className="cart-header">
              <div className="cart-title">
                <FaShoppingCart className="cart-icon" />
                <h3>Meu Carrinho</h3>
                {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
              </div>
              <button onClick={onClose} className="close-button">
                <FaTimes />
              </button>
            </div>

            {errorMessage && (
              <div className="error-message">
                <FaExclamationCircle />
                <p>{errorMessage}</p>
              </div>
            )}

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">
                  <FaShoppingCart />
                </div>
                <p className="empty-cart-text">Seu carrinho está vazio.</p>
                <p className="empty-cart-subtext">Adicione acomodações para continuar.</p>
              </div>
            ) : (
              <>
                <div className="cart-content">
                  <div className="cart-items">
                    {cartItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`cart-item ${!item.available ? "unavailable" : ""} ${editingItemId === item.id ? "editing" : ""}`}
                      >
                        <div className="cart-item-header">
                          <div className="cart-item-image">
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <div className="placeholder-image">
                                <FaShoppingCart />
                              </div>
                            )}
                          </div>
                          <div className="cart-item-info">
                            <div className="cart-item-name-row">
                              <h4>{item.name}</h4>
                              <div className="cart-item-actions">
                                {editingItemId === item.id ? (
                                  <>
                                    <button 
                                      className="save-button" 
                                      onClick={() => handleSaveEdit(item)}
                                      title="Salvar alterações"
                                    >
                                      <FaSave />
                                    </button>
                                    <button 
                                      className="cancel-button" 
                                      onClick={handleCancelEdit}
                                      title="Cancelar edição"
                                    >
                                      <FaUndoAlt />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      className="edit-button" 
                                      onClick={() => handleEditClick(item)}
                                      title="Editar reserva"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button 
                                      className="remove-button" 
                                      onClick={() => removeItemFromCart(item.id)}
                                      title="Remover do carrinho"
                                    >
                                      <FaTrash />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            {editingItemId !== item.id ? (
                              <>
                                <p className="cart-item-guests">
                                  {item.adults || 1} adulto{(item.adults || 1) !== 1 && 's'}
                                  {item.children > 0 && `, ${item.children} criança${item.children !== 1 && 's'}`}
                                </p>
                                {renderPersonIcons(item)}
                              </>
                            ) : (
                              <div className="edit-form-guests">
                                <div className="edit-form-guest-group">
                                  <label>Adultos:</label>
                                  <div className="edit-form-counter">
                                    <button onClick={() => handleEditFormChange('adults', Math.max(1, editFormData.adults - 1))}>-</button>
                                    <span>{editFormData.adults}</span>
                                    <button onClick={() => handleEditFormChange('adults', editFormData.adults + 1)}>+</button>
                                  </div>
                                </div>
                                <div className="edit-form-guest-group">
                                  <label>Crianças:</label>
                                  <div className="edit-form-counter">
                                    <button onClick={() => handleEditFormChange('children', Math.max(0, editFormData.children - 1))}>-</button>
                                    <span>{editFormData.children}</span>
                                    <button onClick={() => handleEditFormChange('children', editFormData.children + 1)}>+</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="cart-item-details">
                          {editingItemId !== item.id ? (
                            // Visualização normal
                            <>
                              {item.startDate && item.endDate && (
                                <div className="cart-item-dates">
                                  <p>Check-in: {new Date(item.startDate).toLocaleDateString('pt-BR')}</p>
                                  <p>Check-out: {new Date(item.endDate).toLocaleDateString('pt-BR')}</p>
                                </div>
                              )}
                              
                              <div className="cart-item-price">
                                <span className="price-label">Valor:</span>
                                <span className="price-value">
                                  R$ {calculateItemPrice(item).toFixed(2)}
                                </span>
                              </div>
                              
                              <div className="cart-item-quantity">
                                <span>Hóspedes:</span>
                                <div className="quantity-controls">
                                  <button
                                    onClick={() => handleQuantityChange(item, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity === 1}
                                  >
                                    -
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button
                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                    disabled={item.quantity >= item.maxPeople}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : (
                            // Modo de edição
                            <div className="edit-form-dates">
                              <div className="edit-form-date-group">
                                <label><FaCalendarAlt /> Check-in:</label>
                                <DatePicker
                                  selected={editFormData.startDate}
                                  onChange={(date) => handleEditFormChange('startDate', date)}
                                  selectsStart
                                  startDate={editFormData.startDate}
                                  endDate={editFormData.endDate}
                                  minDate={new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="edit-form-datepicker"
                                />
                              </div>
                              <div className="edit-form-date-group">
                                <label><FaCalendarAlt /> Check-out:</label>
                                <DatePicker
                                  selected={editFormData.endDate}
                                  onChange={(date) => handleEditFormChange('endDate', date)}
                                  selectsEnd
                                  startDate={editFormData.startDate}
                                  endDate={editFormData.endDate}
                                  minDate={editFormData.startDate || new Date()}
                                  dateFormat="dd/MM/yyyy"
                                  className="edit-form-datepicker"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cart-refresh">
                    <button 
                      className="refresh-button" 
                      onClick={refreshAvailability}
                      disabled={isLoading}
                    >
                      <FaSyncAlt className={isLoading ? "spinning" : ""} />
                      <span>{isLoading ? "Verificando..." : "Verificar disponibilidade"}</span>
                    </button>
                  </div>
                </div>

                <div className="cart-footer">
                  <div className="cart-summary">
                    <div className="cart-total">
                      <span>Total:</span>
                      <span>R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="cart-actions">
                    <button 
                      className="clear-cart-button" 
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja limpar o carrinho?')) {
                          cartItems.forEach(item => removeItemFromCart(item.id));
                        }
                      }}
                    >
                      Limpar Carrinho
                    </button>
                    <button 
                      className="checkout-button"
                      onClick={handleCheckout}
                      disabled={!allAvailable || cartItems.length === 0}
                    >
                      <span>Finalizar Reserva</span>
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="cart-overlay" onClick={onClose}></div>
        </>
      )}
    </div>
  );
};

export default CartSidebar;
