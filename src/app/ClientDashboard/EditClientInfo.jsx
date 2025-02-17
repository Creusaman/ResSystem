import React, { useState, useContext, useEffect } from 'react';
import { ClientContext } from '../../Context/ClientContextProvider';
import { getAuth } from 'firebase/auth';
import { updateClientInfo } from '../../services/firestoreService';
import './EditClientInfo.css';

function EditClientInfo() {
  const { clientLogado } = useContext(ClientContext);
  const [clientData, setClientData] = useState({ nome: '', email: '', telefone: '', documento: '', foto: '' });
  const [message, setMessage] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    if (clientLogado) {
      setClientData({
        nome: clientLogado.nome || '',
        email: clientLogado.email || '',
        telefone: clientLogado.telefone || '',
        documento: clientLogado.documento || '',
        foto: clientLogado.foto || '',
      });
      setFotoPreview(clientLogado.foto || null);
    }
  }, [clientLogado]);

  if (!clientLogado) {
    return <p>Você precisa estar logado para editar seus dados.</p>;
  }

  const handleChange = (e) => {
    setClientData({ ...clientData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
        setClientData({ ...clientData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error("Usuário não autenticado.");
      }
      await updateClientInfo(userId, clientData);
      setMessage('Dados atualizados com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
      setMessage('Erro ao atualizar os dados.');
    }
  };

  return (
    <div className="edit-client-info">
      <h2>Editar Meus Dados</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:
          <input type="text" name="nome" value={clientData.nome} onChange={handleChange} />
        </label>
        <label>Email:
          <input type="email" name="email" value={clientData.email} onChange={handleChange} />
        </label>
        <label>Telefone:
          <input type="text" name="telefone" value={clientData.telefone} onChange={handleChange} />
        </label>
        <label>Documento:
          <input type="text" name="documento" value={clientData.documento} onChange={handleChange} />
        </label>
        <label>Foto:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {fotoPreview && <img src={fotoPreview} alt="Pré-visualização" className="thumbnail" />}
        <button type="submit">Salvar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default EditClientInfo;
