// AccommodationPanel.jsx
import React, { useState } from "react";
import { useAccommodations } from "./AccommodationContext";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";

const PanelContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardContainer = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 16px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s ease;
  display: flex;
  flex-direction: column;

  &.selected {
    border-color: blue;
  }

  /* Layout horizontal em telas pequenas */
  @media (max-width: 767px) {
    flex-direction: row;
    align-items: center;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;

  @media (max-width: 767px) {
    width: 120px;
    height: 100%;
  }
`;

const CardContent = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const DeleteButtonStyled = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  opacity: 0;
  transition: opacity 0.3s ease, color 0.3s ease;
  color: #888;
  cursor: pointer;
  font-size: 1.2em;
  z-index: 2;

  &:hover {
    color: #dc3545;
  }

  ${CardContainer}:hover & {
    opacity: 1;
  }
`;

const AmenitiesContainer = styled.div`
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const AmenityBadge = styled.span`
  background: #ddd;
  padding: 2px 4px;
  border-radius: 4px;
  font-size: 12px;
`;

const AccommodationPanel = () => {
  const {
    accommodations,
    selectAccommodation,
    removeAccommodation,
    selectedAccommodation,
    hasUnsavedChanges,
  } = useAccommodations();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSelect = (acc) => {
    if (hasUnsavedChanges && !window.confirm("Existem alterações não salvas. Deseja continuar e perder as mudanças?")) {
      return;
    }
    selectAccommodation(acc);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja excluir esta acomodação?")) {
      removeAccommodation(id);
    }
  };

  return (
    <PanelContainer>
      <PanelHeader>
        <h2>Acomodações</h2>
        <div>
          <Button variant="secondary" onClick={() => selectAccommodation(null)}>Limpar Seleção</Button>
          <Button variant="primary" className="ms-2" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "Expandir" : "Reduzir"}
          </Button>
        </div>
      </PanelHeader>
      <CardsContainer>
        {accommodations.length > 0 ? (
          accommodations.map((acc) => (
            <CardContainer
              key={acc.id}
              className={selectedAccommodation?.id === acc.id ? "selected" : ""}
              onClick={() => handleSelect(acc)}
            >
              <CardImage src={acc.files?.length ? acc.files[0].url : "/default-placeholder.png"} alt={acc.name} />
              <CardContent>
                <h5 style={{ margin: 0 }}>{acc.name}</h5>
                <p style={{ margin: 0 }}>{acc.unitsAvailable} unidades disponíveis</p>
                {acc.amenities && (
                  <AmenitiesContainer>
                    {acc.amenities.map((a) => (
                      <AmenityBadge key={a}>{a}</AmenityBadge>
                    ))}
                  </AmenitiesContainer>
                )}
              </CardContent>
              <DeleteButtonStyled onClick={(e) => handleDelete(acc.id, e)}>
                <FaTrash />
              </DeleteButtonStyled>
            </CardContainer>
          ))
        ) : (
          <p className="text-muted">Nenhuma acomodação cadastrada.</p>
        )}
      </CardsContainer>
    </PanelContainer>
  );
};

export default AccommodationPanel;
