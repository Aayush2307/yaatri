'use client';
import type { ReactNode } from 'react';

export function MeeraMessage({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 5 }}>
      <div
        style={{
          maxWidth: '88%',
          padding: '14px 18px',
          background: 'rgba(26,20,16,0.72)',
          border: '1px solid var(--meera-border)',
          borderLeft: '2px solid rgba(212,168,83,0.5)',
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          fontFamily: 'var(--meera-font-display)',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 16,
          lineHeight: 1.75,
          color: 'var(--meera-text-primary)',
        }}
      >
        {children}
      </div>
      <span
        style={{
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'var(--meera-text-dim)',
          fontFamily: 'var(--meera-font-label)',
        }}
      >
        Meera
      </span>
    </div>
  );
}

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
      <div
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          background: 'rgba(232,132,58,0.1)',
          border: '1px solid rgba(232,132,58,0.22)',
          borderRadius: 2,
          fontFamily: 'var(--meera-font-body)',
          fontWeight: 300,
          fontSize: 15,
          lineHeight: 1.65,
          color: 'var(--meera-pale-gold)',
          textAlign: 'right',
        }}
      >
        {children}
      </div>
      <span
        style={{
          fontSize: 10,
          letterSpacing: '0.12em',
          color: 'var(--meera-text-dim)',
          fontFamily: 'var(--meera-font-label)',
        }}
      >
        You
      </span>
    </div>
  );
}
