import React, { useContext } from 'react';
import { useRules } from '../RulesContext';
import './RulesActions.css';

const RulesActions = () => {
  const { handleRuleAction, isEditing, dispatch } = useRules();

  return (
    <div className="rule-actions-container">
      <button onClick={() => dispatch({ type: 'RESET_RULE_DATA' })} className="btn btn-outline-primary">
        {isEditing ? 'Cancelar' : 'Limpar Campos'}
      </button>
      <button
        onClick={() => handleRuleAction(isEditing ? 'edit' : 'create')}
        className={`btn ${isEditing ? 'btn-warning' : 'btn-success'}`}
      >
        {isEditing ? 'Editar Regra' : 'Criar Nova Regra'}
      </button>
    </div>
  );
};

export default RulesActions;
