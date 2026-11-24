import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Sparkles, Smartphone, Gift, TreePine } from 'lucide-react';

export default function PantallaQR() {
  const contenedorRef = useRef(null);
  const [logoUrl] = useState(null);

  const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const urlRegistro = `${baseUrl}#/registro`;

  return (
    <div
      ref={contenedorRef}
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}santaQR.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: '100vw',
        minHeight: '100dvh',
        margin: 0,
        padding: '24px 16px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&family=Poppins:wght@400;600;800&display=swap');
        `}
      </style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(10, 15, 28, 0.25) 0%, rgba(5, 8, 18, 0.72) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <header
        style={{
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 22px',
            backgroundColor: 'rgba(127, 29, 29, 0.88)',
            border: '2px solid #fbbf24',
            borderRadius: '9999px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <TreePine size={20} color="#4ade80" />
          <span
            style={{
              color: '#fef08a',
              fontWeight: 800,
              fontSize: '13px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Sorteo Navideño RED CENTRAL
          </span>
          <TreePine size={20} color="#4ade80" />
        </div>
      </header>

      <main
        style={{
          zIndex: 10,
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '3px solid #f59e0b',
          borderRadius: '28px',
          padding: '28px 24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 25px rgba(245, 158, 11, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          margin: 'auto 0',
        }}
      >
        <h1
          style={{
            fontFamily: "'Mountains of Christmas', cursive, serif",
            fontSize: '46px',
            lineHeight: '1.05',
            fontWeight: 700,
            color: '#fbbf24',
            textShadow: '0 3px 10px rgba(220, 38, 38, 0.85), 0 2px 4px rgba(0,0,0,0.9)',
            margin: '0 0 8px 0',
            letterSpacing: '1px',
          }}
        >
          ¡Escanea y Gana!
        </h1>

        <p
          style={{
            fontSize: '13px',
            color: '#f8fafc',
            lineHeight: '1.5',
            maxWidth: '320px',
            margin: '0 0 20px 0',
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          Apunta la cámara de tu teléfono, personaliza tu peluche y participa en la rifa de fin de año.
        </p>

        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '22px',
            border: '4px solid #dc2626',
            boxShadow: '0 0 0 3px #fbbf24, 0 12px 30px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <QRCodeSVG
            value={urlRegistro}
            size={210}
            level="H"
            includeMargin={false}
            imageSettings={
              logoUrl
                ? {
                    src: logoUrl,
                    height: 46,
                    width: 46,
                    excavate: true,
                  }
                : undefined
            }
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            width: '100%',
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(251, 191, 36, 0.3)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(251, 191, 36, 0.18)',
                border: '1px solid #fbbf24',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
              }}
            >
              <Smartphone size={17} color="#fbbf24" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fef08a', textTransform: 'uppercase' }}>
              1. Escanea
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(74, 222, 128, 0.18)',
                border: '1px solid #4ade80',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
              }}
            >
              <Sparkles size={17} color="#4ade80" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#bbf7d0', textTransform: 'uppercase' }}>
              2. Personaliza
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(248, 113, 113, 0.22)',
                border: '1px solid #f87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '6px',
              }}
            >
              <Gift size={17} color="#f87171" />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fecaca', textTransform: 'uppercase' }}>
              3. ¡Participa!
            </span>
          </div>
        </div>
      </main>

      <footer style={{ zIndex: 10, marginTop: '12px' }}>
        <div
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(251, 191, 36, 0.5)',
            color: '#fef3c7',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)',
          }}
        >
          🎄 ¡Felices Fiestas y Mucho Éxito a Todos! 🎁
        </div>
      </footer>
    </div>
  );
}