import React, { useEffect, useState } from "react";
import { fetchAllReservations } from "../../../services/firestoreService";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [occupancyData, setOccupancyData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [activeReservations, setActiveReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const reservations = await fetchAllReservations();
      const activeRes = reservations.filter(reservation => reservation.status !== "Cancelled");
      setActiveReservations(activeRes);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin-dashboard container-fluid">
      <h1 className="text-center">Painel do Administrador</h1>
      <button className="btn btn-primary mb-3" onClick={fetchData}>Atualizar Dados</button>
      {loading ? (
        <p className="text-center">Carregando dados...</p>
      ) : (
        <>
          <div className="row dashboard-summary">
            <div className="col-md-6">
              <div className="summary-card">
                <h2>Reservas Ativas</h2>
                <p className="summary-value">{activeReservations.length}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
