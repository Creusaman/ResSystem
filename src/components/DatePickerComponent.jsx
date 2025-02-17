import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";

function DatePickerComponent({ checkIn, checkOut, onChange, packageSuggestion }) {
  const [selectedCheckIn, setSelectedCheckIn] = useState(checkIn);
  const [selectedCheckOut, setSelectedCheckOut] = useState(checkOut);

  useEffect(() => {
    if (packageSuggestion) {
      setSelectedCheckIn(packageSuggestion.checkIn);
      setSelectedCheckOut(packageSuggestion.checkOut);
    }
  }, [packageSuggestion]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setSelectedCheckIn(start);
    setSelectedCheckOut(end);
    onChange(start, end);
  };

  return (
    <div className="date-picker-container">
      <h3>Selecione as datas da sua estadia</h3>
      {packageSuggestion && (
        <div className="package-alert">
          <p>{packageSuggestion.message}</p>
          <button onClick={() => handleDateChange([packageSuggestion.checkIn, packageSuggestion.checkOut])}>
            Aplicar pacote sugerido
          </button>
        </div>
      )}
      <DatePicker
        selected={selectedCheckIn}
        startDate={selectedCheckIn}
        endDate={selectedCheckOut}
        onChange={handleDateChange}
        selectsRange
        isClearable
        minDate={new Date()}
        locale={ptBR}
        dateFormat="dd-MM-yyyy"
        placeholderText="Escolha as datas!"
        inline
      />
    </div>
  );
}

export default DatePickerComponent;
