'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStaggerReveal } from '@/hooks/useStaggerReveal'

/* ─── Types & Data ─── */

interface Journey {
  id: string
  category: string
  days: string
  location: string
  title: string
  price: string
  whatsappMessage: string
  placeholderGradient: string
  imageSrc?: string
  imageAlt: string
}

const JOURNEYS: Journey[] = [
  {
    id: 'kashi',
    category: 'MOKSHA',
    days: '5 Days',
    location: 'Varanasi, Uttar Pradesh',
    title: 'Kashi Darshan Yatra',
    price: '₹18,500',
    whatsappMessage: 'I am interested in the Kashi Darshan Yatra (5 days, from ₹18,500)',
    placeholderGradient:
      'radial-gradient(ellipse at 30% 60%, rgba(255,180,60,0.5) 0%, transparent 60%), ' +
      'linear-gradient(180deg, #C86B1A 0%, #9B4A15 35%, #5C2810 70%, #3A1A08 100%)',
    imageAlt: 'Dawn light over the ghats at Varanasi',
  },
  {
    id: 'kedarnath',
    category: 'SHIVA DARSHAN',
    days: '7 Days',
    location: 'Uttarakhand, Himalayas',
    title: 'Kedarnath Shiva Yatra',
    price: '₹32,000',
    whatsappMessage: 'I am interested in the Kedarnath Shiva Yatra (7 days, from ₹32,000)',
    placeholderGradient:
      'radial-gradient(ellipse at 50% 30%, rgba(200,220,240,0.4) 0%, transparent 55%), ' +
      'linear-gradient(180deg, #4A5A78 0%, #6B5040 45%, #3A2818 75%, #221408 100%)',
    imageAlt: 'Kedarnath temple in the Himalayas',
  },
  {
    id: 'vaishno',
    category: 'SHAKTI AWAKENING',
    days: '4 Days',
    location: 'Katra, Jammu',
    title: 'Vaishno Devi Sankalp',
    price: '₹14,200',
    whatsappMessage: 'I am interested in the Vaishno Devi Sankalp (4 days, from ₹14,200)',
    placeholderGradient:
      'radial-gradient(ellipse at 40% 40%, rgba(230,160,100,0.5) 0%, transparent 55%), ' +
      'linear-gradient(180deg, #9B6040 0%, #7B4828 40%, #4A2A14 70%, #2C1608 100%)',
    imageAlt: 'Vaishno Devi shrine in the Trikuta mountains',
  },
]

const STAGGER_DELAYS = [0, 120, 240]

/* ─── Journey Card ─── */

interface JourneyCardProps {
  journey: Journey
  visible: boolean
  delay: number
}

function JourneyCard({ journey, visible, delay }: JourneyCardProps) {
  const router = useRouter()
  const [hovered, setHovered] = React.useState(false)

  return (
    <article
      onClick={() => router.push('/explore')}
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
      }}
    >
      {/* ── Image area ── */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden' }}>
        {/* Inner wrapper animates scale on hover */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: hovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 400ms cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {journey.imageSrc ? (
            <Image
              src={journey.imageSrc}
              alt={journey.imageAlt}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(min-width: 1024px) 33vw, 100vw"
              placeholder="blur"
              blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAP/bxAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="
            />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: journey.placeholderGradient }}>
              {/* Noise texture on placeholder */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.06,
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                  backgroundSize: '200px 200px',
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom gradient overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '65%',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(30,14,6,0.52) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Days badge — top right */}
        <span
          style={{
            position: 'absolute', top: 12, right: 12,
            padding: '4px 10px',
            borderRadius: 9999,
            background: 'rgba(253,248,238,0.15)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '0.5px solid rgba(255,255,255,0.20)',
            fontSize: 10, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            color: 'rgba(253,248,238,0.85)',
            letterSpacing: '0.3px',
          }}
        >
          {journey.days}
        </span>

        {/* Category badge — bottom left */}
        <span
          style={{
            position: 'absolute', bottom: 14, left: 14,
            padding: '5px 11px',
            borderRadius: 9999,
            background: 'rgba(20,10,4,0.60)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            fontSize: 9.5, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'rgba(253,248,238,0.92)',
          }}
        >
          {journey.category}
        </span>
      </div>

      {/* ── Card body ── */}
      <div style={{ padding: '20px 20px 18px' }}>
        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
          <div
            style={{
              width: 4, height: 4,
              background: 'rgba(224,92,0,0.45)',
              borderRadius: '50%',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 12, fontWeight: 500,
              fontFamily: 'var(--font-body)',
              color: 'var(--color-text-muted)',
              letterSpacing: '0.2px',
            }}
          >
            {journey.location}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(18px, 2.5vw, 22px)',
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            lineHeight: 1.25,
            letterSpacing: -0.2,
            marginBottom: 18,
          }}
        >
          {journey.title}
        </h3>

        {/* Price + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span
              style={{
                fontSize: 10.5,
                fontFamily: 'var(--font-body)',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                letterSpacing: '0.3px',
                textTransform: 'uppercase',
              }}
            >
              from
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 400,
                color: 'var(--color-text-primary)',
                letterSpacing: -0.5,
                lineHeight: 1,
              }}
            >
              {journey.price}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/concierge?q=${encodeURIComponent('I want to know more about ' + journey.title)}`)
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 16px',
              background: 'var(--color-saffron)',
              color: '#FDF8EE',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(224,92,0,0.25)',
              transition: 'background 150ms ease, transform 100ms ease',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Talk to Meera
          </button>
        </div>
      </div>
    </article>
  )
}

/* ─── Main Section ─── */

export default function SacredJourneys() {
  const { ref, visible } = useStaggerReveal(3)

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
        {/* Eyebrow */}
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

        {/* Heading */}
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

      {/* Cards grid — 1 col mobile, 3 col desktop */}
      <div
        ref={ref}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 w-full max-w-[440px] lg:max-w-[1040px]"
      >
        {JOURNEYS.map((journey, i) => (
          <JourneyCard
            key={journey.id}
            journey={journey}
            visible={visible}
            delay={STAGGER_DELAYS[i]}
          />
        ))}
      </div>
    </section>
  )
}
