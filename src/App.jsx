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
    <div style={{ minHeight: '100dvh', width: '100%', margin: 0, padding: 0, position: 'relative' }}>
      {renderizarVista()}

      <footer
        style={{
          position: 'fixed',
          bottom: '6px',
          right: '14px',
          zIndex: 35,
          fontSize: '10px',
          fontFamily: 'monospace',
          color: 'rgba(254, 243, 199, 0.45)',
          pointerEvents: 'none',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.9)',
          letterSpacing: '0.5px',
        }}
      >
        Desarrollado por Mario Ortega Almaraz • Red Central 2026 
      </footer>
    </div>
  );
}