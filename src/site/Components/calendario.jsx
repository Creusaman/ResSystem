import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';


function Calendario() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => { setDateRange(update);}}
      isClearable={true}
      minDate={new Date()}
      locale={ptBR}
      dateFormat="dd-MM-yyyy"
      placeholderText="Escolha as datas!"
    // excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
    // highlightDates={[subDays(new Date(), 7), addDays(new Date(), 7)]}
    />
  );
};

  export default Calendario;