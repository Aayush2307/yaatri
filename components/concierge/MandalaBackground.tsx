'use client';

import { useEffect, useRef } from 'react';

export default function MandalaBackground() {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: no-preference) {
        .mandala-rotate { animation: mandala-rotate 1200s linear infinite; }
      }
      @keyframes mandala-rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to   { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    styleRef.current = style;
    return () => { style.remove(); };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg
        className="mandala-rotate"
        viewBox="0 0 400 400"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(90vw, 640px)',
          height: 'min(90vw, 640px)',
          opacity: 0.04,
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Concentric circles */}
        {[30, 60, 90, 120, 150, 175].map((r) => (
          <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#C0522A" strokeWidth="0.8" />
        ))}

        {/* 16 radial lines */}
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={200 + 30 * Math.cos(rad)}
              y1={200 + 30 * Math.sin(rad)}
              x2={200 + 175 * Math.cos(rad)}
              y2={200 + 175 * Math.sin(rad)}
              stroke="#C0522A"
              strokeWidth="0.6"
            />
          );
        })}

        {/* 8-pointed star polygon */}
        <polygon
          points={Array.from({ length: 16 }, (_, i) => {
            const r = i % 2 === 0 ? 120 : 70;
            const angle = (i * 360) / 16 - 90;
            const rad = (angle * Math.PI) / 180;
            return `${200 + r * Math.cos(rad)},${200 + r * Math.sin(rad)}`;
          }).join(' ')}
          fill="none"
          stroke="#C9954A"
          strokeWidth="0.8"
        />

        {/* 8 petal circles */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 360) / 8;
          const rad = (angle * Math.PI) / 180;
          const cx = 200 + 105 * Math.cos(rad);
          const cy = 200 + 105 * Math.sin(rad);
          return <circle key={i} cx={cx} cy={cy} r={22} fill="none" stroke="#C0522A" strokeWidth="0.6" />;
        })}

        {/* Inner lotus petals */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 360) / 8;
          const rad = (angle * Math.PI) / 180;
          const cx = 200 + 50 * Math.cos(rad);
          const cy = 200 + 50 * Math.sin(rad);
          return <ellipse key={i} cx={cx} cy={cy} rx="14" ry="8"
            transform={`rotate(${angle}, ${cx}, ${cy})`}
            fill="none" stroke="#C9954A" strokeWidth="0.6" />;
        })}

        {/* Centre dot */}
        <circle cx="200" cy="200" r="5" fill="none" stroke="#C0522A" strokeWidth="1" />
      </svg>
    </div>
  );
}
