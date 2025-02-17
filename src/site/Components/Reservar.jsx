import React from "react";
import Calendario from "./calendario";


function Reservar(){
    return <section id="reservar">
        <div className="container">
            <div className="row">

                <div className="col-lg-9">
                <h1>Faça já a sua reserva!</h1>                     
                </div>

                <div className="col-lg-3">
                    <div><h4>Check-in / Check-Out</h4></div>
                    <div><Calendario/></div>                        
                </div>

            </div>
        </div>
    </section>;
  }

  export default Reservar;