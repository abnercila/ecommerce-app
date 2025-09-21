import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className="spinner-container">
      <div className={`spinner ${size} ${color}`}>
        <div className="spinner-inner">
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
          <div className="spinner-circle"></div>
        </div>
      </div>
      <p className="spinner-text">Cargando productos...</p>
    </div>
  );
};

export default Spinner;