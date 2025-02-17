import React from 'react';

function Menu(){
    return <nav className="navbar fixed-top navbar-expand-md navbar-dark">

    <div className="container-fluid">
            
        <a className="navbar-brand" href="/#">
          <img src="Images/logo.png" alt="" height="28" />
        </a>

        <h4>Pousada e Camping Dunas</h4>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#banner">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#testemunho">Clientes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#preco">Planos e Preços</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#footer">Contato</a>
            </li>
          </ul>
        </div>    
      
    </div>
  </nav>;
  }

export default Menu;