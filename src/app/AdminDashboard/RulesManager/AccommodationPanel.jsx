import React, { useEffect } from 'react';
import { useAdmin } from '../../../Context/AdminContextProvider';
import './AccommodationPanel.css';
import { useRules } from './RulesContext';

function AccommodationPanel() {
  const { selectedAccommodation, dispatch } = useRules();
  const { fetchAllAccommodations, accommodations } = useAdmin();

  useEffect(() => {
    fetchAllAccommodations();
  }, [fetchAllAccommodations]);

  const handleSelect = (id) => {
    const selected = accommodations.find((acc) => acc.id === id);
    dispatch({ type: 'SET_ACCOMMODATION', payload: selected });
  };

  return (
    <div className="accommodation-panel">
      <h2>Gerenciar Acomodações</h2>
      <div className="accommodation-list">
        {accommodations.map((acc) => (
          <button
            key={acc.id}
            className={`accommodation-item ${selectedAccommodation?.id === acc.id ? 'selected' : ''}`}
            onClick={() => handleSelect(acc.id)}
          >
            {acc.nome}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AccommodationPanel;
