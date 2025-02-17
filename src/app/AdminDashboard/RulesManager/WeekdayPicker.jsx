import React from 'react';

const WeekdayPicker = ({ checkInDay, setCheckInDay, checkOutDay, setCheckOutDay }) => {
  const weekdays = [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ];

  return (
    <div className="d-flex flex-column gap-2">
      <div>
        <label>Check-in</label>
        <select className="form-select" value={checkInDay} onChange={(e) => setCheckInDay(parseInt(e.target.value, 10))}>
          <option value="">Selecione o dia</option>
          {weekdays.map((day, index) => (
            <option key={index} value={index}>{day}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Check-out</label>
        <select className="form-select" value={checkOutDay} onChange={(e) => setCheckOutDay(parseInt(e.target.value, 10))}>
          <option value="">Selecione o dia</option>
          {weekdays.map((day, index) => (
            <option key={index} value={index}>{day}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default WeekdayPicker;