import React, { useContext } from 'react';
import { RulesContext } from '../rulesContext';
import './RulesActions.css';

const RulesActions = () => {
  const {
    clearData,
    isEditing,
    pushEditarRegra,
    selectedPacote,
    preco,
    checkIn,
    checkOut,
    quantidadeMax,
    quantidadeMaxPessoasAdicionais,
    precoPorPessoaAdicional,
    criarRegra,
    validateFields,
    priority,
  } = useContext(RulesContext);

  const handleCreateOrEdit = () => {
    const validationResult = validateFields();
    if (validationResult) {
      if (isEditing) {
        pushEditarRegra(
          selectedPacote,
          preco,
          checkIn,
          checkOut,
          quantidadeMax,
          quantidadeMaxPessoasAdicionais,
          precoPorPessoaAdicional,
          priority
        );
      } else {
        criarRegra(
          selectedPacote,
          preco,
          checkIn,
          checkOut,
          quantidadeMax,
          quantidadeMaxPessoasAdicionais,
          precoPorPessoaAdicional,
          priority
        );
      }
    }
  };

  return (
    <div className="rule-actions-container">
      <button onClick={clearData} className="btn btn-outline-primary">
        {isEditing ? 'Cancelar' : 'Limpar Campos'}
      </button>
      <button onClick={handleCreateOrEdit} className={`btn ${isEditing ? 'btn-warning' : 'btn-success'}`}>
        {isEditing ? 'Editar Regra' : 'Criar Nova Regra'}
      </button>
    </div>
  );
};

export default RulesActions;
