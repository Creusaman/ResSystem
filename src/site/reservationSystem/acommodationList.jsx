import React, { useEffect, useState } from 'react';
import AccommodationLayout from './accommodationLayout';
import Calendario from '../Components/calendario';
import { fetchAllAccommodations } from '../../services/firestoreService';

function AccommodationsList() {
    const [accommodationsData, setAccommodationsData] = useState([]);
    const [selectedDates, setSelectedDates] = useState([null, null]);
    console.log("Rendering AccommodationsList");
    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const data = await fetchAllAccommodations();
                console.log(data); // Add this line
                setAccommodationsData(data);
            } catch (error) {
                console.error('Error fetching accommodations data:', error);
            }
        };

        fetchAccommodations();
    }, []);

    return (
        <div>
            <div className="row">
                <div className="col-lg-9">
                    <h1>Faça já a sua reserva!</h1>                     
                </div>
                <div className="col-lg-3">
                    <div><h4>Check-in / Check-Out</h4></div>
                    <Calendario onDateChange={setSelectedDates} />                        
                </div>
            </div>
            <div>
                {accommodationsData.map((accommodation) => (
                    <AccommodationLayout key={accommodation.id} data={accommodation} selectedDates={selectedDates} />
                ))}
            </div>
        </div>
    );
}

export default AccommodationsList;
