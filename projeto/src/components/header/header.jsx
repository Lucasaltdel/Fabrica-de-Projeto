import React from 'react';
import './header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-titulo">
          <img src="./src/img/logo-eficaz.png" alt="Logo" className="header-img" />
          <p className="header-title">
            Gerenciador de Propostas <br/>
            CRM
          </p>
        </div>
        <div className="icon">
          <img className="user-icon" src="./src/img/user-icon.svg" alt="Usuário" />
        </div>
        
      </div>
    </header>
  );
};

export default Header;