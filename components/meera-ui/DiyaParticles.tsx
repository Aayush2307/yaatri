'use client';
import { useEffect, useRef } from 'react';

export function DiyaParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = '';

    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      const dur = 6 + Math.random() * 10;
      const delay = Math.random() * 8;
      const x = 5 + Math.random() * 90;
      const drift = (Math.random() - 0.5) * 60;
      p.style.cssText = `
        position: absolute;
        width: 2px; height: 2px;
        border-radius: 50%;
        background: var(--meera-gold, #D4A853);
        left: ${x}%;
        bottom: -10px;
        animation: meera-float-up ${dur}s ease-in infinite ${delay}s;
        --drift: ${drift}px;
      `;
      container.appendChild(p);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 3 }}
    />
  );
}
