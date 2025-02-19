import React, { useState } from "react";
import { useAccommodations } from "./AccommodationContext";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./AccommodationPanel.css";

function AccommodationPanel() {
  const { accommodations, selectAccommodation, removeAccommodation, selectedAccommodation, hasUnsavedChanges } = useAccommodations();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSelect = (acc) => {
    if (hasUnsavedChanges && !window.confirm("Existem alterações não salvas. Deseja continuar e perder as mudanças?")) {
      return;
    }
    selectAccommodation(acc);
  };

  return (
    <div className={`accommodation-panel ${isCollapsed ? "collapsed" : ""}`}>
      <div className="panel-header d-flex justify-content-between align-items-center mb-3">
        <h2>Acomodações</h2>
        <div>
          <Button variant="secondary" onClick={() => selectAccommodation(null)}>Limpar Seleção</Button>
          <Button variant="primary" className="ms-2" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "Expandir" : "Reduzir"}
          </Button>
        </div>
      </div>

      <div className="row">
        {accommodations.length > 0 ? (
          accommodations.map((acc) => (
            <div key={acc.id} className="col-md-4 mb-3">
              <Card className={`accommodation-card ${selectedAccommodation?.id === acc.id ? "border-primary" : ""}`} onClick={() => handleSelect(acc)}>
                <Card.Img variant="top" src={acc.files?.length ? acc.files[0].url : "/default-placeholder.png"} alt={acc.name} />
                <Card.Body>
                  <Card.Title className="fw-bold">{acc.name}</Card.Title>
                  <Card.Text>{acc.unitsAvailable} unidades disponíveis</Card.Text>
                  
                  {/* Exibir comodidades */}
                  <div className="amenities-list d-flex flex-wrap">
                    {acc.amenities?.map((amenity) => (
                      <span key={amenity} className="badge bg-secondary m-1">{amenity}</span>
                    ))}
                  </div>

                  <Button variant="danger" className="mt-2" onClick={(e) => { e.stopPropagation(); removeAccommodation(acc.id); }}>
                    Excluir
                  </Button>
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
