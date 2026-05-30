'use client';
import { useEffect, useRef } from 'react';
import { useMeera, type SceneKey } from './MeeraContext';

const SCENES: Record<SceneKey, { accent: string; colors: string[] }> = {
  default: { accent: '#8B4513', colors: ['#1A0D05', '#2D1A0A', '#1A1008', '#0D0804'] },
  dawn:    { accent: '#C4611E', colors: ['#1A0A0A', '#2D1408', '#3D1C0A', '#1A0D08'] },
  gold:    { accent: '#D4A853', colors: ['#0D0D08', '#1A1A08', '#2D2A10', '#1A180A'] },
  deep:    { accent: '#4A7AB5', colors: ['#080D14', '#0A1220', '#0D1828', '#080A10'] },
  fire:    { accent: '#8B2500', colors: ['#140808', '#201008', '#2D1808', '#140A04'] },
};

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

type Blob = { x: number; y: number; r: number; vx: number; vy: number; opacity: number };

export function CinematicBackground() {
  const { scene } = useMeera();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(scene);
  const blobsRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => { sceneRef.current = scene; }, [scene]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      blobsRef.current = Array.from({ length: 6 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 200 + Math.random() * 350,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: 0.4 + Math.random() * 0.3,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const s = SCENES[sceneRef.current] ?? SCENES.default;
      const W = canvas.width;
      const H = canvas.height;

      const bg = ctx.createRadialGradient(W * 0.5, H * 0.6, 0, W * 0.5, H * 0.5, W * 0.8);
      bg.addColorStop(0, s.colors[0]);
      bg.addColorStop(1, s.colors[1]);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const rgb = hexToRgb(s.accent);
      for (const b of blobsRef.current) {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r;
        if (b.y > H + b.r) b.y = -b.r;
        const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        grad.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},${b.opacity * 0.18})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      />
      {/* Grain overlay */}
      <div
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />
      {/* Vignette */}
      <div
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(10,6,4,0.82) 100%)',
        }}
      />
    </>
  );
}
