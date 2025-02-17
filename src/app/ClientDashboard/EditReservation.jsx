import React, { useContext, useState, useEffect } from 'react';
import { ClientContext } from '../../Context/ClientContextProvider';
import { updateReservation, fetchUserReservations } from '../../services/firestoreService';
import { getAuth } from 'firebase/auth';
import './EditReservation.css';

function EditReservation() {
  const { clientLogado } = useContext(ClientContext);
  const [reservations, setReservations] = useState([]);
  const [updatedReservation, setUpdatedReservation] = useState({ date: '', room: '', guests: [] });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (clientLogado) {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error('Usuário não autenticado.');
        return;
      }

      fetchUserReservations(userId)
        .then((data) => {
          setReservations(data);
          if (data.length > 0) {
            setUpdatedReservation(data[0]);
          }
        })
        .catch((error) => console.error('Erro ao buscar reservas:', error));
    }
  }, [clientLogado]);

  if (!clientLogado) {
    return <p>Você precisa estar logado para editar sua reserva.</p>;
  }

  const handleChange = (e) => {
    setUpdatedReservation({ ...updatedReservation, [e.target.name]: e.target.value });
  };

  const handleGuestChange = (index, e) => {
    const newGuests = [...updatedReservation.guests];
    newGuests[index][e.target.name] = e.target.value;
    setUpdatedReservation({ ...updatedReservation, guests: newGuests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReservation(updatedReservation.id, updatedReservation);
      setMessage('Reserva atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      setMessage('Erro ao atualizar a reserva.');
    }
  };

  return (
    <div className="edit-reservation">
      <h2>Editar Minha Reserva</h2>
      <form onSubmit={handleSubmit}>
        <label>Data:
          <input type="date" name="date" value={updatedReservation.date} onChange={handleChange} />
        </label>
        <label>Quarto:
          <input type="text" name="room" value={updatedReservation.room} onChange={handleChange} />
        </label>
        <h3>Hóspedes</h3>
        {updatedReservation.guests.map((guest, index) => (
          <div key={index}>
            <label>Nome:
              <input type="text" name="name" value={guest.name} onChange={(e) => handleGuestChange(index, e)} />
            </label>
            <label>Documento:
              <input type="text" name="document" value={guest.document} onChange={(e) => handleGuestChange(index, e)} />
            </label>
          </div>
        ))}
        <button type="submit">Salvar Alterações</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditReservation;
