import React, { useEffect, useState } from "react";
import { fetchOccupancyData, fetchRevenueData, fetchActiveReservations } from "../services/firestoreService";
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
      const occupancy = await fetchOccupancyData();
      const revenue = await fetchRevenueData();
      const reservations = await fetchActiveReservations();
      setOccupancyData(occupancy);
      setRevenueData(revenue);
      setActiveReservations(reservations);
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
            <div className="col-md-6">
              <div className="summary-card">
                <h2>Faturamento Recente</h2>
                <p className="summary-value">R$ {revenueData.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="chart-container">
                <h2>Ocupação das Acomodações</h2>
                <Bar data={occupancyData} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="chart-container">
                <h2>Faturamento Mensal</h2>
                <Line data={revenueData} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
