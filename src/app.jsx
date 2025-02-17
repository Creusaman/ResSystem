import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./Context/AuthProvider";

/* Páginas */
import Navbar from "./app/Components/Navbar/navbar.jsx";
import Site from "./site/site.jsx";
import Login from "./app/Login/LoginPage/loginPage.jsx";
import NovaConta from "./app/Login/NovaConta/novaconta.jsx";
import ResetSenha from "./app/Login/ResetSenha/resetsenha.jsx";
import AdminDashboard from "./app/AdminDashboard/AdminDashboard/AdminDashboard.jsx";
import ClientDashboard from "./app/ClientDashboard/ClientDashboard.jsx";
import ManageAccommodations from "./app/AdminDashboard/ManageAccommodations/ManageAccommodation.jsx";
import NovoCliente from "./app/NovoCliente/novocliente.jsx";
import RulesManager from "./app/AdminDashboard/RulesManager/RulesManager.jsx";
import AuditLogViewer from "./pages/AuditLogViewer";
import SearchFilters from "./components/SearchFilters";
import NotificationPanel from "./components/NotificationPanel";
import Reservar from "./pages/Reservar";
import Checkout from "./pages/Checkout";
import FaceTerminalManager from "./pages/FaceTerminalManager";
import ReportGenerator from "./pages/ReportGenerator.jsx";

/* Rotas Protegidas */
function AdminSecureRoute({ children }) {
  const { role, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return role === "admin" ? children : <Navigate to="/app" replace />;
}

function ClientSecureRoute({ children }) {
  const { role, loading } = useAuth();
  if (loading) return <div>Carregando...</div>;
  return role === "client" ? children : <Navigate to="/app" replace />;
}

function PublicRoute({ children }) {
  return children;
}

/* Componente Principal */
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<PublicRoute><Site /></PublicRoute>} />
        <Route path="/app" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/app/novaconta" element={<PublicRoute><NovaConta /></PublicRoute>} />
        <Route path="/app/resetsenha" element={<PublicRoute><ResetSenha /></PublicRoute>} />

        {/* Rotas para Administradores */}
        <Route path="/admin/dashboard" element={<AdminSecureRoute><AdminDashboard /></AdminSecureRoute>} />
        <Route path="/admin/novocliente" element={<AdminSecureRoute><NovoCliente /></AdminSecureRoute>} />
        <Route path="/admin/rulesmanager" element={<AdminSecureRoute><RulesManager /></AdminSecureRoute>} />
        <Route path="/admin/accommodations" element={<AdminSecureRoute><ManageAccommodations /></AdminSecureRoute>} />
        <Route path="/admin/logs" element={<AdminSecureRoute><AuditLogViewer /></AdminSecureRoute>} />
        <Route path="/admin/reports" element={<AdminSecureRoute><ReportGenerator /></AdminSecureRoute>} />
        <Route path="/admin/face-terminal" element={<AdminSecureRoute><FaceTerminalManager /></AdminSecureRoute>} />

        {/* Rotas para Clientes */}
        <Route path="/client/dashboard" element={<ClientSecureRoute><ClientDashboard /></ClientSecureRoute>} />
        <Route path="/search" element={<ClientSecureRoute><SearchFilters /></ClientSecureRoute>} />
        <Route path="/notifications" element={<ClientSecureRoute><NotificationPanel /></ClientSecureRoute>} />
        <Route path="/reservar" element={<ClientSecureRoute><Reservar /></ClientSecureRoute>} />
        <Route path="/checkout" element={<ClientSecureRoute><Checkout /></ClientSecureRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
