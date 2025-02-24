// ManageAccommodation.jsx
import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/navbar";
import AccommodationPanel from "./AccommodationPanel";
import AccommodationForm from "./AccommodationForm";
import { useAccommodations } from "./AccommodationContext";
import Spinner from "react-bootstrap/Spinner";
import styled from "styled-components";
import "./ManageAccommodation.css";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const SuccessMessage = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #28a745;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  z-index: 10000;
`;

function ManageAccommodation() {
  const {
    accommodations,
    selectAccommodation,
    removeAccommodation,
    selectedAccommodation,
    saveAccommodation,
    loading,
    error,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  } = useAccommodations();

  const [successMessage, setSuccessMessage] = useState("");

  // Exibe mensagem de sucesso quando o salvamento é concluído (loading false, sem erro e sem acomodação em edição)
  useEffect(() => {
    if (!loading && !error && selectedAccommodation === null && hasUnsavedChanges === false) {
      // Se houver acomodações e estivermos saindo do modo de edição, consideramos que o save foi bem-sucedido.
      setSuccessMessage("Acomodação salva com sucesso!");
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, error, selectedAccommodation, hasUnsavedChanges]);

  return (
    <div className="manage-accommodation">
      <Navbar />
      <div className="content">
        <AccommodationPanel 
          accommodations={accommodations} 
          onSelect={selectAccommodation} 
          onDelete={removeAccommodation}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        <AccommodationForm
          accommodation={selectedAccommodation}
          onSave={saveAccommodation}
          onCancel={() => selectAccommodation(null)}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      </div>
      {loading && (
        <Overlay>
          <Spinner animation="border" variant="primary" /> 
          <span style={{ marginLeft: "10px" }}>Salvando...</span>
        </Overlay>
      )}
      {error && <div className="error-message">{error}</div>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
    </div>
  );
}

export default ManageAccommodation;
