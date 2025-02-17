// src/Context/SharedContextProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import { fetchAllAccommodations, fetchRulesForAccommodation } from '../services/firestoreService';
import { specialDate } from '../services/specialDate';

export const SharedContext = createContext();

export const SharedContextProvider = ({ children }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [specialDates, setSpecialDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllAccommodations()
      .then(setAccommodations)
      .catch((err) => {
        setError('Erro ao buscar acomodações.');
        console.error(err);
      });
  }, []);

  useEffect(() => {
    try {
      const year = new Date().getFullYear();
      const carnavalDates = specialDate.isCarnaval(year);
      const reveillonDates = specialDate.isRevellion(year);
      setSpecialDates([...carnavalDates, ...reveillonDates]);
    } catch (err) {
      setError('Erro ao calcular datas especiais.');
      console.error(err);
    }
  }, []);

  return (
    <SharedContext.Provider value={{ accommodations, specialDates, error }}>
      {children}
    </SharedContext.Provider>
  );
};

export default SharedContextProvider;
