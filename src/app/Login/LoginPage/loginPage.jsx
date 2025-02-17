import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Context/AuthProvider';
import Navbar from '../../Components/Navbar/navbar';
import './loginPage.css';

function Login() {
  const { loginWithEmailPassword, loginWithGoogle, loginWithFacebook, logout, user, role } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
    }
  }, [user, role, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginWithEmailPassword(email, password);
      navigate(role === 'admin' ? '/admin/dashboard' : '/client/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user && <Navbar />}
      <div className="login-container">
        <div className="login-box">
          {user ? (
            <div className="already-logged-in">
              <h2>Você já está logado!</h2>
              <button className="btn-login" onClick={() => navigate(role === 'admin' ? '/admin/dashboard' : '/client/dashboard')}>
                Ir para o Dashboard
              </button>
              <button className="btn-logout" onClick={logout}>Sair</button>
            </div>
          ) : (
            <>
              <h2>Bem-vindo de volta!</h2>
              <form onSubmit={handleLogin} className="login-form">
                <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="btn-login" disabled={loading}>
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
              {error && <p className="error-message">{error}</p>}
              <hr className="divider" />
              <button className="btn-google" onClick={loginWithGoogle}>
                <img src="/images/google-icon.png" alt="Google Icon" className="google-icon" />
                Entrar com Google
              </button>
              <button className="btn-facebook" onClick={loginWithFacebook}>
                <img src="/images/facebook-icon.png" alt="Facebook Icon" className="facebook-icon" />
                Entrar com Facebook
              </button>
              <div className="links">
                <p><a href="/reset-password">Esqueci minha senha</a></p>
                <p><a href="/signup">Criar uma conta</a></p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
