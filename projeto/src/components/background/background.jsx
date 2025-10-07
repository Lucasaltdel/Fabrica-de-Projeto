import React from 'react';
import './background.css';

import React, { useState } from 'react';
import useMousePosition from './useMousePosition'; // Assumindo que você salvou o hook

function CursorFollowBackground() {
  const { x, y } = useMousePosition();
  const [gradientSize, setGradientSize] = useState('200px'); // Exemplo de tamanho do gradiente

  const style = {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--size': gradientSize,
    background: 'radial-gradient(circle at var(--x) var(--y), rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 80%)', // Exemplo de gradiente
  };

  return (
    <div style={style} className="background-container">
      {/* Conteúdo do seu componente */}
    </div>
  );
}
