import React, { useState } from 'react';
import './AccommodationPanel.css';

function AccommodationPanel({ accommodations, onSelect, onDelete, mode = 'default', selectedAccommodations, setSelectedAccommodations }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSelection = (acc) => {
    if (mode === 'rules' || mode === 'reservations') {
      setSelectedAccommodations((prev) =>
        prev.includes(acc.id) ? prev.filter((id) => id !== acc.id) : [...prev, acc.id]
      );
    } else {
      onSelect(acc);
    }
  };

  return (
    <div className={`accommodation-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-header">
        <h2>Acomodações</h2>
        <button className="btn btn-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? 'Expandir' : 'Reduzir'}
        </button>
        <button className="btn btn-secondary" onClick={() => setSelectedAccommodations([])}>Limpar Seleção</button>
      </div>
      <div className="accommodation-list">
        {accommodations.length > 0 ? (
          accommodations.map((acc) => (
            <div
              key={acc.id}
              className={`accommodation-card ${selectedAccommodations?.includes(acc.id) ? 'selected' : ''}`}
              onClick={() => toggleSelection(acc)}
            >
              <img src={acc.files?.[0]?.url || '/default-placeholder.png'} alt={acc.name} className="accommodation-thumbnail" />
              {!isCollapsed && (
                <div className="accommodation-info">
                  <h4>{acc.name}</h4>
                  <span className="units">{acc.unitsAvailable} unidades</span>
                </div>
              )}
              {mode === 'default' && !isCollapsed && (
                <button className="btn btn-danger btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(acc.id); }}>Excluir</button>
              )}
            </div>
          ))
        ) : (
          <p>Nenhuma acomodação cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default AccommodationPanel;
