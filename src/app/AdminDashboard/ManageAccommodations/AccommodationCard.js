import React from 'react';

const AccommodationCard = ({ accommodation, onDelete }) => {
  return (
    <div className="card shadow-sm" style={{ width: '18rem', position: 'relative' }}>
      {/* Imagem da Acomodação */}
      <img
        src={accommodation.image}
        className="card-img-top"
        alt={accommodation.name}
      />

      {/* Corpo do Card */}
      <div className="card-body">
        <h5 className="card-title fw-bold">{accommodation.name}</h5>
        <p className="card-text">{accommodation.availableUnits} unidades disponíveis</p>
      </div>

      {/* Botão de Exclusão */}
      <button
        type="button"
        className="btn-close"
        aria-label="Excluir"
        onClick={() => onDelete(accommodation.id)}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      ></button>
    </div>
  );
};

export default AccommodationCard;
