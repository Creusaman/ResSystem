import React, { useEffect, useState } from "react";
import AccommodationCard from "../components/AccommodationCard";
import { fetchAllAccommodations } from "../services/firestoreService";

function AccommodationsList() {
  const [accommodationsData, setAccommodationsData] = useState([]);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const data = await fetchAllAccommodations();
        setAccommodationsData(data);
      } catch (error) {
        console.error("Erro ao buscar acomodações:", error);
      }
    };

    fetchAccommodations();
  }, []);

  return (
    <div>
      {accommodationsData.length > 0 ? (
        accommodationsData.map((accommodation) => (
          <AccommodationCard key={accommodation.id} accommodation={accommodation} />
        ))
      ) : (
        <p>Nenhuma acomodação disponível.</p>
      )}
    </div>
  );
}

export default AccommodationsList;
