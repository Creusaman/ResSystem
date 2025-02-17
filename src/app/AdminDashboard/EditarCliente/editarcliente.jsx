import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Navbar from '../../Components/Navbar/navbar';
import { useAdmin } from '../../../Context/AdminContextProvider';

function EditarCliente() {
  const { fetchClientById, updateClient, isAdmin } = useAdmin();
  const { id } = useParams();
  const [cliente, setCliente] = useState({ nome: '', email: '', fone: '', documento: '', foto: '' });
  const [mensagem, setMensagem] = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);

  useEffect(() => {
    const carregarCliente = async () => {
      try {
        const data = await fetchClientById(id);
        setCliente(data);
        setFotoPreview(data.foto || null);
      } catch (error) {
        console.error('Erro ao buscar cliente:', error);
      }
    };
    carregarCliente();
  }, [fetchClientById, id]);

  const handleInputChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
        setCliente({ ...cliente, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const salvarCliente = async () => {
    try {
      await updateClient(id, cliente);
      setMensagem('Alterações salvas com sucesso!');
    } catch (error) {
      setMensagem('Erro ao salvar alterações.');
      console.error(error);
    }
  };

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <h1>Editar Cliente</h1>
      <form>
        <label>Nome</label>
        <input type="text" name="nome" value={cliente.nome} onChange={handleInputChange} />
        
        <label>Email</label>
        <input type="email" name="email" value={cliente.email} onChange={handleInputChange} />
        
        <label>Telefone</label>
        <input type="tel" name="fone" value={cliente.fone} onChange={handleInputChange} />
        
        <label>Documento</label>
        <input type="text" name="documento" value={cliente.documento} onChange={handleInputChange} />
        
        <label>Foto</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {fotoPreview && <img src={fotoPreview} alt="Pré-visualização" className="thumbnail" />}
        
        <button type="button" onClick={salvarCliente}>Salvar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

export default EditarCliente;
