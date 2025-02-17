import React from 'react';
import './Spinner.css'; // Import the styles from Spinner.css

const Spinner = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="spinner-overlay">
        <div className="spinner"></div>
      </div>
    )
  );
};

export default Spinner;
