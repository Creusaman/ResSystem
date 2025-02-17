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

  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        const data = await fetchAllAccommodations();
        setAccommodations(data);
      } catch (err) {
        console.error('Erro ao carregar acomodações:', err);
        setError('Erro ao carregar acomodações.');
      }
    };
    loadAccommodations();
  }, [fetchAllAccommodations]);

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
    } catch (err) {
      console.error('Erro ao salvar acomodação:', err);
      setError('Erro ao salvar acomodação.');
    } finally {
      setLoading(false);
    }
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
          onSelect={setSelectedAccommodation} 
          onDelete={handleDelete}
        />
        <AccommodationForm
          accommodation={selectedAccommodation}
          onSave={handleSave}
          onClose={() => setSelectedAccommodation(null)}
        />
      </div>
      {loading && <div className="loading-overlay">Salvando...</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default ManageAccommodation;
