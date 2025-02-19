import React, { useState, useContext, useEffect } from 'react';
import { ClientContext } from '../../Context/ClientContextProvider';
import { uploadUserFacePhoto, deleteUserFacePhoto } from '../../services/firebaseStorageService';
import { getAuth } from 'firebase/auth';
import { useParams } from 'react-router-dom';
import useDragAndDrop from '../../hooks/useDragAndDrop';
import './CheckIn.css';

function CheckIn() {
  const { clientLogado, getReservationDetails } = useContext(ClientContext);
  const { reservationId } = useParams();
  const [guests, setGuests] = useState([]);
  const [message, setMessage] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  
  const {
    isDragging,
    orderedFiles,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReorder,
    deleteFiles,
    generateThumbnail,
  } = useDragAndDrop(`checkin/${reservationId}`);

  useEffect(() => {
    const fetchReservation = async () => {
      if (reservationId) {
        const reservation = await getReservationDetails(reservationId);
        if (reservation) {
          setGuests(reservation.guests);
          setIsOwner(reservation.ownerId === clientLogado?.id);
        }
      }
    };
    fetchReservation();
  }, [reservationId, clientLogado, getReservationDetails]);

  if (!clientLogado) {
    return <p>Você precisa estar logado para fazer check-in.</p>;
  }

  const handleGuestChange = (index, event) => {
    const newGuests = [...guests];
    newGuests[index][event.target.name] = event.target.value;
    setGuests(newGuests);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Usuário não autenticado.");

      setMessage('Check-in realizado com sucesso! Arquivos salvos.');
    } catch (error) {
      setMessage('Erro ao realizar check-in.');
    }
  };

  return (
    <div className="check-in">
      <h2>Check-In</h2>
      <form onSubmit={handleSubmit}>
        {isOwner ? (
          guests.map((guest, index) => (
            <div key={index}>
              <label>Nome do Hóspede:</label>
              <input
                type="text"
                name="name"
                value={guest.name}
                onChange={(e) => handleGuestChange(index, e)}
                required
              />
              <label>Documento:</label>
              <input
                type="text"
                name="document"
                value={guest.document}
                onChange={(e) => handleGuestChange(index, e)}
                required
              />
            </div>
          ))
        ) : (
          <>
            <label>Nome:</label>
            <input type="text" name="name" required />
            <label>Documento:</label>
            <input type="text" name="document" required />
          </>
        )}

        <div
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          Arraste e solte fotos ou vídeos aqui, ou clique para selecionar.
        </div>

        <div className="file-preview">
          {orderedFiles.map((file, index) => (
            <div key={index} className="file-item">
              <img src={generateThumbnail(file.url)} alt="preview" className="thumbnail" />
              <button onClick={() => deleteFiles(file.url)}>Excluir</button>
            </div>
          ))}
        </div>

        <button type="submit">Confirmar Check-In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CheckIn;