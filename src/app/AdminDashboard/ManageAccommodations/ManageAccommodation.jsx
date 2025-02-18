import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/navbar';
import AccommodationPanel from './AccommodationPanel';
import AccommodationForm from './AccommodationForm';
import { useAdmin } from '../../../Context/AdminContextProvider';
import './ManageAccommodation.css';

function ManageAccommodation() {
  const { fetchAllAccommodations, addAccommodation, updateAccommodation, deleteAccommodation } = useAdmin();
  const [accommodations, setAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        const data = await fetchAllAccommodations();
        console.log("Dados recebidos do Firestore:", data); // Debug
        setAccommodations(data);
      } catch (err) {
        console.error('Erro ao carregar acomodações:', err);
        setError('Erro ao carregar acomodações.');
      }
    };
    loadAccommodations();
  }, []);

  const handleSave = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      if (selectedAccommodation?.id) {
        await updateAccommodation(selectedAccommodation.id, formData);
      } else {
        await addAccommodation(formData);
      }
      setSelectedAccommodation(null);
      setAccommodations(await fetchAllAccommodations());
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Erro ao salvar acomodação:', err);
      setError('Erro ao salvar acomodação.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccommodation = (accommodation) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm("Existem alterações não salvas. Deseja continuar e perder as mudanças?");
      if (!confirmChange) return;
    }
    setSelectedAccommodation(accommodation);
    setHasUnsavedChanges(false);
  };

  const handleDelete = async (accommodationId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteAccommodation(accommodationId);
      setAccommodations(await fetchAllAccommodations());
      setSelectedAccommodation(null);
    } catch (err) {
      console.error('Erro ao excluir acomodação:', err);
      setError('Erro ao excluir acomodação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manage-accommodation">
      <Navbar />
      <div className="content">
        <AccommodationPanel 
          accommodations={accommodations} 
          onSelect={handleSelectAccommodation} 
          onDelete={handleDelete}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        <AccommodationForm
          accommodation={selectedAccommodation}
          onSave={handleSave}
          onCancel={() => setSelectedAccommodation(null)}
          setHasUnsavedChanges={setHasUnsavedChanges}
        />
      </div>
      {loading && <div className="loading-overlay">Salvando...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ManageAccommodation;
