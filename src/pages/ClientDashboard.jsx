import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ClientContext } from '../../Context/ClientContextProvider';
import { fetchUserReservations, fetchUserPayments } from '../../services/firestoreService';
import { getAuth } from 'firebase/auth';
import './ClientDashboard.css';

function ClientDashboard() {
  const { clientLogado, userReservations, setUserReservations } = useContext(ClientContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPayments, setUserPayments] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (clientLogado && user) {
      fetchUserReservations(user.uid)
        .then((reservations) => {
          setUserReservations(reservations);
        })
        .catch((err) => {
          console.error('Erro ao buscar reservas:', err);
          setError('Erro ao carregar reservas.');
        });

      fetchUserPayments(user.uid)
        .then((payments) => {
          setUserPayments(payments);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Erro ao buscar pagamentos:', err);
          setError('Erro ao carregar pagamentos.');
          setLoading(false);
        });
    }
  }, [clientLogado, setUserReservations]);

  if (!clientLogado) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="client-dashboard">
      <h1>Área do Cliente</h1>

      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="reservations-container">
            <h2>Minhas Reservas</h2>
            {userReservations.length > 0 ? (
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
            ) : (
              <p>Você ainda não possui reservas.</p>
            )}
          </div>

          <div className="payments-container">
            <h2>Histórico de Pagamentos</h2>
            {userPayments.length > 0 ? (
              <ul>
                {userPayments.map((payment) => (
                  <li key={payment.id}>
                    <p><strong>Data:</strong> {new Date(payment.timestamp).toLocaleDateString()}</p>
                    <p><strong>Valor:</strong> R$ {payment.amount.toFixed(2)}</p>
                    <p><strong>Status:</strong> {payment.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum pagamento encontrado.</p>
            )}
          </div>

          <nav className="dashboard-menu">
            <ul>
              <li><Link to="/app/client/edit">Editar Meus Dados</Link></li>
              <li><Link to="/app/client/view-reservation">Visualizar Reserva</Link></li>
              <li><Link to="/app/client/edit-reservation">Editar Reserva</Link></li>
              <li><Link to="/app/client/checkin">Fazer Check-in</Link></li>
              <li><Link to="/app/client/settings">Configurações</Link></li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}

export default ClientDashboard;
