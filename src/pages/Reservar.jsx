import React, { useState, useEffect } from "react";
import AccommodationCard from "../components/AccommodationCard";
import DatePickerComponent from "../components/DatePickerComponent";
import calculateAccommodationPrice from "../services/calculateAccommodationPrice";
import "./Reservar.css";

function Reservar({ accommodations }) {
  const [accommodationData, setAccommodationData] = useState([]);
  const [selectedCheckIn, setSelectedCheckIn] = useState(new Date());
  const [selectedCheckOut, setSelectedCheckOut] = useState(new Date());

  useEffect(() => {
    const fetchPrices = async () => {
      const updatedAccommodations = await Promise.all(
        accommodations.map(async (acc) => {
          const priceData = await calculateAccommodationPrice(selectedCheckIn, selectedCheckOut, acc.id, acc.userQuantity);
          return { ...acc, ...priceData };
        })
      );
      setAccommodationData(updatedAccommodations);
    };

    fetchPrices();
  }, [accommodations, selectedCheckIn, selectedCheckOut]);

  const handleDateChange = (newCheckIn, newCheckOut) => {
    setSelectedCheckIn(newCheckIn);
    setSelectedCheckOut(newCheckOut);
  };

  return (
    <section id="reservar">
      <div className="container">
        <h1>Faça sua Reserva!</h1>
        <DatePickerComponent checkIn={selectedCheckIn} checkOut={selectedCheckOut} onChange={handleDateChange} />
        <div className="accommodation-list">
          {accommodationData.map((acc) => (
            <AccommodationCard key={acc.id} accommodation={acc} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reservar;
