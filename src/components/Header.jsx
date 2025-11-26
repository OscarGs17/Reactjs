import React from 'react';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="bg-danger text-white d-flex align-items-center justify-content-center">
      <img src={logo} alt="Logo muebleria" width="250" className="m-2" />
    </header>
  );
};

export default Header;