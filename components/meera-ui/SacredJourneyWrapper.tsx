'use client';
import type { ReactNode } from 'react';

interface SacredJourneyWrapperProps {
  destination?: string;
  children: ReactNode;
}

export function SacredJourneyWrapper({ destination, children }: SacredJourneyWrapperProps) {
  return (
    <div
      style={{
        background: 'rgba(20, 14, 10, 0.88)',
        border: '1px solid var(--meera-border)',
        borderTop: '2px solid rgba(212,168,83,0.4)',
        borderRadius: 3,
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        marginTop: 8,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--meera-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(212,168,83,0.04)',
        }}
      >
        <span style={{ fontSize: 16 }}>🕉</span>
        <div>
          <div
            style={{
              fontFamily: 'var(--meera-font-label)',
              fontSize: 9,
              letterSpacing: '0.3em',
              color: 'var(--meera-saffron)',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            Your Sacred Journey
          </div>
          {destination && (
            <div
              style={{
                fontFamily: 'var(--meera-font-display)',
                fontSize: 15,
                fontStyle: 'italic',
                color: 'var(--meera-gold)',
              }}
            >
              {destination}
            </div>
          )}
        </div>
      </div>

      {/* Content — untouched */}
      <div style={{ padding: '16px 18px' }}>
        {children}
      </div>

      {/* Footer ornament */}
      <div
        style={{
          padding: '10px 18px',
          borderTop: '1px solid var(--meera-border)',
          textAlign: 'center',
          fontFamily: 'var(--meera-font-label)',
          fontSize: 10,
          letterSpacing: '0.25em',
          color: 'var(--meera-text-dim)',
        }}
      >
        ✦ Curated by Meera · Refine anytime ✦
      </div>
    </div>
  );
}
