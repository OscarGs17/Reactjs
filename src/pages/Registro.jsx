import React from 'react';
import MainRegistro from '../components/MainRegistro';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '../assets/styles/registro.css';

const Registro = () => {
  return (
    <div className='contenido-registro'>
      <MainRegistro />
    </div>
  );
};

export default Registro;