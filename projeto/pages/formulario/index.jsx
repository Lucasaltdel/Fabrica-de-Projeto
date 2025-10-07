import React, { useEffect } from 'react';
import Header from '../../src/components/header/header.jsx';

function Home() {
  useEffect(() => {
    document.title = 'He Page';
  }, []);

  return (
    <div>
      <Header />
      {/* Outros conteúdos da página */}
    </div>
  );
}

export default Home;