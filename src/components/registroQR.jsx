import React, { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { ShieldAlert, Loader2, User, Hash } from 'lucide-react';
import { supabase } from '../supabaseClient';

const COLORES = [
  { id: 'rojo', hex: '#e11d48', nombre: 'Rojo Carmesí' },
  { id: 'verde', hex: '#16a34a', nombre: 'Verde Duende' },
  { id: 'oro', hex: '#f59e0b', nombre: 'Dorado' },
  { id: 'hielo', hex: '#0284c7', nombre: 'Azul Hielo' },
  { id: 'morado', hex: '#9333ea', nombre: 'Uva Navideña' },
  { id: 'nieve', hex: '#f8fafc', nombre: 'Muñeco Nieve' }
];

const ACCESORIOS = [
  { id: 'santa', nombre: '🎅 Gorro Santa' },
  { id: 'reno', nombre: '🦌 Cuernos Reno' },
  { id: 'corona', nombre: '🎄 Corona Pino' },
  { id: 'bufanda', nombre: '🧣 Bufanda Roja' },
  { id: 'ninguno', nombre: '✖ Sin Accesorio' }
];

const EXPRESIONES = [
  { id: 'feliz', nombre: 'FELIZ' },
  { id: 'cool', nombre: 'ROBOTO' },
  { id: 'tierno', nombre: 'JUZGON' }
];

export function MonoPixelArt({ color = '#e11d48', accesorio = 'santa', expresion = 'feliz', tamano = 130 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 16 16"
      style={{
        imageRendering: 'pixelated',
        WebkitOptimizeContrast: 'crisp-edges',
        display: 'block',
        margin: '0 auto',
        filter: 'drop-shadow(0 12px 16px rgba(0, 0, 0, 0.85))'
      }}
    >
      <rect x="3" y="14" width="10" height="2" fill="#000000" opacity="0.45" />
      <rect x="4" y="5" width="8" height="8" fill={color} />
      <rect x="5" y="4" width="6" height="10" fill={color} />
      <rect x="3" y="6" width="10" height="6" fill={color} />

      <rect x="5" y="3" width="6" height="1" fill="#0f172a" />
      <rect x="4" y="4" width="1" height="1" fill="#0f172a" />
      <rect x="11" y="4" width="1" height="1" fill="#0f172a" />
      <rect x="3" y="5" width="1" height="1" fill="#0f172a" />
      <rect x="12" y="5" width="1" height="1" fill="#0f172a" />
      <rect x="2" y="6" width="1" height="6" fill="#0f172a" />
      <rect x="13" y="6" width="1" height="6" fill="#0f172a" />
      <rect x="4" y="13" width="8" height="1" fill="#0f172a" />

      {expresion === 'feliz' && (
        <g fill="#0f172a">
          <rect x="5" y="8" width="1" height="2" />
          <rect x="10" y="8" width="1" height="2" />
          <rect x="4" y="10" width="1" height="1" fill="#fb7185" />
          <rect x="11" y="10" width="1" height="1" fill="#fb7185" />
          <rect x="7" y="10" width="2" height="1" />
        </g>
      )}

      {expresion === 'cool' && (
        <g>
          <rect x="4" y="8" width="8" height="2" fill="#0f172a" />
          <rect x="5" y="8" width="2" height="1" fill="#38bdf8" />
          <rect x="9" y="8" width="2" height="1" fill="#38bdf8" />
          <rect x="7" y="11" width="2" height="1" fill="#0f172a" />
        </g>
      )}

      {expresion === 'tierno' && (
        <g fill="#0f172a">
          <rect x="5" y="8" width="2" height="2" />
          <rect x="5" y="8" width="1" height="1" fill="#ffffff" />
          <rect x="9" y="8" width="2" height="2" />
          <rect x="9" y="8" width="1" height="1" fill="#ffffff" />
          <rect x="7" y="10" width="2" height="1" fill="#fb7185" />
        </g>
      )}

      {accesorio === 'santa' && (
        <g>
          <rect x="4" y="3" width="8" height="1" fill="#ffffff" />
          <rect x="6" y="1" width="4" height="2" fill="#dc2626" />
          <rect x="10" y="2" width="2" height="2" fill="#dc2626" />
          <rect x="12" y="3" width="1" height="1" fill="#ffffff" />
        </g>
      )}

      {accesorio === 'reno' && (
        <g fill="#78350f">
          <rect x="4" y="1" width="1" height="3" />
          <rect x="3" y="1" width="1" height="1" />
          <rect x="11" y="1" width="1" height="3" />
          <rect x="12" y="1" width="1" height="1" />
          <rect x="7" y="9" width="2" height="1" fill="#ef4444" />
        </g>
      )}

      {accesorio === 'corona' && (
        <g>
          <rect x="7" y="0" width="2" height="1" fill="#facc15" />
          <rect x="6" y="1" width="4" height="1" fill="#15803d" />
          <rect x="5" y="2" width="6" height="2" fill="#15803d" />
          <rect x="7" y="2" width="2" height="1" fill="#dc2626" />
          <rect x="5" y="3" width="1" height="1" fill="#facc15" />
          <rect x="10" y="3" width="1" height="1" fill="#facc15" />
        </g>
      )}

      {accesorio === 'bufanda' && (
        <g fill="#dc2626">
          <rect x="4" y="12" width="8" height="1" />
          <rect x="9" y="13" width="2" height="2" />
          <rect x="9" y="14" width="2" height="1" fill="#ffffff" />
        </g>
      )}
    </svg>
  );
}

export default function RegistroQR() {
  const [nombre, setNombre] = useState('');
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [colorSkin, setColorSkin] = useState(COLORES[0].hex);
  const [accesorio, setAccesorio] = useState(ACCESORIOS[0].id);
  const [expresion, setExpresion] = useState(EXPRESIONES[0].id);
  const [deviceHash, setDeviceHash] = useState('');
  const [cargandoFp, setCargandoFp] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [registrado, setRegistrado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initFp = async () => {
      try {
        const fp = await FingerprintJS.load();
        const res = await fp.get();
        setDeviceHash(res.visitorId);
      } catch {
        setDeviceHash(`fp_${window.screen.width}x${window.screen.height}`);
      } finally {
        setCargandoFp(false);
      }
    };
    initFp();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nombreLimpio = nombre.trim();
    const empLimpio = numeroEmpleado.trim().replace(/[\s\-]/g, '').toUpperCase();

    if (nombreLimpio.split(/\s+/).length < 2) {
      setError('Escribe tu nombre completo (Nombre y Apellidos).');
      return;
    }
    if (!empLimpio) {
      setError('Ingresa tu número de empleado.');
      return;
    }

    setEnviando(true);

    try {
      const { data: existentes, error: checkError } = await supabase
        .from('participantes')
        .select('id, numero_empleado, fingerprint')
        .or(`numero_empleado.eq.${empLimpio},fingerprint.eq.${deviceHash}`);

      if (checkError) throw checkError;

      if (existentes && existentes.length > 0) {
        const dupEmp = existentes.find((r) => r.numero_empleado === empLimpio);
        if (dupEmp) {
          throw new Error('Este número de empleado ya está registrado en la tómbola.');
        }
        throw new Error('Ya se registró un participante desde este dispositivo.');
      }

      const { error: insertError } = await supabase
        .from('participantes')
        .insert([
          {
            nombre: nombreLimpio,
            numero_empleado: empLimpio,
            fingerprint: deviceHash,
            skin: { color: colorSkin, accesorio, expresion }
          }
        ]);

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Este número de empleado ya está registrado en la tómbola.');
        }
        throw new Error(insertError.message);
      }

      setRegistrado(true);
    } catch (err) {
      setError(err.message || 'Error al procesar el registro.');
    } finally {
      setEnviando(false);
    }
  };

  if (registrado) {
    return (
      <main
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          color: '#ffffff',
          overflowY: 'auto',
          zIndex: 50,
        }}
      >
        <picture
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100dvh',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <source media="(min-width: 960px)" srcSet={`${import.meta.env.BASE_URL}taller-santa.jpg`} />
          <img
            src={`${import.meta.env.BASE_URL}taller_cel.jpg`}
            alt="Taller de Santa"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />
        </picture>

        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 18, 0.55)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '400px',
            margin: 'auto',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '3px solid #10b981',
            borderRadius: '28px',
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 25px rgba(16, 185, 129, 0.3)',
          }}
        >
          <MonoPixelArt color={colorSkin} accesorio={accesorio} expresion={expresion} tamano={135} />
          <h2
            style={{
              fontFamily: "'Mountains of Christmas', cursive, serif",
              color: '#34d399',
              fontSize: '34px',
              lineHeight: 1.1,
              fontWeight: 700,
              margin: '16px 0 8px 0',
              textShadow: '0 2px 6px rgba(0,0,0,0.8)',
            }}
          >
            ¡Totalplayer en la Tómbola! 🕹️
          </h2>
          <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5', margin: '0 0 20px 0' }}>
            Tu Totalplayer ya fue colocado dentro de la garra para el sorteo en vivo.
          </p>
          <div
            style={{
              backgroundColor: 'rgba(2, 6, 23, 0.8)',
              padding: '14px 16px',
              borderRadius: '16px',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '13px',
              lineHeight: '1.8',
            }}
          >
            <div style={{ color: '#94a3b8' }}>
              Participante: <strong style={{ color: '#ffffff' }}>{nombre}</strong>
            </div>
            <div style={{ color: '#94a3b8' }}>
              No. Empleado: <strong style={{ color: '#fbbf24' }}>{numeroEmpleado.toUpperCase()}</strong>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        width: '100%',
        padding: '20px 16px 32px 16px',
        boxSizing: 'border-box',
        position: 'relative',
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        color: '#ffffff',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <picture
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <source media="(min-width: 960px)" srcSet={`${import.meta.env.BASE_URL}taller-santa.jpg`} />
        <img
          src={`${import.meta.env.BASE_URL}taller_cel.jpg`}
          alt="Taller de Santa"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
        />
      </picture>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&family=Poppins:wght@400;600;800&display=swap');

          .escena-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;
            align-items: center;
            z-index: 10;
          }

          .zona-santa {
            display: none;
          }

          @media (min-width: 960px) {
            .escena-grid {
              grid-template-columns: 1fr 1.1fr 1fr;
              gap: 24px;
            }
            .zona-santa {
              display: block;
              min-height: 350px;
            }
          }

          .input-navidad {
            width: 100%;
            box-sizing: border-box;
            background-color: rgba(2, 6, 23, 0.85);
            border: 2px solid rgba(251, 191, 36, 0.4);
            border-radius: 14px;
            padding: 12px 14px;
            font-size: 16px;
            color: #ffffff;
            outline: none;
            transition: border-color 0.2s;
          }
          .input-navidad:focus {
            border-color: #fbbf24;
          }
        `}
      </style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,15,28,0.45) 0%, rgba(10,15,28,0.25) 50%, rgba(10,15,28,0.75) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <header style={{ textAlign: 'center', zIndex: 10, marginBottom: '12px' }}>
        <h1
          style={{
            fontFamily: "'Mountains of Christmas', cursive, serif",
            fontSize: 'clamp(34px, 5vw, 52px)',
            fontWeight: 700,
            color: '#fbbf24',
            textShadow: '0 3px 10px rgba(220, 38, 38, 0.9), 0 2px 5px #000',
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Personaliza tu Totalplayer
        </h1>
        <p
          style={{
            color: '#fef3c7',
            fontSize: '14px',
            margin: '4px 0 0 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.9)',
            fontWeight: 600,
          }}
        >
          Elige cómo te verás dentro de la Tómbola
        </p>
      </header>

      <form onSubmit={handleSubmit} style={{ width: '100%', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="escena-grid">
          <div className="zona-santa" />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '100%',
                maxWidth: '340px',
                backgroundColor: 'rgba(15, 23, 42, 0.72)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                border: '2px solid rgba(251, 191, 36, 0.6)',
                borderRadius: '26px',
                padding: '18px',
                textAlign: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.75)',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: '#fde68a',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                ★ Vista Previa Totalplayer ★
              </span>
              <MonoPixelArt color={colorSkin} accesorio={accesorio} expresion={expresion} tamano={135} />
            </div>

            <div
              style={{
                width: '100%',
                maxWidth: '340px',
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '2px solid rgba(251, 191, 36, 0.45)',
                borderRadius: '24px',
                padding: '18px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.75)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {error && (
                <div
                  style={{
                    padding: '10px',
                    backgroundColor: 'rgba(225, 29, 72, 0.25)',
                    border: '1px solid #fb7185',
                    color: '#fecdd3',
                    fontSize: '12px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    color: '#fde68a',
                    marginBottom: '5px',
                    fontWeight: 700,
                  }}
                >
                  <User size={14} /> Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Nombre y Apellidos"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="input-navidad"
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    color: '#fde68a',
                    marginBottom: '5px',
                    fontWeight: 700,
                  }}
                >
                  <Hash size={14} /> Número de Empleado
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Ej. 10452391"
                  value={numeroEmpleado}
                  onChange={(e) => setNumeroEmpleado(e.target.value)}
                  className="input-navidad"
                  style={{ fontFamily: 'monospace' }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              margin: '0 auto',
              backgroundColor: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '2px solid rgba(251, 191, 36, 0.55)',
              borderRadius: '26px',
              padding: '20px',
              boxShadow: '0 15px 40px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  color: '#fbbf24',
                  marginBottom: '10px',
                }}
              >
                Selecciona un color para ti
              </label>

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                {COLORES.map((c) => {
                  const activo = colorSkin === c.hex;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setColorSkin(c.hex)}
                      aria-label={c.nombre}
                      style={{
                        backgroundColor: c.hex,
                        width: '44px',
                        height: '44px',
                        minWidth: '44px',
                        minHeight: '44px',
                        borderRadius: '12px',
                        border: activo ? '3px solid #fbbf24' : '2px solid rgba(255,255,255,0.2)',
                        boxShadow: activo ? '0 0 14px rgba(251, 191, 36, 0.9)' : '0 4px 8px rgba(0,0,0,0.5)',
                        cursor: 'pointer',
                        padding: 0,
                        flexShrink: 0,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  color: '#fbbf24',
                  marginBottom: '8px',
                }}
              >
                Selecciona un accesorio para lucir
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {ACCESORIOS.map((acc) => {
                  const activo = accesorio === acc.id;
                  return (
                    <button
                      type="button"
                      key={acc.id}
                      onClick={() => setAccesorio(acc.id)}
                      style={{
                        minHeight: '42px',
                        padding: '8px 10px',
                        borderRadius: '12px',
                        border: activo ? '2px solid #fbbf24' : '1px solid rgba(255,255,255,0.12)',
                        backgroundColor: activo ? 'rgba(245, 158, 11, 0.25)' : 'rgba(2, 6, 23, 0.75)',
                        color: activo ? '#fef08a' : '#cbd5e1',
                        fontWeight: activo ? 800 : 600,
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                      }}
                    >
                      {acc.nombre}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  fontWeight: 800,
                  color: '#fbbf24',
                  marginBottom: '8px',
                }}
              >
                Muestra tu mejor Perfil
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {EXPRESIONES.map((exp) => {
                  const activo = expresion === exp.id;
                  return (
                    <button
                      type="button"
                      key={exp.id}
                      onClick={() => setExpresion(exp.id)}
                      style={{
                        minHeight: '40px',
                        padding: '8px 4px',
                        borderRadius: '12px',
                        border: activo ? '2px solid #4ade80' : '1px solid rgba(255,255,255,0.12)',
                        backgroundColor: activo ? 'rgba(34, 197, 94, 0.25)' : 'rgba(2, 6, 23, 0.75)',
                        color: activo ? '#bbf7d0' : '#cbd5e1',
                        fontWeight: activo ? 800 : 600,
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                      }}
                    >
                      {exp.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '420px', margin: '4px auto 0 auto' }}>
          <button
            type="submit"
            disabled={enviando || cargandoFp}
            style={{
              width: '100%',
              minHeight: '54px',
              padding: '14px 20px',
              background: 'linear-gradient(90deg, #dc2626 0%, #e11d48 50%, #d97706 100%)',
              border: '2px solid #fbbf24',
              borderRadius: '18px',
              color: '#ffffff',
              fontFamily: 'monospace',
              fontWeight: 900,
              fontSize: '15px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '0 10px 30px rgba(220, 38, 38, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              cursor: enviando || cargandoFp ? 'not-allowed' : 'pointer',
              opacity: enviando || cargandoFp ? 0.6 : 1,
            }}
          >
            {enviando ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Colocando en la tómbola...</span>
              </>
            ) : (
              '🎮 Meter Totalplayer a la Tómbola'
            )}
          </button>
        </div>
      </form>
    </main>
  );
}