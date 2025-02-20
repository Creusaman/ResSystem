import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchAllAccommodations, addAccommodation, updateAccommodation, deleteAccommodation } from "services/firestoreService";
import { useAuth } from "Context/AuthProvider";

const AccommodationContext = createContext();

export const AccommodationProvider = ({ children }) => {
  const { verifyAdmin } = useAuth();
  const [accommodations, setAccommodations] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // ✅ Snapshot da acomodação em edição
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        setLoading(true);
        const data = await fetchAllAccommodations();
        setAccommodations(data || []);
      } catch (err) {
        console.error("Erro ao carregar acomodações:", err);
        setError("Erro ao carregar acomodações.");
      } finally {
        setLoading(false);
      }
    };
    loadAccommodations();
  }, []);

  const selectAccommodation = (accommodation) => {
    if (hasUnsavedChanges && !window.confirm("Existem alterações não salvas. Deseja continuar?")) {
      return;
    }
    setIsEditing(accommodation ? { ...accommodation } : null); // ✅ Salva snapshot
    setHasUnsavedChanges(false);
  };

  const saveAccommodation = async (formData) => {
    setLoading(true);
    try {
      await verifyAdmin();
      if (isEditing?.id) {
        await updateAccommodation(isEditing.id, formData, verifyAdmin);
      } else {
        await addAccommodation(formData, verifyAdmin);
      }
      setIsEditing(null);
      setAccommodations(await fetchAllAccommodations());
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error("Erro ao salvar acomodação:", err);
      setError("Erro ao salvar acomodação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccommodationContext.Provider
      value={{
        accommodations,
        isEditing, // ✅ Indica se estamos editando ou criando uma nova acomodação
        selectAccommodation,
        saveAccommodation,
        loading,
        error,
        hasUnsavedChanges,
        setHasUnsavedChanges,
      }}
    >
      {children}
    </AccommodationContext.Provider>
  );
};

export const useAccommodations = () => useContext(AccommodationContext);
