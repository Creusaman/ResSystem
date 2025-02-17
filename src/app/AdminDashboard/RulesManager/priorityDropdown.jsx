import React, { useContext } from 'react';
import { useRules } from './RulesContext';

const PriorityDropdown = () => {
  const { ruleData, dispatch } = useRules();

  return (
    <div className="input-group">
      <span className="input-group-text">Prioridade</span>
      <select
        className="form-select"
        value={ruleData.priority}
        onChange={(e) => dispatch({ type: 'UPDATE_RULE_DATA', payload: { priority: parseInt(e.target.value, 10) } })}
      >
        <option value={0}>Prioridade 0 - Regras Especiais</option>
        <option value={1}>Prioridade 1 - Regras de Alta Temporada</option>
        <option value={2}>Prioridade 2 - Regras Gerais</option>
      </select>
    </div>
  );
};

export default PriorityDropdown;
