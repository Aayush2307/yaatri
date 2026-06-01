'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

/* ─── Data ─── */

const STEPS = [
  {
    number: '1',
    title: 'Share your sankalp',
    description: 'Tell Meera your intention. No form. Just a conversation.',
  },
  {
    number: '2',
    title: 'Meera listens deeply',
    description: 'She finds the right pilgrimage for your needs and timing.',
  },
  {
    number: '3',
    title: 'We plan every detail',
    description: 'Puja bookings, ghaat access — handled before you arrive.',
  },
  {
    number: '4',
    title: 'Walk in with peace',
    description: 'Only your devotion, fully present.',
  },
]

const STAGGER_DELAYS = [0, 80, 160, 240]

const COMPASS_DOTS: React.CSSProperties[] = [
  { top: -1.5, left: 'calc(50% - 1.5px)' },
  { bottom: -1.5, left: 'calc(50% - 1.5px)' },
  { top: 'calc(50% - 1.5px)', left: -1.5 },
  { top: 'calc(50% - 1.5px)', right: -1.5 },
  { top: 5, left: 5 },
  { top: 5, right: 5 },
  { bottom: 5, left: 5 },
  { bottom: 5, right: 5 },
]

/* ─── StepCard ─── */

interface StepCardProps {
  step: { number: string; title: string; description: string }
  visible: boolean
  delay: number
}

function StepCard({ step, visible, delay }: StepCardProps) {
  return (
    <article
      className="step-card"
      style={{
        position: 'relative',
        background: '#FEFAF4',
        border: '1px solid rgba(221, 208, 188, 0.9)',
        borderRadius: 16,
        padding: 'clamp(20px, 3vw, 28px)',
        overflow: 'hidden',
        boxShadow: '0 2px 16px rgba(44,26,14,0.08), 0 1px 4px rgba(44,26,14,0.04)',
        opacity: visible ? 1 : 0,
        animation: visible
          ? `card-enter 500ms cubic-bezier(0.22,1,0.36,1) ${delay}ms both`
          : 'none',
      }}
    >
      {/* Top edge saffron accent — fades in on hover via .step-card:hover .step-card__top-accent */}
      <div
        className="step-card__top-accent"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(224,92,0,0.45), transparent)',
          borderRadius: '16px 16px 0 0',
          opacity: 0,
          transition: 'opacity 250ms ease',
          pointerEvents: 'none',
        }}
      />

      {/* Watermark step number */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          bottom: -12, right: 6,
          fontFamily: 'var(--font-display)',
          fontSize: 96, fontWeight: 400, fontStyle: 'italic',
          color: '#B84B10', opacity: 0.052,
          lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
          letterSpacing: -4,
        }}
      >
        {step.number}
      </span>

      {/* Medallion */}
      <div style={{ position: 'relative', width: 52, height: 52, marginBottom: 16 }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid rgba(224, 92, 0, 0.28)',
        }} />

        {/* Compass dots at N/S/E/W and diagonals */}
        {COMPASS_DOTS.map((pos, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              width: 3, height: 3,
              background: 'rgba(224,92,0,0.35)',
              borderRadius: '50%',
              ...pos,
            }}
          />
        ))}

        {/* Inner saffron gradient circle with step number */}
        <div style={{
          position: 'absolute',
          top: 7, left: 7, width: 38, height: 38,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #E8630A 0%, #C24F00 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(224,92,0,0.30), inset 0 1px 2px rgba(255,255,255,0.15)',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 20, fontWeight: 400,
            color: '#FDF8EE',
            lineHeight: 1, marginTop: 1, letterSpacing: -0.5,
          }}>
            {step.number}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(18px, 2.5vw, 22px)',
        fontWeight: 400,
        color: 'var(--color-text-primary)',
        lineHeight: 1.3, letterSpacing: -0.1,
        marginBottom: 8,
      }}>
        {step.title}
      </h3>

      {/* Description */}
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(13px, 1.5vw, 15px)',
        fontWeight: 400,
        color: 'var(--color-text-muted)',
        lineHeight: 1.65,
        margin: 0,
      }}>
        {step.description}
      </p>
    </article>
  )
}

/* ─── Main Component ─── */

export default function HowMeeraGuides() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(48px, 8vw, 96px) 24px clamp(56px, 9vw, 96px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Lotus divider */}
      <div className="lotus-divider">
        <div className="lotus-divider__line lotus-divider__line--left" />
        <span style={{ fontSize: 18, color: '#C8B89A', opacity: 0.7, lineHeight: 1 }}>✿</span>
        <div className="lotus-divider__line lotus-divider__line--right" />
      </div>

      {/* Section header */}
      <div style={{
        textAlign: 'center',
        maxWidth: 560,
        marginBottom: 'clamp(32px, 5vw, 48px)',
      }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 14,
        }}>
          <span style={{ width: 20, height: 1.5, background: '#E05C00', opacity: 0.7, display: 'block' }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11, fontWeight: 600,
            letterSpacing: '2.5px', textTransform: 'uppercase',
            color: 'var(--color-saffron)',
          }}>
            The Journey
          </span>
          <span style={{ width: 20, height: 1.5, background: '#E05C00', opacity: 0.7, display: 'block' }} />
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(28px, 4vw, 40px)',
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          lineHeight: 1.2, letterSpacing: '-0.3px',
          margin: 0,
        }}>
          How{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-glyph)' }}>Meera</em>
          {' '}guides you
        </h2>
      </div>

      {/* Steps grid */}
      <div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(12px, 2vw, 20px)',
          width: '100%',
          maxWidth: 720,
        }}
      >
        {STEPS.map((step, i) => (
          <StepCard
            key={step.number}
            step={step}
            visible={visible}
            delay={STAGGER_DELAYS[i]}
          />
        ))}
      </div>
    </section>
  )
}
