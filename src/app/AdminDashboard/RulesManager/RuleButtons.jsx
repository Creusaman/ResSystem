import React, { useContext } from 'react';
import { RulesContext } from './RulesContext';

const RuleButtons = () => {
  const {
    clearData,
    isEditing,
    editRule,
    createRule,
    validateFields,
  } = useContext(RulesContext);

  const handleCreateOrEdit = () => {
    const validationResult = validateFields();
    if (validationResult !== true) {
      console.error('Erro de validação:', validationResult);
      return;
    }
    
    if (isEditing) {
      editRule();
    } else {
      createRule();
    }
  };

  return (
    <div className="row justify-content-center justify-content-lg-start">
      <div className="col-5 text-center">
        <button onClick={clearData} className="btn btn-outline-primary">
          {isEditing ? 'Cancelar' : 'Limpar campos'}
        </button>
      </div>
      <div className="col-5 text-center">
        <button onClick={handleCreateOrEdit} type="button" className="btn btn-primary">
          {isEditing ? 'Editar regra' : 'Criar nova regra'}
        </button>
      </div>
    </div>
  );
};

export default RuleButtons;
