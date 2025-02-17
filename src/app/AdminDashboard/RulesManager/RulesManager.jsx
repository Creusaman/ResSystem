import React, { useContext } from 'react';
import Navbar from '../../Components/Navbar/navbar';
import AccommodationPanel from './AccommodationPanel';
import PriorityDropdown from './priorityDropdown';
import PriorityRuleForm from './PriorityRuleForm';
import RuleButtons from './RuleButtons';
import { useRules } from './RulesContext';

const RulesManager = () => {
  const { selectedAccommodation, ruleData, dispatch } = useRules();

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1 className="text-center">Gerenciador de Regras de Reserva</h1>
        
        <div className="row">
          <div className="col-md-6">
            <AccommodationPanel />
          </div>
          <div className="col-md-6">
            <PriorityDropdown />
          </div>
        </div>
        
        <div className="row">
          <PriorityRuleForm priority={ruleData.priority} />
        </div>
        
        <div className="row mt-4">
          <h2>Resumo</h2>
          <p>Acomodação: {selectedAccommodation?.nome || 'Nenhuma selecionada'}</p>
          <p>Check-In: {ruleData.checkIn || 'N/A'}</p>
          <p>Check-Out: {ruleData.checkOut || 'N/A'}</p>
          <p>Pacote: {ruleData.package}</p>
          <p>Preço: R$ {ruleData.price}</p>
          <p>Quantidade Máxima: {ruleData.maxQuantity}</p>
          <p>Pessoas Adicionais Máx.: {ruleData.maxAdditionalPeople}</p>
          <p>Preço por Pessoa Adicional: R$ {ruleData.pricePerAdditionalPerson}</p>
          <p>Prioridade: {ruleData.priority}</p>
        </div>
        
        <RuleButtons />
      </div>
    </div>
  );
};

export default RulesManager;
