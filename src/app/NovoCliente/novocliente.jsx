import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../Components/Navbar/navbar';
import './novocliente.css';
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import { firebaseApp } from '../../Config/firebase';

function NovoCliente() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [fone, setFone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('N');

  const db = getFirestore(firebaseApp);

  const validarCampos = () => {
    if (!nome.trim()) return 'O nome é obrigatório.';
    if (!email.includes('@')) return 'E-mail inválido.';
    if (!fone.match(/^\d{10,11}$/)) return 'Número de telefone inválido.';
    return null;
  };

  async function CadastrarCliente() {
    const erro = validarCampos();
    if (erro) {
      setMensagem(erro);
      return;
    }

    try {
      await addDoc(collection(db, 'clientes'), { nome, email, fone });
      setMensagem('');
      setSucesso('S');
    } catch (erro) {
      setMensagem('Erro ao cadastrar cliente: ' + erro.message);
      setSucesso('N');
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container-fluid titulo">
        <div className="offset-lg-3 col-lg-6">
          <h1>Novo Cliente</h1>
          <form>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Telefone</label>
              <input type="text" className="form-control" value={fone} onChange={(e) => setFone(e.target.value)} />
            </div>
            <div className="text-center">
              <Link to="/app/home" className="btn btn-outline-primary">Cancelar</Link>
              <button type="button" className="btn btn-primary" onClick={CadastrarCliente}>Salvar</button>
            </div>
            {mensagem && <div className="alert alert-danger mt-2">{mensagem}</div>}
            {sucesso === 'S' && <Navigate to='/app/home' />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default NovoCliente;
