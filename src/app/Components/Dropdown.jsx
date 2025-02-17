import React from 'react';
import './Dropdown.css';

const Dropdown = ({ label, options, selectedValue, onSelect }) => {
  return (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <div className="dropdown">
        <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          {selectedValue || 'Selecione uma opção'}
        </button>
        <ul className="dropdown-menu">
          {options.map((option, index) => (
            <li key={index}>
              <a className="dropdown-item" href="#" onClick={() => onSelect(option.value)}>
                {option.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
