import React, { useState, useEffect } from 'react';
import PantallaQR from './components/pantallaQR';
import RegistroQR from './components/registroQR';
import GarraSorteo from './components/ruletaSorteo';

export default function App() {
  const [ruta, setRuta] = useState(window.location.hash || '#/');

  useEffect(() => {
    const manejarCambioHash = () => {
      setRuta(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', manejarCambioHash);
    return () => window.removeEventListener('hashchange', manejarCambioHash);
  }, []);

  const renderizarVista = () => {
    if (ruta.startsWith('#/registro')) {
      return <RegistroQR />;
    }
    if (ruta.startsWith('#/sorteo')) {
      return <GarraSorteo />;
    }
    return <PantallaQR />;
  };

  return (
    <div style={{ minHeight: '100dvh', width: '100%', margin: 0, padding: 0 }}>
      {renderizarVista()}
    </div>
  );
}