import React from 'react';
import Menu from './Components/menu';
import Banner from './Components/banner';
import Features from './Components/features';
import Footer from './Components/footer';
import { initMercadoPago } from '@mercadopago/sdk-react';
import AccommodationsList from './reservationSystem/acommodationList';

initMercadoPago('TEST-d719f90c-28ab-4dc0-b9dd-f914ea56aaa7');

function Site() {
    return (
        <div>
            <Menu />
            <Banner />
            <AccommodationsList />
            <Features />
            <Footer />
           
        </div>
    );
}

export default Site;
