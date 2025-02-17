import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/navbar';
import ListaClientes from '../ListaCliente/listacliente';
import { useAdmin } from '../../../Context/AdminContextProvider';

function Home() {
  const { fetchAllClients } = useAdmin(); // Use the updated useAdmin hook
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState(null);
  const { isAdmin } = useAdmin(); // Fetch isAdmin from useAdmin

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const data = await fetchAllClients();
        setClientes(data);
      } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        setError('Erro ao carregar os clientes.');
      }
    };
    carregarClientes();
  }, [fetchAllClients]);

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <Navbar />
      <h1>Cadastro de Clientes</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ListaClientes arrayClientes={clientes} clickDelete={() => console.log('Delete logic not implemented')} />
    </div>
  );
}

export default Home;
