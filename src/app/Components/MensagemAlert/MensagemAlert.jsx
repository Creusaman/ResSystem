// MensagemAlert.jsx

import React from 'react';

const MensagemAlert = ({ mensagem, alertType = 'danger' }) => {
  if (!mensagem || mensagem.length === 0) return null;

  return (
    <div className="container mt-2">
      <div className="row">
        <div className="col-12">
          <div className={`alert alert-${alertType}`} role="alert">
            {mensagem}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MensagemAlert;
