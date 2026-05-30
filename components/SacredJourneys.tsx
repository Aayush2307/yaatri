'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useStaggerReveal } from '@/hooks/useStaggerReveal'
import { DESTINATIONS, type Destination } from '@/data/destinations'

function DestinationCard({ dest, visible, delay }: { dest: Destination; visible: boolean; delay: number }) {
  const router = useRouter()
  const [hovered, setHovered] = React.useState(false)

  return (
    <article
      onClick={() => router.push(`/concierge?yatra=${encodeURIComponent(dest.name)}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#FEFAF4',
        border: hovered
          ? '1px solid rgba(224,92,0,0.25)'
          : '1px solid rgba(221,208,188,0.9)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: hovered
          ? '0 12px 40px rgba(44,26,14,0.14), 0 3px 10px rgba(44,26,14,0.07)'
          : '0 2px 20px rgba(44,26,14,0.09), 0 1px 4px rgba(44,26,14,0.04)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        opacity: visible ? 1 : 0,
        animation: visible
          ? `card-enter 550ms cubic-bezier(0.22,1,0.36,1) ${delay}ms both`
          : 'none',
        transition:
          'transform 300ms cubic-bezier(0.22,1,0.36,1), ' +
          'box-shadow 300ms ease, ' +
          'border-color 300ms ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Icon area */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #EDE4CC 0%, #DDD0B8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 110,
          fontSize: 52,
          lineHeight: 1,
          userSelect: 'none',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {dest.icon}
      </div>

      {/* Card body */}
      <div style={{ padding: '16px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Location eyebrow */}
        <span
          style={{
            fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            color: 'var(--color-saffron)',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {dest.location}
        </span>

        {/* Name */}
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(20px, 2.5vw, 24px)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            letterSpacing: -0.3,
            margin: 0,
          }}
        >
          {dest.name}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--color-text-muted)',
            lineHeight: 1.45,
            margin: '2px 0 12px',
            flex: 1,
          }}
        >
          {dest.tagline}
        </p>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/concierge?yatra=${encodeURIComponent(dest.name)}`)
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 15px',
            background: 'var(--color-saffron)',
            color: '#FDF8EE',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(224,92,0,0.25)',
            transition: 'background 150ms ease',
            alignSelf: 'flex-start',
          }}
        >
          Plan with Meera
        </button>
      </div>
    </article>
  )
}

export default function SacredJourneys() {
  const { ref, visible } = useStaggerReveal(DESTINATIONS.length)

  return (
    <section
      style={{
        padding: 'clamp(64px, 8vw, 96px) 24px clamp(72px, 9vw, 96px)',
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
      <div
        style={{
          textAlign: 'center',
          maxWidth: 560,
          marginBottom: 'clamp(36px, 5vw, 48px)',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ width: 20, height: 1.5, background: '#E05C00', opacity: 0.7, display: 'block' }} />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11, fontWeight: 600,
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              color: 'var(--color-saffron)',
            }}
          >
            Sacred Journeys
          </span>
          <span style={{ width: 20, height: 1.5, background: '#E05C00', opacity: 0.7, display: 'block' }} />
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            lineHeight: 1.2,
            letterSpacing: '-0.3px',
            margin: 0,
          }}
        >
          Where would you like{' '}
          <em style={{ fontStyle: 'italic', color: 'var(--color-glyph)' }}>to go?</em>
        </h2>
      </div>

      {/* 2-col grid */}
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-[440px] sm:max-w-[880px]"
      >
        {DESTINATIONS.map((dest, i) => (
          <DestinationCard
            key={dest.id}
            dest={dest}
            visible={visible}
            delay={Math.min(i, 3) * 80}
          />
        ))}
      </div>
    </section>
  )
}
