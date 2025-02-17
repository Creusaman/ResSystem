import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useRules } from './RulesContext';
import './listaRegras.css';

const RulesList = () => {
  const { rules, dispatch, handleRuleAction, selectedAccommodation, isEditing, ruleId } = useRules();

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return date instanceof Date ? date.toLocaleDateString() : date;
  };

  return (
    <table className="table table-hover table-bordered">
      <thead>
        <tr>
          <th colSpan="9"> 
            {selectedAccommodation ? (
              <h3>Regras de reserva para {selectedAccommodation.nome}</h3>
            ) : (
              <h3>Selecione uma acomodação</h3>
            )}
          </th>
        </tr>
        <tr className="table-secondary">
          <th scope="col">Check-In</th>
          <th scope="col">Check-Out</th>
          <th scope="col">Preço</th>
          <th scope="col">Pacote</th>
          <th scope="col">Vagas</th>
          <th scope="col">Pessoas Adic.</th>
          <th scope="col">Preço por Pessoa Adic.</th>
          <th scope="col">Criado em</th>
          <th scope="col" className="col-acao"></th>
        </tr>
      </thead>
      <tbody>
        {rules.map((regra) => (
          <tr key={regra.id} style={isEditing && ruleId === regra.id ? { backgroundColor: '#fff200' } : {}}>
            <td>{formatDate(regra.CheckIn)}</td>
            <td>{formatDate(regra.CheckOut)}</td>
            <td>R$ {regra.Price}</td>
            <td>{regra.Package}</td>
            <td>{regra.MaxQuantity}</td>
            <td>{regra.MaxAdditionalPeople}</td>
            <td>R$ {regra.PricePerAdditionalPerson}</td>
            <td>{formatDate(regra.CreatedAt)}</td>
            <td>
              <div className="icon-container">
                {isEditing && ruleId === regra.id ? (
                  <button onClick={() => dispatch({ type: 'RESET_RULE_DATA' })} className="btn btn-outline-primary">
                    Cancelar
                  </button>
                ) : (
                  <>
                    <Link to="#" onClick={() => handleRuleAction('copy', regra.id)}>
                      <i className="fas fa-copy icone-acao"></i>
                    </Link>
                    <Link to="#" onClick={() => handleRuleAction('edit', regra.id)}>
                      <i className="fas fa-edit icone-acao"></i>
                    </Link>
                    <Link to="#" onClick={() => handleRuleAction('delete', regra.id)}>
                      <i className="far fa-trash-alt icone-acao red"></i>
                    </Link>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RulesList;
