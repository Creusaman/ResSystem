import React, { useEffect, useState } from "react";
import { manualSync } from "../services/FaceTerminalSyncService";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../Config/firebase";
import "./FaceTerminalManager.css";

function FaceTerminalManager() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsSnapshot = await getDocs(collection(db, "Reservas"));
      const reservationsData = reservationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(reservationsData);
      setLoading(false);
    };

    fetchReservations();
  }, []);

  return (
    <div className="terminal-manager">
      <h2>Gerenciamento do Terminal Facial</h2>
      <button onClick={manualSync}>🔄 Reenviar Dados Manualmente</button>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {reservations.map((res) => (
            <li key={res.id}>
              <p><strong>Reserva:</strong> {res.id}</p>
              {res.guests.map((guest) => (
                <p key={guest.document}>
                  {guest.name} - {res.syncedWithTerminal ? "✅ Sincronizado" : "❌ Pendente"}
                </p>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FaceTerminalManager;
