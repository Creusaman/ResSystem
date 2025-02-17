import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './listacliente.css';

const ListaClientes = memo(({ arrayClientes, clickDelete }) => {
  return (
    <table className="table table-hover table-bordered">
      <thead>
        <tr className="table-secondary">
          <th scope="col">Código</th>
          <th scope="col">Nome</th>
          <th scope="col">E-mail</th>
          <th scope="col">Telefone</th>
          <th scope="col">Documento</th>
          <th scope="col">Foto</th>
          <th scope="col">Entrada</th>
          <th scope="col">Saída</th>
          <th scope="col">Valor Pago</th>
          <th scope="col">Status da Reserva</th>
          <th scope="col" className="col-acao"></th>
        </tr>
      </thead>
      <tbody>
        {arrayClientes.map((cliente) => (
          <tr key={cliente.id}>
            <th scope="row">{cliente.id}</th>
            <td>{cliente.nome}</td>
            <td>{cliente.email}</td>
            <td>{cliente.fone}</td>
            <td>{cliente.documento}</td>
            <td>
              {cliente.foto ? <img src={cliente.foto} alt="Foto do cliente" className="thumbnail" /> : <span>Sem foto</span>}
            </td>
            <td>{cliente.entrada}</td>
            <td>{cliente.saida}</td>
            <td>{cliente.valorpago}</td>
            <td>{cliente.status}</td>
            <td>
              <Link to={`/app/editarcliente/${cliente.id}`}><i className="fas fa-edit icone-acao"></i></Link>
              <Link to="#" onClick={() => clickDelete(cliente.id)}><i className="far fa-trash-alt icone-acao red"></i></Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default ListaClientes;
