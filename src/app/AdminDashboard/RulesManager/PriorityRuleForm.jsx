import React, { useContext, useState } from 'react';
import Calendarioinline from '../../Components/calendarioinline';
import WeekdayPicker from './WeekdayPicker';
import { RulesContext } from './RulesContext';
import RuleButtons from './RuleButtons';
import MensagemAlert from '../../Components/MensagemAlert/MensagemAlert';
import './PriorityRuleForm.css';

const PriorityRuleForm = ({ priority }) => {
  const { checkIn, checkOut, setCheckIn, setCheckOut, mensagem, ruleData, setRuleData } = useContext(RulesContext);
  const [customCode, setCustomCode] = useState('');
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="priority-rule-form">
      <div className="row">
        <div className="col d-flex justify-content-center">
          {priority === 0 && (
            <Calendarioinline checkIn={checkIn} checkOut={checkOut} handleDateChange={{ setCheckIn, setCheckOut }} />
          )}
          {priority === 2 && (
            <WeekdayPicker
              layout="stacked"
              checkInDay={checkIn}
              setCheckInDay={setCheckIn}
              checkOutDay={checkOut}
              setCheckOutDay={setCheckOut}
            />
          )}
        </div>

        <div className="col-md-8">
          {priority === 1 ? (
            <div className="priority-1-settings">
              <label>Editor de Código (JSON)</label>
              <textarea
                className="form-control"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                rows={6}
              />
              <label>Ou carregue um arquivo:</label>
              <input type="file" className="form-control" onChange={handleFileUpload} accept=".json" />
            </div>
          ) : (
            <div className="input-group">
              <span className="input-group-text">Vagas Disponibilizadas</span>
              <input
                type="number"
                className="form-control"
                placeholder="Digite o número de vagas"
                value={ruleData.maxQuantity || ''}
                onChange={(e) => setRuleData({ ...ruleData, maxQuantity: e.target.value })}
              />
            </div>
          )}
          <RuleButtons />
        </div>
      </div>

      {mensagem && <MensagemAlert mensagem={mensagem} alertType="warning" />}
    </div>
  );
};

export default PriorityRuleForm;