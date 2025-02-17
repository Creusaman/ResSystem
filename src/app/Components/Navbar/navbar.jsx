import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';
import { useAuth } from '../../../Context/AuthProvider';

function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/app');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src="/Images/logo.png" alt="Logo" height="28" />
        </Link>

        {/* Navbar toggler for smaller screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {role === 'admin' && (
              <>
                <li className="nav-item">
                  <Link to="/admin/dashboard" className="nav-link">Painel Admin</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/novocliente" className="nav-link">Novo Cliente</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/rulesmanager" className="nav-link">Gerenciar Regras</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/accommodations" className="nav-link">Gerenciar Acomodações</Link>
                </li>
              </>
            )}
            {user && (
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-button">Sair</button>
              </li>
            )}
          </ul>
          
          {/* User Information */}
          {user && (
            <div className="navbar-text">
              <span className="user-info">
                <strong>{user.displayName || user.email}</strong> - {role === 'admin' ? 'Administrador' : 'Cliente'}
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;