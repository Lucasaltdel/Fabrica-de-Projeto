// src/App.js
import React from 'react';
import React, { useState } from 'react';
import Header from './components/header/header';
import Background from './components/background/background';

import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Background />
      <main>
        {/* Resto do conteúdo da sua página */}
      </main>
    </div>
  );
}

export default App;
