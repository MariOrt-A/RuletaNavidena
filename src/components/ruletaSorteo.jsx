import React, { useRef, useState, useEffect } from 'react';
import { Play, Maximize2, Minimize2, Sparkles } from 'lucide-react';
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

  const [jugando, setJugando] = useState(false);
  const [ganador, setGanador] = useState(null);
  const [mostrarBannerGanador, setMostrarBannerGanador] = useState(false);
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
    if (!mostrarBannerGanador) return;
    const timer = setTimeout(() => {
      setMostrarBannerGanador(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, [mostrarBannerGanador, ganador]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const procesarPeluchesReales = (participantes = []) => {
    if (!participantes.length) {
      peluchesRef.current = [];
      return;
    }

    const existentesMap = new Map(peluchesRef.current.map((p) => [p.id, p]));
    const muestra = participantes.slice(0, 140);
    const columnas = 22;

    peluchesRef.current = muestra.map((part, i) => {
      const previo = existentesMap.get(part.id);
      if (previo) return previo;

      let skin = { color: '#e11d48', accesorio: 'santa', expresion: 'feliz' };
      if (part.skin && typeof part.skin === 'string') {
        try { skin = JSON.parse(part.skin); } catch {}
      } else if (part.skin && typeof part.skin === 'object') {
        skin = part.skin;
      }

      const col = i % columnas;
      const fila = Math.floor(i / columnas);

      return {
        id: part.id,
        folio: part.folio_brazalete,
        nombre: part.nombre,
        numero: part.numero_empleado,
        skin,
        x: 325 + (col * 29) + (Math.sin(i * 2.3) * 6),
        baseY: 488 - (fila * 13) + (Math.cos(i * 1.8) * 3),
        y: 488 - (fila * 13),
        vx: (0.35 + ((i * 7) % 10) * 0.06) * (i % 2 === 0 ? 1 : -1),
        fase: i * 0.85,
        rotacion: 0
      };
    });
  };

  const cargarParticipantesActivos = async () => {
    try {
      const { data, error: dbError } = await supabase.rpc('obtener_avatares_urna');
      if (!dbError && data) {
        setTotalEnUrna(data.total ?? 0);
        procesarPeluchesReales(data.avatares || []);
      }

      setTotalEnUrna(count ?? 0);
      if (data && data.length > 0) {
        procesarPeluchesReales(data);
      } else {
        peluchesRef.current = [];
      }
    } catch (err) {
      console.error('Error al cargar participantes activos:', err);
    }
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
    cargarParticipantesActivos();
    const interval = setInterval(() => {
      if (!jugando) {
        cargarParticipantesActivos();
      }
    }, 50000);
    return () => clearInterval(interval);
  }, [jugando]);

  useEffect(() => {
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

      const largoCable = Math.max(0, (g.y - 12) - (RIEL_Y + 18));
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
  }, []);

  const jugarGarra = async () => {
    if (jugando) return;
    setJugando(true);
    setError('');
    setGanador(null);
    setMostrarBannerGanador(false);

    const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

    try {
      const { data, error: rpcError } = await supabase.rpc('sortear_ganador');
      if (rpcError) throw new Error(rpcError.message || 'No quedan participantes disponibles.');

      setTotalEnUrna(data.total_restantes);
      const datosGanador = data.ganador;

      let skinGanador = { color: '#e11d48', accesorio: 'santa', expresion: 'feliz' };
      if (datosGanador.skin && typeof datosGanador.skin === 'string') {
        try { skinGanador = JSON.parse(datosGanador.skin); } catch {}
      } else if (datosGanador.skin && typeof datosGanador.skin === 'object') {
        skinGanador = datosGanador.skin;
      }

      const monoGanador = {
        id: datosGanador.id,
        folio: datosGanador.folio_brazalete,
        nombre: datosGanador.nombre,
        numero: datosGanador.numero_empleado,
        skin: skinGanador
      };

      const g = garraRef.current;
      const monoEnCaja = peluchesRef.current.find((p) => p.id === monoGanador.id);
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
              g.monoAtrapado = monoGanador;

              peluchesRef.current = peluchesRef.current.filter((item) => item.id !== monoGanador.id);
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
          mono: monoGanador,
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
            setGanador(monoGanador);
            setMostrarBannerGanador(true);
            setHistorialGanadores((prev) =>
              prev.some((item) => item.id === monoGanador.id)
                ? prev
                : [{ ...monoGanador, turno: prev.length + 1 }, ...prev]
            );
            setJugando(false);

            import('canvas-confetti')
              .then((c) => (c.default || c)({ particleCount: 220, spread: 100, origin: { y: 0.6 } }))
              .catch(() => {});

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
        padding: '14px 20px 22px 20px',
        boxSizing: 'border-box',
        position: 'relative',
        overflowX: 'hidden',
        userSelect: 'none',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Mountains+of+Christmas:wght@700&family=Poppins:wght@400;600;800;900&display=swap');

          @keyframes brilloDorado {
            0%, 100% { box-shadow: 0 18px 50px rgba(0,0,0,0.9), 0 0 28px rgba(251, 191, 36, 0.35); }
            50% { box-shadow: 0 18px 55px rgba(0,0,0,0.95), 0 0 42px rgba(251, 191, 36, 0.65); }
          }

          @keyframes entradaGanador {
            0% { opacity: 0; transform: translateX(-50%) scale(0.85) translateY(15px); }
            12% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
            88% { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
            100% { opacity: 0; transform: translateX(-50%) scale(0.95) translateY(10px); }
          }

          .btn-pantalla-completa {
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 40;
            background-color: rgba(15, 23, 42, 0.85);
            backdrop-filter: blur(8px);
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
            boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
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
              textTransform: 'uppercase',
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
            lineHeight: 1.05,
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
              textShadow: '0 2px 4px #000',
            }}
          >
            🎄 {totalEnUrna} Totalplayers participando en la caja 🎄
          </p>
        )}
      </header>

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
          zIndex: 10,
        }}
      >
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            style={{
              width: 'min(68vw, calc(66dvh * 1.777))',
              minWidth: '320px',
              height: 'auto',
              aspectRatio: '16 / 9',
              borderRadius: '26px',
              border: '4px solid #fbbf24',
              animation: 'brilloDorado 4s infinite ease-in-out',
              imageRendering: 'pixelated',
              display: 'block',
            }}
          />

          {ganador && mostrarBannerGanador && !jugando && (
            <div
              style={{
                position: 'absolute',
                bottom: '22px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '540px',
                backgroundColor: 'rgba(15, 23, 42, 0.94)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '3px solid #10b981',
                borderRadius: '26px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.95), 0 0 30px rgba(16, 185, 129, 0.45)',
                animation: 'entradaGanador 6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                zIndex: 30,
              }}
            >
              <div style={{ flexShrink: 0 }}>
                <MonoPixelArtLocal
                  color={ganador.skin?.color}
                  accesorio={ganador.skin?.accesorio}
                  expresion={ganador.skin?.expresion}
                  tamano={84}
                />
              </div>

              <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "'Mountains of Christmas', cursive, serif",
                    fontSize: '26px',
                    fontWeight: 700,
                    color: '#34d399',
                    display: 'block',
                    lineHeight: 1.1,
                  }}
                >
                  ¡Ganador en la Bota! 🧦🎁
                </span>
                <div
                  style={{
                    fontSize: 'clamp(18px, 2.2vw, 24px)',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginTop: '4px',
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                  }}
                >
                  {ganador.nombre}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
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
                        fontWeight: 900,
                      }}
                    >
                      Brazalete: {ganador.folio}
                    </span>
                  )}
                  <span
                    style={{
                      backgroundColor: 'rgba(2, 6, 23, 0.85)',
                      border: '1px solid rgba(251, 191, 36, 0.4)',
                      padding: '3px 10px',
                      borderRadius: '10px',
                      fontFamily: 'monospace',
                      fontSize: '13px',
                      color: '#fbbf24',
                      fontWeight: 800,
                    }}
                  >
                    Emp: {ganador.numero}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside
          style={{
            width: '320px',
            maxWidth: '92vw',
            maxHeight: 'calc(66dvh)',
            backgroundColor: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '3px solid rgba(251, 191, 36, 0.65)',
            borderRadius: '26px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 18px 45px rgba(0, 0, 0, 0.85)',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              borderBottom: '1px solid rgba(251, 191, 36, 0.3)',
              paddingBottom: '10px',
              marginBottom: '12px',
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
                textShadow: '0 2px 6px rgba(0,0,0,0.8)',
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
              paddingRight: '4px',
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
                  padding: '20px 10px',
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
                    padding: '10px 12px',
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
                        fontWeight: 800,
                      }}
                    >
                      #{item.turno} • {item.folio ? `Folio ${item.folio}` : `Emp ${item.numero}`}
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
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
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ width: '100%', maxWidth: '420px', zIndex: 20 }}>
        <button
          type="button"
          onClick={jugarGarra}
          disabled={jugando}
          style={{
            width: '100%',
            minHeight: '58px',
            padding: '14px 28px',
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
            transition: 'transform 0.15s',
          }}
        >
          <Play size={22} className={jugando ? 'animate-spin' : 'fill-white'} />
          <span>{jugando ? 'Atrapando Totalplayer...' : 'USAR TOMBOLA'}</span>
        </button>
      </div>
    </main>
  );
}