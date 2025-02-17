import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

function Calendarioinline({ checkIn, checkOut, handleDateChange }) {

  return (
    <form id="datePickerForm">
      <DatePicker
        selected={checkIn}
        startDate={checkIn}
        endDate={checkOut}
        onChange={handleDateChange}
        selectsRange={true}
        isClearable={true}
        minDate={new Date()}
        locale={ptBR}
        dateFormat="dd-MM-yyyy"
        placeholderText="Escolha as datas!"
        inline
        form="datePickerForm"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </form>
  );
}

export default Calendarioinline;
