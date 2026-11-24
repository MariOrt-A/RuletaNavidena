import React, { useState, useEffect } from 'react';
import PantallaQR from './components/pantallaQR';
import RegistroQR from './components/registroQR';
import RuletaSorteo from './components/ruletaSorteo';

export default function App() {
  const [ruta, setRuta] = useState(window.location.hash || '#/');

  useEffect(() => {
    const cambiar = () => setRuta(window.location.hash || '#/');
    window.addEventListener('hashchange', cambiar);
    return () => window.removeEventListener('hashchange', cambiar);
  }, []);

  const renderVista = () => {
    if (ruta.includes('/registro')) return <RegistroQR />;
    if (ruta.includes('/sorteo')) return <RuletaSorteo />;
    return <PantallaQR />;
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Botones de navegación para la laptop/proyector (se ocultan en celulares y al imprimir) */}
      <nav className="fixed top-3 left-3 z-50 hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-lg backdrop-blur-md text-xs print:hidden">
        <a
          href="#/"
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            !ruta.includes('/registro') && !ruta.includes('/sorteo')
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Cartel QR
        </a>
        <a
          href="#/registro"
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            ruta.includes('/registro')
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Registro Móvil
        </a>
        <a
          href="#/sorteo"
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            ruta.includes('/sorteo')
              ? 'bg-red-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Ruleta
        </a>
      </nav>

      {renderVista()}
    </div>
  );
}