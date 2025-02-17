
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { isWeekend, isFriday, set } from 'date-fns';
import 'firebase/firestore';
import { firebaseApp } from '../../Config/firebase';
export const reservationContext = createContext();

export const ReservationContextProvider = ({ children }) => {
  const [acomodações, setAcomodações] = useState([]);
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [selectedAcomodação, setSelectedAcomodação] = useState('');
  const [regraId, setRegraId] = useState('');
  const [preço, setPreço] = useState('');
  const [quantidadeMax, setQuantidadeMax] = useState('');
  const [listaRegras, setListaRegras] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [accommodationAvailability, setAccommodationAvailability] = useState({});
  const [acomodação, setAcomodação] = useState('');
  const db = getFirestore(firebaseApp);
  const isWeekday = (date) => !isWeekend(date);
 

    
    
  useEffect(() => {
    const fetchAccommodations = async () => {
      const accommodationsRef = collection(db, 'Acomodações');
      const accommodationsSnapshot = await getDocs(accommodationsRef);
  
      const accommodationsData = accommodationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      setAcomodações(accommodationsData);
    };
  
    fetchAccommodations();
  }, []);
  


  useEffect(() => {
    const AvaliabilityRules = async (Acomodação, checkIn, checkOut) => {
      const listaRegras = [];

      if (Acomodação && checkIn && checkOut) {
        const rulesRef = collection(db, `Acomodações/${Acomodação}/Regras`);
        const rulesSnapshot = await getDocs(rulesRef);

        rulesSnapshot.docs.forEach((doc) => {
          const data = doc.data();
          if (data.CheckIn && data.CheckOut) {
            const regraCheckIn = data.CheckIn.toDate();
            const regraCheckOut = data.CheckOut.toDate();
            if (
              (regraCheckIn <= checkIn && regraCheckOut >= checkOut) ||
              (regraCheckIn <= checkIn && regraCheckOut >= checkOut)
            ) {
              listaRegras.push({
                id: doc.id,
                ...data,
              });
            }
          }
        });

        if (listaRegras.length > 0) {
          const isAvailable = checkAvailability();
          if (isAvailable) {
            const totalPrice = calcularPreço();
            setAccommodationAvailability('Disponível');
            setPreço(totalPrice);
          } else {
            setAccommodationAvailability('Indisponível');
          }
        }
      }
    }

    AvaliabilityRules(selectedAcomodação, checkIn, checkOut);
  }, [checkIn, checkOut]);

        
  function calcularPreço(){
    const selectedCheckIn = checkIn.toDate();
    const selectedCheckOut = checkOut.toDate();
    const totalDays = Math.ceil((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24));

    // Initialize the array to store prices for each day
    const prices = Array(totalDays).fill(0);

    for (const regra of listaRegras) {
      const ruleCheckIn = regra.CheckIn.toDate();
      const ruleCheckOut = regra.CheckOut.toDate();
      const pacote = regra.Pacote;
      const preço = regra.Preço;
      const prioridade = regra.Prioridade;
      const startIndex = Math.max(0, (ruleCheckIn - selectedCheckIn) / (1000 * 60 * 60 * 24));
      const endIndex = Math.min(totalDays, (ruleCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24));
      const preçoFds = regra.PreçoFds;
      const quantidadeMax = regra.QuantidadeMax;
      const preçoSemana = regra.PreçoSemana;


      if (
        (prioridade === 1) ||
        (selectedCheckIn >= ruleCheckIn && selectedCheckIn <= ruleCheckOut) ||
        (selectedCheckOut >= ruleCheckIn && selectedCheckOut <= ruleCheckOut)
      ) {
          

          for (let i = startIndex; i < endIndex; i++) {
            if (pacote === 'Pacote') {
              prices[i] = Math.min(prices[i] || Infinity, preço / totalDays);
            } else if (pacote === 'Diárias') {
              prices[i] = Math.min(prices[i] || Infinity, preço);
            }
          }
        }
      if (
        (prioridade === 2) ||
        (selectedCheckIn >= ruleCheckIn && selectedCheckIn <= ruleCheckOut) ||
        (selectedCheckOut >= ruleCheckIn && selectedCheckOut <= ruleCheckOut)
      ) {
        for (let i = startIndex; i < endIndex; i++) {
            if (prices[i] === 0) {
              if (pacote === 'pacote') {
                prices[i] = Math.min(prices[i] || Infinity, preço / totalDays);
              } else if (pacote === 'Diárias') {
                prices[i] = Math.min(prices[i] || Infinity, preço);
              }
            }
          }
        }
      if (
        (prioridade === 3) ||
        (selectedCheckIn >= ruleCheckIn && selectedCheckIn <= ruleCheckOut) ||
        (selectedCheckOut >= ruleCheckIn && selectedCheckOut <= ruleCheckOut)
      ) {
        for (let i = startIndex; i < endIndex; i++) {
          const date = new Date(selectedCheckIn+i*24*60*60*1000);
          if (prices[i] === 0) {
            if (isWeekend(date)) {
              prices[i] = Math.min(prices[i] || Infinity, preçoFds);
            } else if (isWeekday(date)) {
              prices[i] = Math.min(prices[i] || Infinity, preçoSemana);
            }
          }
        }
      }
    }
  
    

    setAccommodationAvailability('Disponível');
    const totalPrice = prices.reduce((acc, curr) => acc + curr, 0);
    return totalPrice;
  }


        
  function checkAvailability(){
    const selectedCheckIn = checkIn.toDate();
    const selectedCheckOut = checkOut.toDate();

    const daysInRange = [];
    const availableDays = [];

    // Create an array of dates within the selected range
    const currentDate = new Date(selectedCheckIn);
    while (currentDate <= selectedCheckOut) {
      daysInRange.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Iterate over each rule in listaRegras
    for (const regra of listaRegras) {
      const ruleCheckIn = regra.CheckIn.toDate();
      const ruleCheckOut = regra.CheckOut.toDate();

      // Check if any day in the rule's range is included in the selected range
      const isOverlap = daysInRange.some((day) => {
        return day >= ruleCheckIn && day <= ruleCheckOut;
      });

      if (isOverlap) {
        // Store the available days within the rule's range
        const currentAvailableDays = [];
        const currentDay = new Date(ruleCheckIn);
        while (currentDay <= ruleCheckOut) {
          currentAvailableDays.push(new Date(currentDay));
          currentDay.setDate(currentDay.getDate() + 1);
        }
        availableDays.push(currentAvailableDays);
      }
    }

    // Check if every day in the selected range has an available day in any rule's range
    const isEveryDayAvailable = daysInRange.every((day) => {
      return availableDays.some((availableDay) =>
        availableDay.some((date) => date.getTime() === day.getTime())
      );
    });

    return isEveryDayAvailable;
  };
        
    function fetchSpecialDates() {
      const specialDates = [];
      const checkInYear = checkIn.toDate().getFullYear();
      db.collection(`Carnaval/${checkInYear}`).get()
        .then((resultado) => {
          resultado.docs.forEach((doc) => {
            const data = doc.data();
            if (data.CheckIn && data.CheckOut) {
              const regraCheckIn = data.CheckIn.toDate();
              const regraCheckOut = data.CheckOut.toDate();
              if (
                (regraCheckIn <= checkIn && regraCheckOut >= checkOut) ||
                (regraCheckIn <= checkIn && regraCheckOut >= checkOut)
              ) {
                db.collection(`Acomodações/${acomodação}/Regras`)
                  .get()
                  .then((resultado) => {
                    resultado.docs.forEach((doc) => {
                      const data = doc.data();
                      if (data.pacote === 'Carnaval') {
                        listaRegras.push({
                          id: doc.id,
                          ...data,
                        });
                      }
                    });
                    if (specialDates.length > 0) {
                    const  revellionStart = new Date(checkInYear, 12, 27);
                    const  checkInNextYear = new Date(checkInYear + 1, 1, 3);
                    const  revellionEnd = new Date(checkInNextYear);

                      if (revellionStart <= checkIn && revellionEnd >= checkOut) {
                        db.collection(`Acomodações/${acomodação}/Regras`)
                          .get()
                          .then((resultado) => {
                            resultado.docs.forEach((doc) => {
                              const data = doc.data();
                              if (data.pacote === 'Revellion') {
                                listaRegras.push({
                                  id: doc.id,
                                  ...data,
                                });
                              }
                            });
                          });
                      }
                    }
                  });
              }
            }
          });
        });
      };
    
      



        
  function checkSelectedDates(selectedDates) {
      selectedDates.forEach(date => {
        if (isWeekend(date)) {
          console.log(`${date.toLocaleDateString()} is a weekend.`);
        } else if (isWeekday(date)) {
          console.log(`${date.toLocaleDateString()} is a weekday.`);
        } else {
          console.log(`${date.toLocaleDateString()} is not a weekend or weekday.`);
        }
      });
    }
   
  return (
  <reservationContext.Provider 
    value={{
      acomodações, 
      checkIn, 
      checkOut, 
      setCheckIn, 
      setCheckOut,
      acomodação,
      setAcomodação,
    

    }}>
    
    {children}
  </reservationContext.Provider>
  );

}