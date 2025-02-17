import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ClientContext } from '../../Context/ClientContextProvider';
import { fetchUserReservations } from '../../services/firestoreService';
import { getAuth } from 'firebase/auth';
import { useAuth } from '../../Context/AuthProvider';
import './ClientDashboard.css';

function ClientDashboard() {
  const { clientLogado, userReservations, setUserReservations } = useContext(ClientContext);
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (clientLogado && user) {
      fetchUserReservations(user.uid)
        .then((reservations) => {
          setUserReservations(reservations);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Erro ao buscar reservas:', err);
          setError('Erro ao carregar reservas.');
          setLoading(false);
        });
    }
  }, [clientLogado, setUserReservations]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  if (!clientLogado) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="client-dashboard">
      <h1>Área do Cliente</h1>

      {loading ? (
        <p>Carregando reservas...</p>
      ) : error ? (
        <p>{error}</p>
      ) : userReservations.length > 0 ? (
        <div className="reservations-container">
          <h2>Minhas Reservas</h2>
          <ul>
            {userReservations.map((reservation) => (
              <li key={reservation.id}>
                <p><strong>Data:</strong> {reservation.date}</p>
                <p><strong>Quarto:</strong> {reservation.room}</p>
                <p><strong>Status:</strong> {reservation.status}</p>
                <Link to={`/app/client/view-reservation/${reservation.id}`} className="btn btn-primary">Ver Detalhes</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Você ainda não possui reservas.</p>
      )}

      <nav className="dashboard-menu">
        <ul>
          <li><Link to="/app/client/edit">Editar Meus Dados</Link></li>
          <li><Link to="/app/client/view-reservation">Visualizar Reserva</Link></li>
          <li><Link to="/app/client/edit-reservation">Editar Reserva</Link></li>
          <li><Link to="/app/client/checkin">Fazer Check-in</Link></li>
        </ul>
      </nav>

      <button className="btn btn-danger logout-button" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}

export default ClientDashboard;
