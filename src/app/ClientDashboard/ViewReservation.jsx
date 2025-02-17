import React, { useContext, useEffect, useState } from 'react';
import { ClientContext } from '../../Context/ClientContextProvider';
import { fetchUserReservations } from '../../services/firestoreService';
import { getAuth } from 'firebase/auth';
import './ViewReservation.css';

function ViewReservation() {
  const { clientLogado } = useContext(ClientContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientLogado) {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      fetchUserReservations(userId)
        .then((data) => {
          setReservations(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao buscar reservas:', error);
          setLoading(false);
        });
    }
  }, [clientLogado]);

  if (!clientLogado) {
    return <p>Você precisa estar logado para visualizar suas reservas.</p>;
  }

  return (
    <div className="view-reservation">
      <h2>Minhas Reservas</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : reservations.length > 0 ? (
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <p><strong>Data:</strong> {reservation.date}</p>
              <p><strong>Quarto:</strong> {reservation.room}</p>
              <p><strong>Status:</strong> {reservation.status}</p>
              <p><strong>Pessoas:</strong> {reservation.guests.map((g) => g.name).join(', ')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você não tem reservas ativas.</p>
      )}
    </div>
  );
}

export default ViewReservation;
