import React, { useState, useEffect } from 'react';
import { Ticket, Sparkles, CheckCircle2, AlertCircle, Hash, BadgeCheck } from 'lucide-react';
import { supabase } from '../supabaseClient';

const COLORES = [
  { id: '#e11d48', nombre: 'Rojo' },
  { id: '#16a34a', nombre: 'Verde' },
  { id: '#f59e0b', nombre: 'Dorado' },
  { id: '#0284c7', nombre: 'Azul' },
  { id: '#9333ea', nombre: 'Morado' },
  { id: '#f8fafc', nombre: 'Nieve' },
];

const ACCESORIOS = [
  { id: 'santa', nombre: 'Gorro Santa' },
  { id: 'reno', nombre: 'Reno' },
  { id: 'corona', nombre: 'Corona' },
  { id: 'bufanda', nombre: 'Bufanda' },
  { id: 'ninguno', nombre: 'Sin extra' },
];

const EXPRESIONES = [
  { id: 'feliz', nombre: 'Feliz' },
  { id: 'cool', nombre: 'Cool' },
  { id: 'tierno', nombre: 'Tierno' },
];

function AvatarPreview({ color, accesorio, expresion, tamano = 96 }) {
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 16 16"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        margin: '0 auto',
        filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.75))',
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

      {expresion === 'cool' ? (
        <g>
          <rect x="4" y="8" width="8" height="2" fill="#0f172a" />
          <rect x="5" y="8" width="2" height="1" fill="#38bdf8" />
          <rect x="9" y="8" width="2" height="1" fill="#38bdf8" />
        </g>
      ) : expresion === 'tierno' ? (
        <g fill="#0f172a">
          <rect x="5" y="8" width="2" height="2" />
          <rect x="5" y="8" width="1" height="1" fill="#ffffff" />
          <rect x="9" y="8" width="2" height="2" />
          <rect x="9" y="8" width="1" height="1" fill="#ffffff" />
          <rect x="7" y="10" width="2" height="1" fill="#fb7185" />
        </g>
      ) : (
        <g fill="#0f172a">
          <rect x="5" y="8" width="1" height="2" />
          <rect x="10" y="8" width="1" height="2" />
          <rect x="4" y="10" width="1" height="1" fill="#fb7185" />
          <rect x="11" y="10" width="1" height="1" fill="#fb7185" />
          <rect x="7" y="10" width="2" height="1" />
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
          <rect x="11" y="1" width="1" height="3" />
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
        </g>
      )}
    </svg>
  );
}

function obtenerDeviceHash() {
  let hash = localStorage.getItem('rc_device_id');
  if (!hash) {
    const huella = [
      navigator.userAgent,
      navigator.language,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      Math.random().toString(36).slice(2, 10),
    ].join('|');
    let acc = 0;
    for (let i = 0; i < huella.length; i++) {
      acc = (acc << 5) - acc + huella.charCodeAt(i);
      acc |= 0;
    }
    hash = `dev_${Math.abs(acc).toString(16)}_${Date.now().toString(36)}`;
    localStorage.setItem('rc_device_id', hash);
  }
  return hash;
}

export default function RegistroQR() {
  const [numeroEmpleado, setNumeroEmpleado] = useState('');
  const [folioBrazalete, setFolioBrazalete] = useState('');
  const [skin, setSkin] = useState({
    color: '#e11d48',
    accesorio: 'santa',
    expresion: 'feliz',
  });

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [boleto, setBoleto] = useState(() => {
    try {
      const guardado = localStorage.getItem('rc_boleto_2026');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    obtenerDeviceHash();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (enviando) return;

    const empLimpio = numeroEmpleado.trim();
    const folioLimpio = folioBrazalete.trim().toUpperCase();

    if (!empLimpio || !folioLimpio) {
      setError('Ingresa tu número de empleado y el folio de tu brazalete.');
      return;
    }

    setEnviando(true);
    setError('');

    try {
      const deviceHash = obtenerDeviceHash();
      const { data, error: rpcError } = await supabase.rpc('registrar_participante_seguro', {
        p_numero_empleado: empLimpio,
        p_folio_brazalete: folioLimpio,
        p_device_hash: deviceHash,
        p_skin: skin,
      });

      if (rpcError) {
        throw new Error(rpcError.message || 'No se pudo completar el registro.');
      }

      const registroConfirmado = {
        ...data,
        skin,
      };
      setBoleto(registroConfirmado);
      localStorage.setItem('rc_boleto_2026', JSON.stringify(registroConfirmado));
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  if (boleto) {
    return (
      <main
        style={{
          minHeight: '100dvh',
          width: '100%',
          background: 'radial-gradient(circle at top, #1e1014 0%, #070a12 75%, #03050a 100%)',
          color: '#ffffff',
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 16px 34px 16px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '410px',
            backgroundColor: 'rgba(15, 23, 42, 0.94)',
            border: '2.5px solid #10b981',
            borderRadius: '26px',
            padding: '26px 22px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.85), 0 0 28px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#34d399', marginBottom: '8px' }}>
            <CheckCircle2 size={24} />
            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '13px', letterSpacing: '1.5px' }}>
              REGISTRO CONFIRMADO
            </span>
          </div>

          <h1 style={{ margin: '0 0 14px 0', fontSize: '22px', fontWeight: 800, color: '#fde68a' }}>
            ¡Ya estás dentro de la Tómbola!
          </h1>

          <div style={{ margin: '10px 0 16px 0' }}>
            <AvatarPreview
              color={boleto.skin?.color}
              accesorio={boleto.skin?.accesorio}
              expresion={boleto.skin?.expresion}
              tamano={104}
            />
          </div>

          <div
            style={{
              backgroundColor: 'rgba(2, 6, 23, 0.85)',
              border: '1.5px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>COLABORADOR</div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                {boleto.nombre}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(148,163,184,0.2)', paddingTop: '10px' }}>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>NO. EMPLEADO</div>
                <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'monospace', color: '#fbbf24' }}>
                  {boleto.numero_empleado}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#94a3b8' }}>BRAZALETE</div>
                <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'monospace', color: '#34d399' }}>
                  {boleto.folio_brazalete}
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '16px', lineHeight: 1.45 }}>
            Conserva tu brazalete físico puesto. Si tu personaje sale en la pantalla principal, preséntate con tu brazalete para reclamar tu premio.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        width: '100%',
        background: 'radial-gradient(circle at top, #1e1014 0%, #070a12 75%, #03050a 100%)',
        color: '#ffffff',
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px 16px 34px 16px',
        boxSizing: 'border-box',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          border: '2px solid rgba(251, 191, 36, 0.7)',
          borderRadius: '26px',
          padding: '22px 20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(251, 191, 36, 0.14)',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              padding: '4px 12px',
              borderRadius: '999px',
              marginBottom: '6px',
            }}
          >
            <Sparkles size={13} color="#fbbf24" />
            <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#fde68a' }}>
              TÓMBOLA NAVIDEÑA RED CENTRAL
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#ffffff' }}>
            Crea tu Personaje y Participa
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
            Solo ingresa tu número de empleado y el folio de tu brazalete.
          </p>
        </div>

        {/* Vista previa y personalización del avatar */}
        <div
          style={{
            backgroundColor: 'rgba(2, 6, 23, 0.75)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '18px',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <AvatarPreview color={skin.color} accesorio={skin.accesorio} expresion={skin.expresion} tamano={88} />

          <div>
            <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#fde68a', marginBottom: '6px' }}>
              COLOR DE PERSONAJE
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {COLORES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSkin((s) => ({ ...s, color: c.id }))}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: c.id,
                    border: skin.color === c.id ? '3px solid #fbbf24' : '2px solid #1e293b',
                    transform: skin.color === c.id ? 'scale(1.15)' : 'scale(1)',
                    cursor: 'pointer',
                  }}
                  title={c.nombre}
                />
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '4px' }}>
                ACCESORIO
              </label>
              <select
                value={skin.accesorio}
                onChange={(e) => setSkin((s) => ({ ...s, accesorio: e.target.value }))}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '16px',
                }}
              >
                {ACCESORIOS.map((a) => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', fontFamily: 'monospace', color: '#94a3b8', marginBottom: '4px' }}>
                EXPRESIÓN
              </label>
              <select
                value={skin.expresion}
                onChange={(e) => setSkin((s) => ({ ...s, expresion: e.target.value }))}
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  borderRadius: '10px',
                  padding: '8px',
                  fontSize: '16px',
                }}
              >
                {EXPRESIONES.map((ex) => (
                  <option key={ex.id} value={ex.id}>{ex.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Únicamente Número de Empleado y Folio de Brazalete */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#fde68a',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              <BadgeCheck size={15} color="#fbbf24" />
              <span>NÚMERO DE EMPLEADO</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Ej. 12345678"
              value={numeroEmpleado}
              onChange={(e) => setNumeroEmpleado(e.target.value)}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                border: '2px solid rgba(251, 191, 36, 0.45)',
                borderRadius: '14px',
                padding: '12px 14px',
                fontSize: '16px',
                color: '#ffffff',
                fontFamily: 'monospace',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#fde68a',
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              <Hash size={15} color="#34d399" />
              <span>FOLIO DE BRAZALETE</span>
            </label>
            <input
              type="text"
              placeholder="Ej. RC-0142"
              value={folioBrazalete}
              onChange={(e) => setFolioBrazalete(e.target.value.toUpperCase())}
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                border: '2px solid rgba(52, 211, 153, 0.5)',
                borderRadius: '14px',
                padding: '12px 14px',
                fontSize: '16px',
                color: '#ffffff',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              backgroundColor: 'rgba(225, 29, 72, 0.22)',
              border: '1.5px solid #fb7185',
              color: '#fecdd3',
              padding: '10px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={enviando}
          style={{
            width: '100%',
            minHeight: '52px',
            background: 'linear-gradient(90deg, #dc2626 0%, #e11d48 50%, #d97706 100%)',
            border: '2px solid #fbbf24',
            borderRadius: '16px',
            color: '#ffffff',
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: enviando ? 'not-allowed' : 'pointer',
            opacity: enviando ? 0.65 : 1,
          }}
        >
          <Ticket size={18} />
          <span>{enviando ? 'Validando Padrón...' : 'Obtener mi Boleto'}</span>
        </button>
      </form>
    </main>
  );
}