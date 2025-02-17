import React, { useState } from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import './resetsenha.css';

function ResetSenha() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const auth = getAuth();

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Email enviado com sucesso. Verifique sua caixa de entrada.');
    } catch (error) {
      setMessage('Erro ao enviar email: ' + error.message);
    }
  };

  return (
    <div className="reset-password">
      <h2>Recuperar Senha</h2>
      <input type="email" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button onClick={handleReset}>Enviar Email</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ResetSenha;
