// src/components/AccommodationPanel.jsx
import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import './AccommodationPanel.css';

function AccommodationPanel({ accommodations, onSelect, onDelete, mode = 'default', selectedAccommodation, setSelectedAccommodation, hasUnsavedChanges }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSelection = (acc) => {
    if (hasUnsavedChanges && !window.confirm("Existem alterações não salvas. Deseja continuar e perder as mudanças?")) {
      return;
    }
    
    if (mode === 'rules' || mode === 'reservations') {
      setSelectedAccommodation((prev) =>
        prev.includes(acc.id) ? prev.filter((id) => id !== acc.id) : [...prev, acc.id]
      );
    } else {
      onSelect(acc);
    }
  };

  return (
    <div className={`accommodation-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-header d-flex justify-content-between align-items-center mb-3">
        <h2>Acomodações</h2>
        <div>
          <Button variant="secondary" onClick={() => setSelectedAccommodation([])}>Limpar Seleção</Button>
          <Button variant="primary" className="ms-2" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? 'Expandir' : 'Reduzir'}
          </Button>
        </div>
      </div>
      <div className="row">
        {accommodations.length > 0 ? (
          accommodations.map((acc) => (
            <div key={acc.id} className="col-md-4 mb-3">
              <Card className={`accommodation-card ${selectedAccommodation?.includes(acc.id) ? 'border-primary' : ''}`} onClick={() => toggleSelection(acc)}>
                <Card.Img variant="top" src={acc.files?.length ? acc.files[0].url : '/default-placeholder.png'} alt={acc.name} />
                <Card.Body>
                  <Card.Title className="fw-bold">{acc.name}</Card.Title>
                  <Card.Text>{acc.unitsAvailable} unidades disponíveis</Card.Text>
                  {mode === 'default' && (
                    <Button variant="danger" onClick={(e) => { e.stopPropagation(); onDelete(acc.id); }}>Excluir</Button>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-muted">Nenhuma acomodação cadastrada.</p>
        )}
      </div>
    </div>
  );
}

export default AccommodationPanel;
