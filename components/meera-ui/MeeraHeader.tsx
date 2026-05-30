'use client';
import { useMeera } from './MeeraContext';

const DEST_LABELS: Record<string, string> = {
  default: '',
  dawn:    'VARANASI · CITY OF MOKSHA',
  gold:    'TIRUPATI · DIVINE DARSHAN',
  deep:    'KEDARNATH · SACRED SUMMIT',
  fire:    'VRINDAVAN · DIVINE PLAY',
};

interface MeeraHeaderProps {
  statusText?: string;
  onReset?: () => void;
  showReset?: boolean;
}

export function MeeraHeader({ statusText = 'present with you', onReset, showReset }: MeeraHeaderProps) {
  const { scene } = useMeera();
  const label = DEST_LABELS[scene] ?? '';

  return (
    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 20, position: 'relative' }}>
      {/* Logo row */}
      <div style={{ width: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span
          style={{
            fontFamily: 'var(--meera-font-label)',
            fontSize: 12,
            letterSpacing: '0.25em',
            color: 'var(--meera-gold)',
            textTransform: 'uppercase',
          }}
        >
          यात्री · Yaatri
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {label && (
            <span
              style={{
                fontFamily: 'var(--meera-font-label)',
                fontSize: 9,
                letterSpacing: '0.2em',
                color: 'var(--meera-gold)',
                border: '1px solid var(--meera-border-active)',
                padding: '5px 12px',
                borderRadius: 20,
                animation: 'meera-fade-up 0.5s ease both',
              }}
            >
              ✦ {label}
            </span>
          )}
          {showReset && onReset && (
            <button
              type="button"
              onClick={onReset}
              title="Start over"
              aria-label="Start over"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--meera-text-dim)',
                cursor: 'pointer',
                fontSize: 18,
                padding: 4,
                lineHeight: 1,
              }}
            >
              ↺
            </button>
          )}
        </div>
      </div>

      {/* Avatar */}
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <div
          style={{
            position: 'absolute', inset: -8,
            borderRadius: '50%',
            border: '1px solid transparent',
            borderTopColor: 'rgba(212,168,83,0.5)',
            borderRightColor: 'rgba(212,168,83,0.2)',
            animation: 'meera-spin 8s linear infinite',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: -14,
            borderRadius: '50%',
            border: '1px solid transparent',
            borderBottomColor: 'rgba(232,132,58,0.3)',
            borderLeftColor: 'rgba(232,132,58,0.1)',
            animation: 'meera-spin 13s linear infinite reverse',
          }}
        />
        <div
          style={{
            width: 64, height: 64,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 38%, #3D2B1A, #1A1008)',
            border: '1px solid rgba(212,168,83,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
            boxShadow: '0 0 30px rgba(212,168,83,0.15)',
          }}
        >
          🪔
        </div>
      </div>

      <span
        style={{
          fontFamily: 'var(--meera-font-label)',
          fontSize: 11,
          letterSpacing: '0.3em',
          color: 'var(--meera-gold)',
          textTransform: 'uppercase',
        }}
      >
        Meera
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minHeight: 18 }}>
        <div
          style={{
            width: 5, height: 5,
            borderRadius: '50%',
            background: 'var(--meera-saffron)',
            animation: 'meera-pulse-dot 2.5s ease infinite',
          }}
        />
        <span
          style={{
            fontSize: 12,
            color: 'var(--meera-text-dim)',
            fontStyle: 'italic',
            fontFamily: 'var(--meera-font-body)',
          }}
        >
          {statusText}
        </span>
      </div>
    </div>
  );
}
