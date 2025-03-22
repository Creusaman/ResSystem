import React, { useState, useEffect, useContext } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  FaWifi, FaSnowflake, FaParking, FaShower, FaUtensils, 
  FaSwimmingPool, FaPlus, FaTv, FaCoffee, FaToilet, 
  FaChair, FaWheelchair, FaDog, FaInfoCircle, 
  FaMapMarkerAlt, FaCheck, FaExclamationTriangle, 
  FaExpand, FaTimes, FaShoppingCart, FaUser, FaMinus,
  FaHotTub, FaBed, FaArrowRight
} from 'react-icons/fa';
import { LuAirVent } from "react-icons/lu";
import { GiCctvCamera, GiBarbecue } from "react-icons/gi";
import { PiBathtub, PiFan } from "react-icons/pi";
import { SlEnergy } from "react-icons/sl";
import { TbCoffee } from "react-icons/tb";
import { FaKitchenSet } from "react-icons/fa6";
import { fetchRulesForAccommodation, calculateAccommodationAvailability } from '../services/firestoreService';
import { CartContext } from "../Context/CartContextProvider";
import YouTube from 'react-youtube';
import "./EnhancedAccommodationCard.css";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Lista de comodidades com os mesmos IDs e ícones da página de criação
const amenitiesList = [
  { id: "Wi-Fi", label: "Wi-Fi", icon: <FaWifi /> },
  { id: "TV", label: "TV", icon: <FaTv /> },
  { id: "Café da Manhã", label: "Café da Manhã", icon: <TbCoffee /> },
  { id: "Piscina com Cascata", label: "Piscina com Cascata", icon: <FaSwimmingPool /> },
  { id: "Cama King Size", label: "Cama King Size", icon: <FaBed /> },
  { id: "Chuveiro Quente", label: "Chuveiro Quente", icon: <FaShower /> },
  { id: "Tomadas", label: "Tomadas", icon: <SlEnergy /> },
  { id: "Segurança", label: "Segurança", icon: <GiCctvCamera /> },
  { id: "Ventilador de Teto", label: "Ventilador de Teto", icon: <PiFan /> },
  { id: "Ar Condicionado", label: "Ar Condicionado", icon: <LuAirVent /> },
  { id: "Hidromassagem", label: "Hidromassagem", icon: <PiBathtub /> },
  { id: "Cozinha Comunitária", label: "Cozinha Comunitária", icon: <FaUtensils /> },
  { id: "Churrasqueira", label: "Churrasqueira", icon: <GiBarbecue /> },
  { id: "Spa", label: "Spa", icon: <FaHotTub /> },
];

function EnhancedAccommodationCard({ accommodation, onSelect, globalStartDate, globalEndDate }) {
  const [expanded, setExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  const [totalPrice, setTotalPrice] = useState(null);
  const [dailyPrices, setDailyPrices] = useState([]);
  const [unavailableDays, setUnavailableDays] = useState([]);
  const [availabilityDetails, setAvailabilityDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [rules, setRules] = useState([]);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [startDate, setStartDate] = useState(globalStartDate || null);
  const [endDate, setEndDate] = useState(globalEndDate || null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [datesSelected, setDatesSelected] = useState(false);
  
  const { addItemToCart, cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  
  // Carregar regras da acomodação apenas quando as datas forem selecionadas
  useEffect(() => {
    const loadRules = async () => {
      if (accommodation?.id && startDate && endDate) {
        try {
          const rulesData = await fetchRulesForAccommodation(
            accommodation.id, 
            startDate.toISOString().split('T')[0], 
            endDate.toISOString().split('T')[0]
          );
          setRules(rulesData);
        } catch (error) {
          console.error("Erro ao carregar regras da acomodação:", error);
        }
      }
    };
    
    loadRules();
  }, [accommodation?.id, startDate, endDate]);
  
  // Verificar disponibilidade quando as datas mudarem
  useEffect(() => {
    if (startDate && endDate && accommodation) {
      setDatesSelected(true);
      checkAvailability(startDate, endDate);
    } else {
      setDatesSelected(false);
      setIsAvailable(null);
      setTotalPrice(null);
      setDailyPrices([]);
      setUnavailableDays([]);
      setAvailabilityDetails(null);
    }
  }, [startDate, endDate, accommodation]);

  // Usar datas globais quando disponíveis
  useEffect(() => {
    if (globalStartDate) setStartDate(globalStartDate);
    if (globalEndDate) setEndDate(globalEndDate);
    
    if (globalStartDate && globalEndDate) {
      setDatesSelected(true);
    }
  }, [globalStartDate, globalEndDate]);

  const handleExpand = () => {
    setIsAnimating(true);
    setExpanded(true);
  };

  const handleCollapse = () => {
    setIsAnimating(true);
    setExpanded(false);
  };

  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };
  
  const getVideoId = (url) => {
    // Extrair o ID do vídeo do YouTube
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  const checkAvailability = async (start, end) => {
    if (!start || !end || !accommodation) return;
    
    try {
      setIsLoading(true);
      console.log(`[${accommodation.name}] Verificando disponibilidade entre ${start.toLocaleDateString()} e ${end.toLocaleDateString()}`);
      
      // Verificar se as datas são válidas
      if (start >= end) {
        console.log(`[${accommodation.name}] Datas inválidas: check-in deve ser antes do check-out`);
        setIsAvailable(false);
        setTotalPrice(null);
        setDailyPrices([]);
        setUnavailableDays([]);
        setAvailabilityDetails(null);
        setIsLoading(false);
        return;
      }
      
      // Calcular a diferença em dias
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) {
        console.log(`[${accommodation.name}] Datas inválidas: período deve ser de pelo menos 1 dia`);
        setIsAvailable(false);
        setTotalPrice(null);
        setDailyPrices([]);
        setUnavailableDays([]);
        setAvailabilityDetails(null);
        setIsLoading(false);
        return;
      }
      
      try {
        // Usar a função do firestoreService para verificar disponibilidade
        const availability = await calculateAccommodationAvailability(
          accommodation.id,
          start.toISOString().split('T')[0],
          end.toISOString().split('T')[0]
        );
        
        console.log(`[${accommodation.name}] Resultado da verificação:`, {
          disponivel: availability.isAvailable,
          preco: availability.totalPrice,
          diasComPrecos: availability.dailyPrices.length,
          diasSemRegras: availability.daysWithoutRules.length,
          mensagem: availability.unavailableDaysMessage
        });
        
        setIsAvailable(availability.isAvailable);
        setTotalPrice(availability.totalPrice);
        setDailyPrices(availability.dailyPrices);
        setUnavailableDays(availability.unavailableDays);
        setAvailabilityDetails(availability);
      } catch (error) {
        console.error(`[${accommodation.name}] Erro ao verificar disponibilidade:`, error);
        
        // Sempre marcar como indisponível em caso de erro
        setIsAvailable(false);
        setTotalPrice(null);
        setDailyPrices([]);
        setUnavailableDays([]);
        setAvailabilityDetails(null);
      }
    } catch (error) {
      console.error(`[${accommodation.name}] Erro ao verificar disponibilidade:`, error);
      setIsAvailable(false);
      setTotalPrice(null);
      setDailyPrices([]);
      setUnavailableDays([]);
      setAvailabilityDetails(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddToCart = async () => {
    if (!isAvailable || !startDate || !endDate) {
      toast.error("Por favor, selecione datas válidas para verificar a disponibilidade.");
      return;
    }
    
    // Verificar se é a última vaga disponível
    const isLastAvailable = availabilityDetails && 
                           availabilityDetails.maxUnits && 
                           dailyPrices.some(day => day.availableUnits === 1);
    
    // Verificar se esta acomodação já está no carrinho para as mesmas datas
    const isAlreadyInCart = cartItems.some(item => 
      item.id === accommodation.id && 
      new Date(item.startDate).getTime() === startDate.getTime() && 
      new Date(item.endDate).getTime() === endDate.getTime()
    );
    
    if (isAlreadyInCart) {
      toast.error("Esta acomodação já está no seu carrinho para as datas selecionadas.");
      return;
    }
    
    // Se for a última disponível e já estiver no carrinho (para outras datas), mostrar aviso
    if (isLastAvailable && cartItems.some(item => item.id === accommodation.id)) {
      toast.warning("Atenção: Esta é a última vaga disponível para esta acomodação.");
    }
    
    // Adicionar ao carrinho
    const item = {
      id: accommodation.id,
      name: accommodation.name,
      price: totalPrice || accommodation.price,
      isPriceTotal: true, // Indica que o preço já é o total para o período
      maxPeople: accommodation.maxPeople || 2,
      quantity: 1, // Sempre 1 para manter cada acomodação como item individual
      startDate: startDate,
      endDate: endDate,
      image: getFirstImageUrl(), // Usar método auxiliar para pegar a primeira imagem
      adults: adults,
      children: children,
      available: true
    };
    
    const success = await addItemToCart(item);
    if (success) {
      handleCollapse();
    }
  };

  // Método auxiliar para pegar a primeira imagem disponível
  const getFirstImageUrl = () => {
    // Verificar se existe media no formato novo (array de objetos com type e src)
    if (accommodation.media && accommodation.media.length > 0) {
      const mediaItem = accommodation.media.find(item => item.type === 'image') || accommodation.media[0];
      return mediaItem.src;
    }
    
    // Verificar formato antigo (files - array de objetos com url)
    if (accommodation.files && accommodation.files.length > 0) {
      return accommodation.files[0].url;
    }
    
    // Verificar formato alternativo (images - array de strings)
    if (accommodation.images && accommodation.images.length > 0) {
      return accommodation.images[0];
    }
    
    // Retorna null se não encontrar imagens
    return null;
  };
  
  const handlePersonChange = (type, operation) => {
    if (type === 'adults') {
      if (operation === 'increase') {
        setAdults(prev => Math.min(prev + 1, accommodation.maxPeople || 4));
      } else {
        setAdults(prev => Math.max(1, prev - 1));
      }
    } else if (type === 'children') {
      if (operation === 'increase') {
        const maxChildren = Math.max(0, (accommodation.maxPeople || 4) - adults);
        setChildren(prev => Math.min(prev + 1, maxChildren));
      } else {
        setChildren(prev => Math.max(0, prev - 1));
      }
    }
  };
  
  const renderAvailabilityBadge = () => {
    if (isLoading) {
      return (
        <div className="accommodation-badge neutral">
          <div className="loading-spinner"></div> Verificando...
        </div>
      );
    } else if (isAvailable === null) {
      return (
        <div className="accommodation-badge neutral">
          Selecione datas
        </div>
      );
    } else if (isAvailable) {
      // Mostrar quantidade de vagas disponíveis
      const availableUnits = availabilityDetails?.maxUnits - (availabilityDetails?.dailyPrices?.[0]?.reservedUnits || 0);
      
      if (availableUnits <= 1) {
        return (
          <div className="accommodation-badge available urgent">
            <FaExclamationTriangle className="badge-icon" /> Última vaga disponível!
          </div>
        );
      } else if (availableUnits <= 3) {
        return (
          <div className="accommodation-badge available limited">
            <FaExclamationTriangle className="badge-icon" /> Apenas {availableUnits} vagas disponíveis!
          </div>
        );
      } else {
        return (
          <div className="accommodation-badge available">
            <FaCheck className="badge-icon" /> Disponível
          </div>
        );
      }
    } else {
      return (
        <div className="accommodation-badge unavailable">
          <FaExclamationTriangle className="badge-icon" /> 
          {availabilityDetails?.unavailableDaysMessage 
            ? 'Indisponível nas datas selecionadas' 
            : 'Indisponível'}
        </div>
      );
    }
  };
  
  const renderAmenities = () => {
    if (!accommodation || !accommodation.amenities || accommodation.amenities.length === 0) {
      return <p className="no-amenities">Sem comodidades listadas</p>;
    }
    
    const getAmenityIcon = (amenityId) => {
      const amenity = amenitiesList.find(item => item.id === amenityId);
      return amenity ? amenity.icon : <FaCheck />;
    };
    
    const displayAmenities = showAllAmenities 
      ? accommodation.amenities 
      : accommodation.amenities.slice(0, expanded ? 8 : 3);
    
    return (
      <div className="amenities-list">
        {displayAmenities.map((amenityId, index) => {
          const id = typeof amenityId === 'object' ? amenityId.id || amenityId.name : amenityId;
          const name = typeof amenityId === 'object' ? amenityId.name || id : id;
          
          return (
            <div 
              key={`amenity-${index}`} 
              className="amenity-item"
              title={name}
            >
              {getAmenityIcon(id)}
            </div>
          );
        })}
        
        {!showAllAmenities && accommodation.amenities.length > (expanded ? 8 : 3) && (
          <button 
            className="more-amenities-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowAllAmenities(true);
            }}
          >
            <FaPlus />
            <span>Ver mais</span>
          </button>
        )}
      </div>
    );
  };
  
  const renderMedia = () => {
    if (!accommodation) {
      return (
        <div className="default-image">
          <p>Imagem não disponível</p>
        </div>
      );
    }
    
    // Função para normalizar itens de mídia em um formato comum
    const normalizeMediaItems = () => {
      const mediaItems = [];
      
      // Formato novo: media array com objetos {type, src}
      if (accommodation.media && accommodation.media.length > 0) {
        return accommodation.media;
      }
      
      // Formato antigo: files array com objetos {url, type}
      if (accommodation.files && accommodation.files.length > 0) {
        accommodation.files.forEach(file => {
          const isVideo = file.url && (file.url.includes('youtube.com') || file.url.includes('youtu.be'));
          mediaItems.push({
            type: isVideo ? 'video' : 'image',
            src: file.url
          });
        });
        return mediaItems;
      }
      
      // Formato alternativo: images array de strings
      if (accommodation.images && accommodation.images.length > 0) {
        accommodation.images.forEach(img => {
          mediaItems.push({
            type: 'image',
            src: img
          });
        });
        return mediaItems;
      }
      
      return [];
    };
    
    const mediaItems = normalizeMediaItems();
    
    if (mediaItems.length === 0) {
      return (
        <div className="default-image">
          <p>Imagem não disponível</p>
        </div>
      );
    }
    
    return (
      <Carousel
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        infiniteLoop={true}
        dynamicHeight={false}
        className="accommodation-carousel"
        selectedItem={activeMediaIndex}
        onChange={setActiveMediaIndex}
        showThumbs={false}
      >
        {mediaItems.map((item, index) => {
          if (item.type === 'image') {
            return (
              <div key={`slide-${index}`} className="carousel-item">
                <img 
                  src={item.src} 
                  alt={`Imagem ${index + 1} de ${accommodation.name}`} 
                />
              </div>
            );
          } else if (item.type === 'video') {
            const videoId = getVideoId(item.src);
            return (
              <div key={`slide-${index}`} className="video-container">
                <YouTube
                  videoId={videoId}
                  opts={{
                    height: '100%',
                    width: '100%',
                    playerVars: {
                      autoplay: 0,
                      controls: 1,
                      modestbranding: 1,
                      rel: 0,
                    },
                  }}
                />
              </div>
            );
          }
          return null;
        })}
      </Carousel>
    );
  };
  
  const PersonCounter = ({ label, value, onChange }) => {
    return (
      <div className="person-counter">
        <span className="person-label">{label}</span>
        <div className="counter-controls">
          <button 
            className="counter-btn" 
            onClick={() => onChange('decrease')}
            disabled={label === 'Adultos' ? value <= 1 : value <= 0}
          >
            <FaMinus />
          </button>
          <span className="counter-value">{value}</span>
          <button 
            className="counter-btn" 
            onClick={() => onChange('increase')}
            disabled={adults + children >= (accommodation.maxPeople || 4)}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    );
  };

  // Adicionar função de reserva direta
  const handleReserveNow = () => {
    if (isAvailable) {
      // Adicionar ao carrinho
      handleAddToCart();
      // Redirecionar para checkout
      navigate("/checkout");
    }
  };

  return (
    <div 
      className={`room-card ${expanded ? 'expanded' : ''} ${isAnimating ? 'animating' : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="room-media">
        {renderMedia()}
        {expanded && (
          <button
            className="close-btn"
            onClick={handleCollapse}
          >
            <FaTimes />
          </button>
        )}
      </div>
      
      <div className="room-content">
        <div className="room-header">
          <div className="room-title-section">
            <h3 className="room-title">{accommodation.name}</h3>
            <div className="room-location">
              <FaMapMarkerAlt />
              <span>{accommodation.location || 'Pousada Dunas'}</span>
            </div>
          </div>
          
          <div className="room-badges">
            {renderAvailabilityBadge()}
            {accommodation.tags && accommodation.tags.slice(0, 1).map((tag, index) => (
              <div key={`tag-${index}`} className={`room-badge ${tag.toLowerCase()}`}>
                {tag}
              </div>
            ))}
          </div>
        </div>
        
        <p className="room-description">
          {accommodation.description 
            ? (expanded 
              ? accommodation.description 
              : `${accommodation.description.substring(0, 100)}${accommodation.description.length > 100 ? '...' : ''}`) 
            : 'Sem descrição disponível.'}
        </p>
        
        <div className="room-amenities">
          {renderAmenities()}
        </div>
        
        <div className="room-price-section">
          <div className="price-display">
            {datesSelected && totalPrice !== null ? (
              <>
                <span className="price-value">R$ {totalPrice.toFixed(2)}</span>
                <span className="price-period">total para {dailyPrices.length} {dailyPrices.length === 1 ? 'noite' : 'noites'}</span>
              </>
            ) : (
              <>
                <span className="price-value">R$ {accommodation.price?.toFixed(2)}</span>
                <span className="price-period">/ noite</span>
              </>
            )}
          </div>
          <div className="capacity-info">
            <span className="capacity-text">
              <FaUser className="capacity-icon" /> 
              Para até {accommodation.maxPeople || 2} {(accommodation.maxPeople || 2) > 1 ? 'pessoas' : 'pessoa'}
            </span>
          </div>
        </div>
        
        {expanded ? (
          <div className="expanded-details">
            <div className="details-section">
              <h4 className="section-title">Detalhes da Reserva</h4>
              
              <div className="date-selector">
                <div className="date-field">
                  <label>Check-in</label>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    placeholderText="Chegada"
                    dateFormat="dd/MM/yyyy"
                    className="date-input"
                  />
                </div>
                
                <div className="date-field">
                  <label>Check-out</label>
                  <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate || new Date()}
                    placeholderText="Saída"
                    dateFormat="dd/MM/yyyy"
                    className="date-input"
                  />
                </div>
              </div>
              
              <div className="guests-selector">
                <h5 className="section-subtitle">Hóspedes</h5>
                <div className="guests-controls">
                  <PersonCounter
                    label="Adultos"
                    value={adults}
                    onChange={(operation) => handlePersonChange('adults', operation)}
                  />
                  <PersonCounter
                    label="Crianças"
                    value={children}
                    onChange={(operation) => handlePersonChange('children', operation)}
                  />
                </div>
              </div>
              
              {!datesSelected ? (
                <div className="no-dates-message">
                  <p>Selecione as datas de check-in e check-out para ver disponibilidade e preços</p>
                </div>
              ) : isLoading ? (
                <div className="availability-loading">
                  <div className="loading-spinner-large"></div>
                  <p>Verificando disponibilidade...</p>
                </div>
              ) : totalPrice !== null ? (
                <div className="availability-details">
                  <div className="total-price">
                    <span className="total-label">Total para {dailyPrices.length} {dailyPrices.length === 1 ? 'noite' : 'noites'}:</span>
                    <span className="total-value">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                  
                  {availabilityDetails && (
                    <div className="stay-period">
                      <span>Estadia de {startDate.toLocaleDateString('pt-BR')} até {endDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  {availabilityDetails && availabilityDetails.maxUnits && (
                    <div className="availability-units">
                      <span className="units-available">
                        {availabilityDetails.maxUnits} unidade(s) disponíveis
                      </span>
                    </div>
                  )}
                  
                  {availabilityDetails && availabilityDetails.unavailableDaysMessage && (
                    <div className="unavailable-days-message">
                      <FaExclamationTriangle className="warning-icon" />
                      <span>{availabilityDetails.unavailableDaysMessage}</span>
                    </div>
                  )}
                  
                  {availabilityDetails && availabilityDetails.packageInfo && 
                    Object.keys(availabilityDetails.packageInfo).length > 0 && (
                    <div className="package-info">
                      <h5 className="section-subtitle">Informações de Pacotes</h5>
                      {Object.entries(availabilityDetails.packageInfo).map(([packageType, info]) => {
                        // Pular pacotes de diárias
                        if (packageType === 'Diárias') return null;
                        
                        return (
                          <div key={packageType} className="package-item">
                            <div className="package-header">
                              <span className="package-type">{packageType}</span>
                              <span className="package-days">{info.days} dias utilizados</span>
                            </div>
                            {info.unusedDays > 0 && info.suggestionMessage && (
                              <div className="package-suggestion">
                                <p>{info.suggestionMessage}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
              
              {datesSelected && isAvailable !== null && (
                <div className="card-action-buttons">
                  <button 
                    className={`reserve-now-btn ${!isAvailable ? 'disabled' : 'available'}`}
                    onClick={handleReserveNow}
                    disabled={!isAvailable}
                  >
                    <FaArrowRight className="btn-icon" />
                    <span>Reservar Agora</span>
                  </button>
                  
                  <button 
                    className={`add-to-cart-btn ${!isAvailable ? 'disabled' : 'available'}`}
                    onClick={handleAddToCart}
                    disabled={!isAvailable}
                  >
                    <FaShoppingCart className="btn-icon" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>
              )}
            </div>
            
            {rules && rules.length > 0 && (
              <div className="rules-section">
                <h4 className="section-title">Regras</h4>
                <ul className="rules-list">
                  {rules.map((rule, index) => (
                    <li key={`rule-${index}`} className="rule-item">
                      <FaInfoCircle className="rule-icon" />
                      <span>{rule.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <>
            {!datesSelected ? (
              <div className="no-dates-message">
                <p>Selecione as datas de check-in e check-out para ver disponibilidade e preços</p>
              </div>
            ) : (
              <div className="card-action-buttons">
                {isAvailable === true && (
                  <button 
                    className="reserve-now-btn available"
                    onClick={handleExpand}
                  >
                    <FaArrowRight className="btn-icon" />
                    <span>Reservar Agora</span>
                  </button>
                )}
                
                <button 
                  className={`reserve-btn ${isAvailable === true ? 'available' : 'disabled'}`}
                  onClick={handleExpand}
                  disabled={!isAvailable}
                >
                  {isAvailable === true ? (
                    <>
                      <FaShoppingCart className="btn-icon" />
                      <span>Adicionar ao Carrinho</span>
                    </>
                  ) : (
                    <>
                      <FaExclamationTriangle className="btn-icon" />
                      <span>Indisponível</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EnhancedAccommodationCard; 