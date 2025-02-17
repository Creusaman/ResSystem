import React, { useState } from "react";

const SearchFilters = ({ onFilter }) => {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [maxPeople, setMaxPeople] = useState(1);
  const [availability, setAvailability] = useState(true);
  const [accommodationType, setAccommodationType] = useState("");
  const [amenities, setAmenities] = useState({
    wifi: false,
    pool: false,
    parking: false,
  });

  const handleFilterChange = () => {
    onFilter({ priceRange, maxPeople, availability, accommodationType, amenities });
  };

  return (
    <div className="search-filters">
      <h3>Filtrar Acomodações</h3>
      
      <label>Faixa de Preço (R$)</label>
      <input
        type="range"
        min="0"
        max="5000"
        value={priceRange}
        onChange={(e) => setPriceRange([0, e.target.value])}
      />
      <span>Até R$ {priceRange[1]}</span>

      <label>Máximo de Pessoas</label>
      <input
        type="number"
        min="1"
        value={maxPeople}
        onChange={(e) => setMaxPeople(e.target.value)}
      />

      <label>Disponibilidade</label>
      <select value={availability} onChange={(e) => setAvailability(e.target.value === "true")}>
        <option value="true">Disponível</option>
        <option value="false">Indisponível</option>
      </select>

      <label>Tipo de Acomodação</label>
      <select value={accommodationType} onChange={(e) => setAccommodationType(e.target.value)}>
        <option value="">Todos</option>
        <option value="hotel">Hotel</option>
        <option value="apartamento">Apartamento</option>
        <option value="casa">Casa</option>
      </select>

      <label>Comodidades</label>
      <div>
        <input type="checkbox" checked={amenities.wifi} onChange={() => setAmenities({ ...amenities, wifi: !amenities.wifi })} /> Wi-Fi
        <input type="checkbox" checked={amenities.pool} onChange={() => setAmenities({ ...amenities, pool: !amenities.pool })} /> Piscina
        <input type="checkbox" checked={amenities.parking} onChange={() => setAmenities({ ...amenities, parking: !amenities.parking })} /> Estacionamento
      </div>

      <button onClick={handleFilterChange}>Aplicar Filtros</button>
    </div>
  );
};

export default SearchFilters;
