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
  flex-direction: column;
  margin-bottom: 15px;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  margin-bottom: 10px;
`;

const ModeButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CardContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: ${props => (props.mode === "medium" ? "300px" : "180px")};

  &.selected {
    border: 1px solid blue;
  }

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  @media (max-width: 767px) {
    flex-direction: row;
    align-items: center;
    height: ${props => (props.mode === "medium" ? "300px" : "180px")};
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: ${props => (props.mode === "medium" ? "180px" : "120px")};
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
  justify-content: ${props => (props.mode === "medium" ? "flex-start" : "center")};
  flex: 1;
  overflow: hidden;
`;

const MediumContent = styled.div`
  margin-top: 8px;
  overflow: auto;
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
  const [cardMode, setCardMode] = useState("small"); // "small" ou "medium"

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
        <HeaderTitle>Acomodações</HeaderTitle>
        <ModeButtons>
          <Button
            variant={cardMode === "small" ? "primary" : "outline-primary"}
            onClick={() => setCardMode("small")}
          >
            Pequeno
          </Button>
          <Button
            variant={cardMode === "medium" ? "primary" : "outline-primary"}
            onClick={() => setCardMode("medium")}
          >
            Médio
          </Button>
          <Button variant="secondary" onClick={() => selectAccommodation(null)}>
            Limpar Seleção
          </Button>
        </ModeButtons>
      </PanelHeader>
      <CardsContainer>
        {accommodations.length > 0 ? (
          accommodations.map((acc) => (
            <CardContainer
              key={acc.id}
              mode={cardMode}
              className={selectedAccommodation?.id === acc.id ? "selected" : ""}
              onClick={() => handleSelect(acc)}
            >
              <CardImage
                src={acc.files?.length ? acc.files[0].url : "/default-placeholder.png"}
                alt={acc.name}
                mode={cardMode}
              />
              <CardContent mode={cardMode}>
                <h5 style={{ margin: 0 }}>{acc.name}</h5>
                <p style={{ margin: 0 }}>{acc.unitsAvailable} unidades disponíveis</p>
                {cardMode === "medium" && (
                  <MediumContent>
                    <p>{acc.description}</p>
                    {acc.amenities && (
                      <AmenitiesContainer>
                        {acc.amenities.map((a) => (
                          <AmenityBadge key={a}>{a}</AmenityBadge>
                        ))}
                      </AmenitiesContainer>
                    )}
                  </MediumContent>
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
