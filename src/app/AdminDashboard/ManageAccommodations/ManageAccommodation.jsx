import React from "react";
import Navbar from "../../Components/Navbar/navbar";
import AccommodationPanel from "./AccommodationPanel";
import AccommodationForm from "./AccommodationForm";
import { useAccommodations } from "./AccommodationContext";
import "./ManageAccommodation.css";

function ManageAccommodation() {
  const { accommodations, selectAccommodation, removeAccommodation, selectedAccommodation, saveAccommodation, loading, error, hasUnsavedChanges, setHasUnsavedChanges } = useAccommodations();

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
      {loading && <div className="loading-overlay">Salvando...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ManageAccommodation;
