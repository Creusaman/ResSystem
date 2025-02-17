import React, { useState } from "react";
import "./AccommodationCard.css";

function AccommodationCard({ accommodation, onSelect }) {
  const [showPackageSuggestion, setShowPackageSuggestion] = useState(false);

  const handleApplyPackage = () => {
    onSelect(accommodation.packageSuggestion);
    setShowPackageSuggestion(false);
  };

  return (
    <div className="accommodation-card">
      <h2>{accommodation.name}</h2>
      <p>{accommodation.description}</p>
      <p><strong>Preço:</strong> R$ {accommodation.bestOption.price.toFixed(2)}</p>

      {accommodation.packageSuggestion && (
        <div className="package-suggestion">
          <p className="alert-green">{accommodation.packageSuggestion.message}</p>
          <button className="apply-package-btn" onClick={handleApplyPackage}>
            Alterar para pacote recomendado
          </button>
        </div>
      )}
      
      <button className="reserve-btn">Reservar</button>
    </div>
  );
}

export default AccommodationCard;
