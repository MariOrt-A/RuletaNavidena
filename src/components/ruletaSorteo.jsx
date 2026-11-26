import React, { useRef, useState, useEffect } from 'react';
import { Play, Maximize2, Minimize2, Sparkles, Lock, KeyRound, RotateCcw } from 'lucide-react';
import { supabase } from '../supabaseClient';

function MonoPixelArtLocal({ color = '#e11d48', accesorio = 'santa', expresion = 'feliz', tamano = 90 }) {
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
        filter: 'drop-shadow(0 10px 14px rgba(0, 0, 0, 0.85))'
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

export default function GarraSorteo() {
  const canvasRef = useRef(null);
  const bgImgRef = useRef(null);

  const [pinAdmin, setPinAdmin] = useState(() => sessionStorage.getItem('pin_tombola') || '');
  const [pinInput, setPinInput] = useState('');
  const [tiroObjetivoInput, setTiroObjetivoInput] = useState(() => sessionStorage.getItem('tiro_objetivo_tombola') || '1');
  const [tiroGanadorObjetivo, setTiroGanadorObjetivo] = useState(() =>
    Math.max(1, parseInt(sessionStorage.getItem('tiro_objetivo_tombola') || '1', 10))
  );
  const [intentoActualRonda, setIntentoActualRonda] = useState(0);

  const [pinDesbloqueado, setPinDesbloqueado] = useState(() => Boolean(sessionStorage.getItem('pin_tombola')));
  const [errorPin, setErrorPin] = useState('');

  const [jugando, setJugando] = useState(false);
  const [ganador, setGanador] = useState(null);
  const [descartadoReciente, setDescartadoReciente] = useState(null);
  const [historialGanadores, setHistorialGanadores] = useState([]);
  const [error, setError] = useState('');
  const [totalEnUrna, setTotalEnUrna] = useState(null);
  const [esFullscreen, setEsFullscreen] = useState(false);

  const CANVAS_W = 1280;
  const CANVAS_H = 720;

  const RIEL_Y = 38;
  const BOCA_BOTA_X = 218;
  const BOCA_BOTA_Y = 456;

  const garraRef = useRef({
    x: 380,
    y: 70,
    vx: 0,
    angulo: 0,
    pinzaAbierta: true,
    monoAtrapado: null,
    monoCayendo: null
  });

  const peluchesRef = useRef([]);

  useEffect(() => {
    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}fondo_ruleta.jpg`;
    img.onload = () => {
      bgImgRef.current = img;
    };

    const onFsChange = () => setEsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    if (!descartadoReciente) return;
    const timer = setTimeout(() => {
      setDescartadoReciente(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [descartadoReciente]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const procesarPeluchesReales = (avatares = []) => {
    if (!avatares.length) {
      peluchesRef.current = [];
      return;
    }

    const existentesMap = new Map(peluchesRef.current.map((p) => [p.id, p]));
    const muestra = avatares.slice(0, 140);
    const columnas = 22;

    peluchesRef.current = muestra.map((part, i) => {
      const previo = existentesMap.get(part.id);
      if (previo) return previo;

      let skin = { color: '#e11d48', accesorio: 'santa', expresion: 'feliz' };
      if (part.skin && typeof part.skin === 'string') {
        try {
          skin = JSON.parse(part.skin);
        } catch {}
      } else if (part.skin && typeof part.skin === 'object') {
        skin = part.skin;
      }

      const col = i % columnas;
      const fila = Math.floor(i / columnas);

      return {
        id: part.id,
        skin,
        x: 325 + col * 29 + Math.sin(i * 2.3) * 6,
        baseY: 488 - fila * 13 + Math.cos(i * 1.8) * 3,
        y: 488 - fila * 13,
        vx: (0.35 + ((i * 7) % 10) * 0.06) * (i % 2 === 0 ? 1 : -1),
        fase: i * 0.85,
        rotacion: 0
      };
    });
  };

  const cargarParticipantesActivos = async () => {
    try {
      const { data, error: dbError } = await supabase.rpc('obtener_avatares_urna');
      if (dbError) throw dbError;

      if (data) {
        setTotalEnUrna(data.total ?? 0);
        if (data.avatares && data.avatares.length > 0) {
          procesarPeluchesReales(data.avatares);
        } else {
          peluchesRef.current = [];
        }
      }
    } catch (err) {
      console.error('Error al cargar avatares:', err);
    }
  };

  const dibujarCarbonCanvas = (ctx, x, y, escala = 3.0, rot = 0, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rot);

    const s = escala;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
    ctx.fillRect(-4 * s, -8 * s, 2 * s, 2 * s);
    ctx.fillRect(3 * s, -7 * s, 2 * s, 2 * s);
    ctx.fillRect(0, -10 * s, 2 * s, 2 * s);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(-5 * s, 5 * s, 10 * s, 2 * s);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-5 * s, -3 * s, 10 * s, 7 * s);
    ctx.fillRect(-4 * s, -5 * s, 8 * s, 10 * s);
    ctx.fillRect(-6 * s, -1 * s, 12 * s, 4 * s);

    ctx.fillStyle = '#090d16';
    ctx.fillRect(-4 * s, 1 * s, 8 * s, 3 * s);
    ctx.fillRect(2 * s, -3 * s, 3 * s, 5 * s);
    ctx.fillRect(-6 * s, -1 * s, 1 * s, 4 * s);
    ctx.fillRect(5 * s, -1 * s, 1 * s, 4 * s);

    ctx.fillStyle = '#475569';
    ctx.fillRect(-3 * s, -4 * s, 3 * s, 2 * s);
    ctx.fillRect(-4 * s, -1 * s, 2 * s, 2 * s);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-2 * s, -3 * s, 1 * s, 1 * s);
    ctx.fillRect(1 * s, -1 * s, 1 * s, 1 * s);

    ctx.restore();
  };

  const dibujarMonoCanvas = (ctx, mono, x, y, escala = 2.4, rot = 0, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rot);

    const s = escala;
    const color = mono.skin?.color || '#e11d48';
    const acc = mono.skin?.accesorio || 'santa';
    const exp = mono.skin?.expresion || 'feliz';

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(-6 * s, 6 * s, 12 * s, 2 * s);

    ctx.fillStyle = color;
    ctx.fillRect(-5 * s, -4 * s, 10 * s, 8 * s);
    ctx.fillRect(-6 * s, -3 * s, 12 * s, 6 * s);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6 * s, -4 * s, 1 * s, 8 * s);
    ctx.fillRect(5 * s, -4 * s, 1 * s, 8 * s);
    ctx.fillRect(-5 * s, -5 * s, 10 * s, 1 * s);
    ctx.fillRect(-5 * s, 4 * s, 10 * s, 1 * s);

    if (exp === 'cool') {
      ctx.fillRect(-4 * s, -1 * s, 8 * s, 2 * s);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-3 * s, -1 * s, 2 * s, 1 * s);
      ctx.fillRect(1 * s, -1 * s, 2 * s, 1 * s);
    } else {
      ctx.fillRect(-3 * s, -1 * s, 1 * s, 2 * s);
      ctx.fillRect(2 * s, -1 * s, 1 * s, 2 * s);
      ctx.fillStyle = '#fb7185';
      ctx.fillRect(-4 * s, 1 * s, 1 * s, 1 * s);
      ctx.fillRect(3 * s, 1 * s, 1 * s, 1 * s);
    }

    if (acc === 'santa') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5 * s, -6 * s, 10 * s, 1 * s);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-3 * s, -8 * s, 6 * s, 2 * s);
    } else if (acc === 'reno') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-4 * s, -8 * s, 1 * s, 3 * s);
      ctx.fillRect(3 * s, -8 * s, 1 * s, 3 * s);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-1 * s, 0, 2 * s, 1 * s);
    } else if (acc === 'corona') {
      ctx.fillStyle = '#15803d';
      ctx.fillRect(-4 * s, -7 * s, 8 * s, 2 * s);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-1 * s, -7 * s, 2 * s, 1 * s);
    } else if (acc === 'bufanda') {
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-5 * s, 3 * s, 10 * s, 2 * s);
    }
    ctx.restore();
  };

  useEffect(() => {
    if (!pinDesbloqueado) return;
    cargarParticipantesActivos();
    const interval = setInterval(() => {
      if (!jugando) {
        cargarParticipantesActivos();
      }
    }, 50000);
    return () => clearInterval(interval);
  }, [jugando, pinDesbloqueado]);

  useEffect(() => {
    if (!pinDesbloqueado) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

      if (bgImgRef.current) {
        ctx.drawImage(bgImgRef.current, 0, 0, CANVAS_W, CANVAS_H);
      } else {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      }

      const LIMITE_IZQ = 318;
      const LIMITE_DER = 962;

      peluchesRef.current.forEach((mono) => {
        mono.x += mono.vx;

        if (mono.x <= LIMITE_IZQ) {
          mono.x = LIMITE_IZQ;
          mono.vx = Math.abs(mono.vx);
        } else if (mono.x >= LIMITE_DER) {
          mono.x = LIMITE_DER;
          mono.vx = -Math.abs(mono.vx);
        }

        mono.fase += Math.abs(mono.vx) * 0.14;
        const salto = Math.abs(Math.sin(mono.fase)) * 4.5;
        mono.y = mono.baseY - salto;
        mono.rotacion = Math.cos(mono.fase) * 0.14;

        dibujarMonoCanvas(ctx, mono, mono.x, mono.y, 2.4, mono.rotacion);
      });

      const g = garraRef.current;

      if (g.monoCayendo) {
        if (g.monoCayendo.esCarbon) {
          dibujarCarbonCanvas(
            ctx,
            g.monoCayendo.x,
            g.monoCayendo.y,
            3.2,
            g.monoCayendo.rot,
            g.monoCayendo.alpha
          );
        } else {
          dibujarMonoCanvas(
            ctx,
            g.monoCayendo.mono,
            g.monoCayendo.x,
            g.monoCayendo.y,
            3.0,
            g.monoCayendo.rot,
            g.monoCayendo.alpha
          );
        }
      }

      if (bgImgRef.current) {
        const corteY = 499;
        const srcY = (corteY / CANVAS_H) * bgImgRef.current.height;
        const srcH = bgImgRef.current.height - srcY;
        ctx.drawImage(
          bgImgRef.current,
          0, srcY, bgImgRef.current.width, srcH,
          0, corteY, CANVAS_W, CANVAS_H - corteY
        );
      }

      ctx.save();

      const rielX = 115;
      const rielW = CANVAS_W - 230;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(rielX, RIEL_Y + 4, rielW, 14);

      const gradMadera = ctx.createLinearGradient(0, RIEL_Y, 0, RIEL_Y + 14);
      gradMadera.addColorStop(0, '#451a03');
      gradMadera.addColorStop(0.5, '#78350f');
      gradMadera.addColorStop(1, '#290f02');
      ctx.fillStyle = gradMadera;
      ctx.fillRect(rielX, RIEL_Y, rielW, 14);

      ctx.fillStyle = '#d97706';
      ctx.fillRect(rielX, RIEL_Y + 12, rielW, 3);
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(rielX, RIEL_Y + 12, rielW, 1);

      [rielX - 8, rielX + rielW - 10].forEach((sx) => {
        ctx.fillStyle = '#92400e';
        ctx.fillRect(sx, RIEL_Y - 4, 18, 22);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.strokeRect(sx, RIEL_Y - 4, 18, 22);
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sx + 9, RIEL_Y + 7, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = '#881337';
      ctx.beginPath();
      ctx.roundRect(g.x - 28, RIEL_Y - 8, 56, 26, 6);
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(g.x - 10, RIEL_Y + 4, 7, 3.5, -0.4, 0, Math.PI * 2);
      ctx.ellipse(g.x + 10, RIEL_Y + 4, 7, 3.5, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(g.x - 2, RIEL_Y + 5, 3, 0, Math.PI * 2);
      ctx.arc(g.x + 3, RIEL_Y + 6, 3, 0, Math.PI * 2);
      ctx.fill();

      const anguloObjetivo = Math.max(-0.22, Math.min(0.22, -g.vx * 0.022));
      g.angulo += (anguloObjetivo - g.angulo) * 0.16;

      const largoCable = Math.max(0, g.y - 12 - (RIEL_Y + 18));
      const offsetPenduloX = Math.sin(g.angulo) * largoCable * 0.45;
      const cabezalX = g.x + offsetPenduloX;
      const cabezalY = g.y;

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(g.x, RIEL_Y + 18);
      ctx.lineTo(cabezalX, cabezalY - 12);
      ctx.stroke();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(g.x, RIEL_Y + 18);
      ctx.lineTo(cabezalX, cabezalY - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.save();
      ctx.translate(cabezalX, cabezalY);
      ctx.rotate(g.angulo);
      ctx.translate(-cabezalX, -cabezalY);

      const sep = g.pinzaAbierta ? 33 : 15;
      const dibujarTenaza = (lado) => {
        const hombroX = cabezalX + lado * 16;
        const hombroY = cabezalY + 8;
        const codoX = cabezalX + lado * sep;
        const codoY = cabezalY + 32;
        const puntaX = cabezalX + lado * (sep - 11);
        const puntaY = cabezalY + 48;

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 9;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(hombroX, hombroY + 2);
        ctx.lineTo(codoX, codoY + 2);
        ctx.lineTo(puntaX, puntaY + 2);
        ctx.stroke();

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(hombroX, hombroY);
        ctx.lineTo(codoX, codoY);
        ctx.lineTo(puntaX, puntaY);
        ctx.stroke();

        ctx.strokeStyle = '#fde68a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(hombroX, hombroY);
        ctx.lineTo(codoX, codoY);
        ctx.lineTo(puntaX, puntaY);
        ctx.stroke();

        ctx.fillStyle = '#78350f';
        ctx.beginPath();
        ctx.arc(codoX, codoY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(codoX, codoY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#be123c';
        ctx.beginPath();
        ctx.arc(puntaX, puntaY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      };

      dibujarTenaza(-1);
      dibujarTenaza(1);

      const gradCabezal = ctx.createLinearGradient(cabezalX - 22, cabezalY - 14, cabezalX + 22, cabezalY + 14);
      gradCabezal.addColorStop(0, '#9f1239');
      gradCabezal.addColorStop(0.5, '#be123c');
      gradCabezal.addColorStop(1, '#4c0519');

      ctx.fillStyle = gradCabezal;
      ctx.beginPath();
      ctx.roundRect(cabezalX - 22, cabezalY - 14, 44, 26, 8);
      ctx.fill();

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      const pulso = 0.75 + Math.sin(performance.now() * 0.008) * 0.25;
      ctx.fillStyle = `rgba(254, 240, 138, ${pulso})`;
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cabezalX, cabezalY - 1, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (g.monoAtrapado) {
        dibujarMonoCanvas(ctx, g.monoAtrapado, cabezalX, cabezalY + 34, 3.0, 0);
      }

      ctx.restore();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [pinDesbloqueado]);

  const handleDesbloquear = (e) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setErrorPin('Ingresa el PIN de administrador.');
      return;
    }
    const limpio = pinInput.trim();
    const numTiros = Math.max(1, parseInt(tiroObjetivoInput, 10) || 1);

    setPinAdmin(limpio);
    setTiroGanadorObjetivo(numTiros);
    setIntentoActualRonda(0);
    sessionStorage.setItem('pin_tombola', limpio);
    sessionStorage.setItem('tiro_objetivo_tombola', String(numTiros));
    setPinDesbloqueado(true);
    setErrorPin('');
  };

  const handleCambiarTiroObjetivo = (valor) => {
    const num = Math.max(1, parseInt(valor, 10) || 1);
    setTiroGanadorObjetivo(num);
    sessionStorage.setItem('tiro_objetivo_tombola', String(num));
  };

  const handleSiguienteSorteo = () => {
    if (jugando) return;
    setHistorialGanadores([]);
    setGanador(null);
    setDescartadoReciente(null);
    setIntentoActualRonda(0);
    setError('');
  };

  const jugarGarra = async () => {
    if (jugando) return;
    setJugando(true);
    setError('');
    setGanador(null);
    setDescartadoReciente(null);

    const siguienteIntento = intentoActualRonda + 1;
    const esTiroGanador = siguienteIntento >= tiroGanadorObjetivo;

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    try {
      const { data, error: rpcError } = await supabase.rpc('sortear_ganador', {
        p_pin: pinAdmin,
        p_es_ganador: esTiroGanador
      });

      if (rpcError) {
        if (rpcError.message?.toLowerCase().includes('pin')) {
          sessionStorage.removeItem('pin_tombola');
          setPinDesbloqueado(false);
          setErrorPin('PIN incorrecto. Vuelve a ingresarlo.');
          setJugando(false);
          return;
        }
        throw new Error(rpcError.message || 'No quedan participantes disponibles.');
      }

      setTotalEnUrna(data.total_restantes);
      const datosSeleccionado = data.ganador;

      let skinSeleccionado = { color: '#e11d48', accesorio: 'santa', expresion: 'feliz' };
      if (datosSeleccionado.skin && typeof datosSeleccionado.skin === 'string') {
        try {
          skinSeleccionado = JSON.parse(datosSeleccionado.skin);
        } catch {}
      } else if (datosSeleccionado.skin && typeof datosSeleccionado.skin === 'object') {
        skinSeleccionado = datosSeleccionado.skin;
      }

      const monoSeleccionado = {
        id: datosSeleccionado.id,
        folio: datosSeleccionado.folio_brazalete,
        nombre: datosSeleccionado.nombre,
        numero: datosSeleccionado.numero_empleado,
        skin: skinSeleccionado
      };

      const g = garraRef.current;
      const monoEnCaja = peluchesRef.current.find((p) => p.id === monoSeleccionado.id);
      const fallback = peluchesRef.current[Math.floor(Math.random() * peluchesRef.current.length)];
      const objetivo = monoEnCaja || fallback;

      const targetX = objetivo ? objetivo.x : 350 + Math.random() * 580;
      const targetY = 438;
      const startX = g.x;
      const startTime = performance.now();

      const moverX = (now) => {
        const p = Math.min((now - startTime) / 1450, 1);
        const e = easeInOutCubic(p);
        const prevX = g.x;
        g.x = startX + (targetX - startX) * e;
        g.vx = g.x - prevX;

        if (p < 1) {
          requestAnimationFrame(moverX);
        } else {
          g.vx = 0;
          if (objetivo) objetivo.vx = 0;
          setTimeout(bajarGarra, 180);
        }
      };

      const bajarGarra = () => {
        g.pinzaAbierta = true;
        const startY = g.y;
        const bTime = performance.now();
        const animBajar = (now) => {
          const p = Math.min((now - bTime) / 1050, 1);
          const e = easeOutQuad(p);
          g.y = startY + (targetY - startY) * e;
          if (p < 1) {
            requestAnimationFrame(animBajar);
          } else {
            g.pinzaAbierta = false;
            setTimeout(() => {
              g.monoAtrapado = monoSeleccionado;

              peluchesRef.current = peluchesRef.current.filter((item) => item.id !== monoSeleccionado.id);
              if (!monoEnCaja && fallback) {
                peluchesRef.current = peluchesRef.current.filter((item) => item.id !== fallback.id);
              }

              g.y += 6;
              setTimeout(() => {
                g.y -= 6;
                subirGarra();
              }, 120);
            }, 320);
          }
        };
        requestAnimationFrame(animBajar);
      };

      const subirGarra = () => {
        const curY = g.y;
        const sTime = performance.now();
        const animSubir = (now) => {
          const p = Math.min((now - sTime) / 1100, 1);
          const e = easeInOutCubic(p);
          g.y = curY - (curY - 70) * e;
          if (p < 1) requestAnimationFrame(animSubir);
          else llevarALaBota();
        };
        requestAnimationFrame(animSubir);
      };

      const llevarALaBota = () => {
        const curX = g.x;
        const dTime = performance.now();
        const animBota = (now) => {
          const p = Math.min((now - dTime) / 1350, 1);
          const e = easeInOutCubic(p);
          const prevX = g.x;
          g.x = curX + (BOCA_BOTA_X - curX) * e;
          g.vx = g.x - prevX;

          if (p < 1) {
            requestAnimationFrame(animBota);
          } else {
            g.vx = 0;
            setTimeout(soltarEnBota, 220);
          }
        };
        requestAnimationFrame(animBota);
      };

      const soltarEnBota = () => {
        g.pinzaAbierta = true;
        g.monoAtrapado = null;
        g.monoCayendo = {
          mono: monoSeleccionado,
          esCarbon: !esTiroGanador,
          x: BOCA_BOTA_X,
          y: g.y + 38,
          rot: 0,
          alpha: 1
        };

        const dropStartY = g.y + 38;
        const dropTargetY = BOCA_BOTA_Y + 130;
        const dropTime = performance.now();

        const animCaer = (now) => {
          const p = Math.min((now - dropTime) / 650, 1);
          const easeIn = p * p;
          g.monoCayendo.y = dropStartY + (dropTargetY - dropStartY) * easeIn;
          g.monoCayendo.rot = p * 0.65;

          if (p < 1) {
            requestAnimationFrame(animCaer);
          } else {
            g.monoCayendo = null;

            if (esTiroGanador) {
              setGanador(monoSeleccionado);
              setIntentoActualRonda(0);
              setHistorialGanadores((prev) =>
                prev.some((item) => item.id === monoSeleccionado.id)
                  ? prev
                  : [{ ...monoSeleccionado, turno: prev.length + 1 }, ...prev]
              );

              import('canvas-confetti')
                .then((c) => (c.default || c)({ particleCount: 220, spread: 100, origin: { y: 0.6 } }))
                .catch(() => {});
            } else {
              setIntentoActualRonda(siguienteIntento);
              setDescartadoReciente({
                ...monoSeleccionado,
                intento: siguienteIntento,
                objetivo: tiroGanadorObjetivo
              });
            }

            setJugando(false);
            cargarParticipantesActivos();
          }
        };
        requestAnimationFrame(animCaer);
      };

      requestAnimationFrame(moverX);
    } catch (err) {
      setError(err.message);
      setJugando(false);
      garraRef.current.x = 380;
      garraRef.current.y = 70;
      garraRef.current.vx = 0;
      garraRef.current.angulo = 0;
      garraRef.current.pinzaAbierta = true;
      garraRef.current.monoAtrapado = null;
      garraRef.current.monoCayendo = null;
    }
  };

  if (!pinDesbloqueado) {
    return (
      <main
        style={{
          minHeight: '100dvh',
          width: '100vw',
          background: 'radial-gradient(circle at top, #1e1014 0%, #070a12 70%, #03050a 100%)',
          color: '#ffffff',
          fontFamily: "'Poppins', 'Segoe UI', sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <form
          onSubmit={handleDesbloquear}
          style={{
            width: '100%',
            maxWidth: '390px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            border: '2px solid #fbbf24',
            borderRadius: '24px',
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}
          >
            <Lock size={28} color="#fbbf24" />
          </div>

          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#fde68a' }}>
              Cabina de Control Tómbola
            </h2>
            <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              Configura el PIN y en qué tiro saldrá el ganador.
            </p>
          </div>

          {errorPin && (
            <div
              style={{
                padding: '8px 12px',
                backgroundColor: 'rgba(225, 29, 72, 0.25)',
                border: '1px solid #fb7185',
                color: '#fecdd3',
                borderRadius: '10px',
                fontSize: '12px'
              }}
            >
              {errorPin}
            </div>
          )}

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#fde68a', marginBottom: '6px' }}>
              PIN DE ADMINISTRADOR
            </label>
            <input
              type="password"
              placeholder="PIN de acceso"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                border: '2px solid rgba(251, 191, 36, 0.45)',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '16px',
                color: '#ffffff',
                textAlign: 'center',
                fontFamily: 'monospace',
                letterSpacing: '3px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '11px', fontFamily: 'monospace', color: '#fde68a', marginBottom: '6px' }}>
              ¿EN QUÉ TIRO SALE EL GANADOR? (Ej. 1, 3, 5)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={tiroObjetivoInput}
              onChange={(e) => setTiroObjetivoInput(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: 'rgba(2, 6, 23, 0.9)',
                border: '2px solid rgba(251, 191, 36, 0.45)',
                borderRadius: '14px',
                padding: '10px',
                fontSize: '16px',
                color: '#fbbf24',
                fontWeight: 800,
                textAlign: 'center',
                fontFamily: 'monospace',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              minHeight: '48px',
              background: 'linear-gradient(90deg, #dc2626 0%, #d97706 100%)',
              border: '2px solid #fbbf24',
              borderRadius: '14px',
              color: '#ffffff',
              fontFamily: 'monospace',
              fontWeight: 900,
              fontSize: '14px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <KeyRound size={18} />
            <span>Desbloquear Tómbola</span>
          </button>
        </form>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: '100dvh',
        width: '100vw',
        background: 'radial-gradient(circle at top, #1e1014 0%, #070a12 70%, #03050a 100%)',
        color: '#ffffff',
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px 26px 20px',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
        userSelect: 'none'
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&family=Poppins:wght@400;600;800;900&display=swap');

          @keyframes brilloDorado {
            0%, 100% { box-shadow: 0 18px 50px rgba(0,0,0,0.9), 0 0 28px rgba(251, 191, 36, 0.35); }
            50% { box-shadow: 0 18px 55px rgba(0,0,0,0.95), 0 0 42px rgba(251, 191, 36, 0.65); }
          }

          @keyframes entradaCentrada {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.88); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }

          .btn-pantalla-completa {
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 40;
            background-color: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
            WebkitBackdropFilter: blur(8px);
            border: 2px solid rgba(251, 191, 36, 0.5);
            color: #fde68a;
            border-radius: 12px;
            padding: 10px 14px;
            font-family: monospace;
            font-size: 12px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-pantalla-completa:hover {
            border-color: #fbbf24;
            background-color: rgba(30, 41, 59, 0.95);
            transform: scale(1.04);
          }
        `}
      </style>

      <button
        type="button"
        onClick={toggleFullscreen}
        className="btn-pantalla-completa"
        title="Alternar Pantalla Completa"
      >
        {esFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        <span>{esFullscreen ? 'Salir' : 'Pantalla Completa'}</span>
      </button>

      {/* Encabezado */}
      <header style={{ textAlign: 'center', zIndex: 10, width: '100%', maxWidth: '1280px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            border: '2px solid rgba(251, 191, 36, 0.6)',
            padding: '5px 18px',
            borderRadius: '999px',
            marginBottom: '6px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)'
          }}
        >
          <Sparkles size={15} color="#fbbf24" />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#fde68a',
              textTransform: 'uppercase'
            }}
          >
            ¡Mucha Suerte a Todos!
          </span>
          <Sparkles size={15} color="#fbbf24" />
        </div>

        <h1
          style={{
            fontFamily: "'Mountains of Christmas', cursive, serif",
            fontSize: 'clamp(34px, 4.2vw, 56px)',
            fontWeight: 700,
            color: '#fbbf24',
            textShadow: '0 4px 14px rgba(220, 38, 38, 0.95), 0 3px 6px #000',
            margin: 0,
            lineHeight: 1.05
          }}
        >
          Tómbola Navideña Red Central
        </h1>

        {totalEnUrna !== null && (
          <p
            style={{
              color: '#fef3c7',
              fontSize: '15px',
              fontFamily: 'monospace',
              fontWeight: 700,
              margin: '6px 0 0 0',
              textShadow: '0 2px 4px #000'
            }}
          >
            🎄 {totalEnUrna} Totalplayers participando en la caja 🎄
          </p>
        )}
      </header>

      {/* Zona Central: Cabina a la izquierda + Lista de Ganadores a la derecha con altura igualada */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'stretch',
          justifyContent: 'center',
          gap: '20px',
          width: '100%',
          maxWidth: '1540px',
          margin: '10px 0',
          zIndex: 10
        }}
      >
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              width: 'min(66vw, calc(65dvh * 1.777))',
              minWidth: '320px',
              height: 'auto',
              aspectRatio: '16 / 9',
              borderRadius: '26px',
              border: '4px solid #fbbf24',
              animation: 'brilloDorado 4s infinite ease-in-out',
              imageRendering: 'pixelated',
              display: 'block'
            }}
          />

          {/* Tarjeta centrada en la cabina para carbón (descartado) */}
          {descartadoReciente && !jugando && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '86%',
                maxWidth: '500px',
                backgroundColor: 'rgba(15, 23, 42, 0.93)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '3px solid #64748b',
                borderRadius: '24px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95)',
                animation: 'entradaCentrada 0.35s ease-out forwards',
                zIndex: 30
              }}
            >
              <svg width="70" height="70" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', flexShrink: 0 }}>
                <rect x="4" y="2" width="2" height="2" fill="#94a3b8" opacity="0.6" />
                <rect x="10" y="1" width="2" height="2" fill="#94a3b8" opacity="0.6" />
                <rect x="4" y="5" width="8" height="8" fill="#1e293b" />
                <rect x="3" y="7" width="10" height="5" fill="#1e293b" />
                <rect x="5" y="11" width="7" height="3" fill="#090d16" />
                <rect x="5" y="6" width="3" height="2" fill="#475569" />
                <rect x="6" y="6" width="1" height="1" fill="#cbd5e1" />
              </svg>

              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '13px',
                    fontWeight: 900,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    display: 'block'
                  }}
                >
                  🪨 ¡Carbón en la Bota! (Intento {descartadoReciente.intento} de {descartadoReciente.objetivo})
                </span>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 900,
                    color: '#e2e8f0',
                    marginTop: '3px',
                    wordBreak: 'break-word'
                  }}
                >
                  {descartadoReciente.nombre}
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                  Descartado de la urna • Presiona de nuevo
                </span>
              </div>
            </div>
          )}

          {/* Tarjeta del GANADOR centrada en la cabina (fija hasta volver a presionar USAR TOMBOLA) */}
          {ganador && !jugando && (
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '88%',
                maxWidth: '560px',
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '3px solid #10b981',
                borderRadius: '26px',
                padding: '20px 26px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 22px 55px rgba(0, 0, 0, 0.95), 0 0 32px rgba(16, 185, 129, 0.45)',
                animation: 'entradaCentrada 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                zIndex: 30
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <MonoPixelArtLocal
                  color={ganador.skin?.color}
                  accesorio={ganador.skin?.accesorio}
                  expresion={ganador.skin?.expresion}
                  tamano={92}
                />
              </div>

              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "'Mountains of Christmas', cursive, serif",
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#34d399',
                    display: 'block',
                    lineHeight: 1.1
                  }}
                >
                  ¡Ganador en la Bota! 🧦🎁
                </span>
                <div
                  style={{
                    fontSize: 'clamp(19px, 2.3vw, 26px)',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginTop: '4px',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                    textTransform: 'uppercase'
                  }}
                >
                  {ganador.nombre}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                  {ganador.folio && (
                    <span
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid #34d399',
                        padding: '3px 10px',
                        borderRadius: '10px',
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        color: '#6ee7b7',
                        fontWeight: 900
                      }}
                    >
                      Brazalete: {ganador.folio}
                    </span>
                  )}
                  <span
                    style={{
                      backgroundColor: 'rgba(2, 6, 23, 0.85)',
                      border: '1px solid rgba(251, 191, 36, 0.45)',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      color: '#fbbf24',
                      fontWeight: 800
                    }}
                  >
                    Emp: {ganador.numero}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Panel derecho de Ganadores igualado a la altura de la cabina */}
        <aside
          style={{
            width: '320px',
            maxWidth: '92vw',
            maxHeight: 'calc(65dvh)',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '3px solid rgba(251, 191, 36, 0.65)',
            borderRadius: '26px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.85)'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              borderBottom: '1px solid rgba(251, 191, 36, 0.3)',
              paddingBottom: '10px',
              marginBottom: '12px'
            }}
          >
            <h2
              style={{
                fontFamily: "'Mountains of Christmas', cursive, serif",
                fontSize: '28px',
                fontWeight: 700,
                color: '#fbbf24',
                margin: 0,
                lineHeight: 1.1,
                textShadow: '0 2px 6px rgba(0,0,0,0.8)'
              }}
            >
              🏆 Ganadores ({historialGanadores.length})
            </h2>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              paddingRight: '4px'
            }}
          >
            {historialGanadores.length === 0 ? (
              <p
                style={{
                  color: '#94a3b8',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  textAlign: 'center',
                  margin: 'auto 0',
                  padding: '20px 10px'
                }}
              >
                Aún no hay ganadores. ¡Presiona para iniciar el sorteo!
              </p>
            ) : (
              historialGanadores.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: idx === 0 ? 'rgba(16, 185, 129, 0.16)' : 'rgba(2, 6, 23, 0.78)',
                    border: idx === 0 ? '1.5px solid #10b981' : '1px solid rgba(251, 191, 36, 0.25)',
                    borderRadius: '16px',
                    padding: '10px 12px'
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    <MonoPixelArtLocal
                      color={item.skin?.color}
                      accesorio={item.skin?.accesorio}
                      expresion={item.skin?.expresion}
                      tamano={44}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
                    <div
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: idx === 0 ? '#34d399' : '#fbbf24',
                        fontWeight: 800
                      }}
                    >
                      #{item.turno} • {item.folio ? `Folio ${item.folio}` : `Emp ${item.numero}`}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textTransform: 'uppercase'
                      }}
                      title={item.nombre}
                    >
                      {item.nombre}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {error && (
        <div
          style={{
            marginBottom: '10px',
            padding: '10px 18px',
            backgroundColor: 'rgba(225, 29, 72, 0.25)',
            border: '2px solid #fb7185',
            color: '#fecdd3',
            borderRadius: '14px',
            fontFamily: 'monospace',
            fontSize: '13px',
            fontWeight: 700
          }}
        >
          {error}
        </div>
      )}

      {/* Barra de controles inferior unificada: [Ganador en tiro #] + [USAR TOMBOLA] + [SIGUIENTE SORTEO] */}
      <div
        style={{
          width: '100%',
          maxWidth: '940px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          zIndex: 20
        }}
      >
        {/* Selector de tiro ganador (X) */}
        <div
          title="Número de tiro en el que sale el ganador"
          style={{
            height: '58px',
            padding: '0 16px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            border: '2px solid rgba(251, 191, 36, 0.5)',
            borderRadius: '18px',
            color: '#fde68a',
            fontFamily: 'monospace',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxSizing: 'border-box'
          }}
        >
          <span>Ganador en tiro #</span>
          <input
            type="number"
            min="1"
            max="50"
            disabled={jugando}
            value={tiroGanadorObjetivo}
            onChange={(e) => handleCambiarTiroObjetivo(e.target.value)}
            style={{
              width: '48px',
              backgroundColor: '#020617',
              border: '1.5px solid #fbbf24',
              borderRadius: '8px',
              color: '#fbbf24',
              fontWeight: 900,
              fontSize: '14px',
              textAlign: 'center',
              padding: '4px',
              fontFamily: 'monospace',
              outline: 'none'
            }}
          />
          {tiroGanadorObjetivo > 1 && (
            <span style={{ color: '#38bdf8', fontSize: '12px' }}>
              ({intentoActualRonda}/{tiroGanadorObjetivo})
            </span>
          )}
        </div>

        {/* Botón principal USAR TOMBOLA */}
        <button
          type="button"
          onClick={jugarGarra}
          disabled={jugando}
          style={{
            flex: '1 1 280px',
            maxWidth: '380px',
            height: '58px',
            padding: '0 26px',
            background: 'linear-gradient(90deg, #dc2626 0%, #e11d48 50%, #d97706 100%)',
            border: '2px solid #fbbf24',
            borderRadius: '20px',
            color: '#ffffff',
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: '18px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            boxShadow: '0 10px 30px rgba(220, 38, 38, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            cursor: jugando ? 'not-allowed' : 'pointer',
            opacity: jugando ? 0.65 : 1,
            transition: 'transform 0.15s'
          }}
        >
          <Play size={22} className={jugando ? 'animate-spin' : 'fill-white'} />
          <span>{jugando ? 'Atrapando Totalplayer...' : 'USAR TOMBOLA'}</span>
        </button>

        {/* Botón SIGUIENTE SORTEO */}
        <button
          type="button"
          onClick={handleSiguienteSorteo}
          disabled={jugando}
          style={{
            height: '58px',
            padding: '0 22px',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            border: '2px solid rgba(148, 163, 184, 0.45)',
            borderRadius: '20px',
            color: '#e2e8f0',
            fontFamily: 'monospace',
            fontWeight: 800,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: jugando ? 'not-allowed' : 'pointer',
            opacity: jugando ? 0.5 : 1,
            transition: 'all 0.15s'
          }}
          title="Limpia la lista visual de ganadores y reinicia el conteo de intentos para un nuevo premio"
        >
          <RotateCcw size={17} />
          <span>Siguiente Sorteo</span>
        </button>
      </div>

      {/* Firma discreta en la esquina inferior derecha */}
      <footer
        style={{
          position: 'fixed',
          bottom: '6px',
          right: '14px',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: 'rgba(148, 163, 184, 0.55)',
          pointerEvents: 'none',
          zIndex: 15
        }}
      >
        Desarrollado por Mario Ortega Almaraz • Red Central 2026
      </footer>
    </main>
  );
}