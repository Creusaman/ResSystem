// src/Context/ClientContextProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { fetchUserReservations } from "../services/firestoreService";
import { useAuth } from "./AuthProvider";

export const ClientContext = createContext();

export const ClientContextProvider = ({ children }) => {
  const { role, verifyUser } = useAuth();
  const isClient = role === "client"; // 🔐 Verifica se o usuário é cliente
  const [error, setError] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cachedUserId, setCachedUserId] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const user = await verifyUser(); // 🔐 Verifica se o usuário está autenticado

        // 🚀 Evita chamadas repetidas ao Firestore
        if (user.uid === cachedUserId) return;
        setCachedUserId(user.uid);

        if (!isClient) {
          setError("Acesso negado: Apenas clientes podem visualizar reservas."); // 🛡️ Proteção extra
          return;
        }

        const reservations = await fetchUserReservations(user.uid);
        setUserReservations(reservations || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isClient) fetchReservations(); // 🔐 Só busca reservas se o usuário for cliente
  }, [isClient, verifyUser, cachedUserId]);

  return (
    <ClientContext.Provider value={{ isClient, error, userReservations, loading }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);
export default ClientContextProvider;
