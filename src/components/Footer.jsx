import React from 'react';

const Footer = () => {
  return (
    <footer
      className="text-white text-center py-3"
      style={{
        background: 'linear-gradient(90deg,rgb(182, 152, 153) 0%,rgb(140, 99, 103) 100%)',
        boxShadow: '0 -3px 10px rgba(131, 119, 120, 0.6)',
        fontWeight: '600',
        letterSpacing: '1px',
        fontSize: '0.9rem',
        position: 'relative',
        bottom: 0,
        width: '100%',
      }}
    >
      <small>&copy; {new Date().getFullYear()} WALLS GS</small>
    </footer>
  );
};

export default Footer;
