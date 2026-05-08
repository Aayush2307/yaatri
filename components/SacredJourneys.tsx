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
  illustrationId: string
  imageSrc?: string
  imageAlt: string
}

/* ─── Illustrations ─── */

function JourneyIllustration({ id }: { id: string }) {
  switch (id) {
    case 'kashi':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <path d="M10,88 Q40,83 80,88 Q120,93 150,86" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <path d="M10,98 Q40,94 80,99 Q120,104 150,98" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <rect x="20" y="72" width="120" height="4" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <rect x="14" y="76" width="132" height="5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <rect x="8" y="81" width="144" height="7" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <rect x="62" y="46" width="36" height="26" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <polygon points="62,46 80,20 98,46" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <line x1="80" y1="20" x2="80" y2="10" stroke="#C85A1E" strokeWidth="1.2" />
          <circle cx="80" cy="8" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="80" cy="7" r="1.2" fill="#C85A1E" />
          <line x1="64" y1="60" x2="96" y2="60" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="64" y1="66" x2="96" y2="66" stroke="#C85A1E" strokeWidth="0.5" />
          <rect x="27" y="56" width="22" height="16" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <polygon points="27,56 38,40 49,56" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="38" y1="40" x2="38" y2="33" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="38" cy="32" r="1.5" fill="#C85A1E" />
          <rect x="111" y="56" width="22" height="16" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <polygon points="111,56 122,41 133,56" fill="none" stroke="#C85A1E" strokeWidth="1.2" />
          <line x1="122" y1="41" x2="122" y2="34" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="122" cy="33" r="1.5" fill="#C85A1E" />
          <circle cx="34" cy="80" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="34" y1="77" x2="34" y2="72" stroke="#C85A1E" strokeWidth="0.7" />
          <circle cx="80" cy="80" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="80" y1="77" x2="80" y2="72" stroke="#C85A1E" strokeWidth="0.7" />
          <circle cx="126" cy="80" r="2.5" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="126" y1="77" x2="126" y2="72" stroke="#C85A1E" strokeWidth="0.7" />
        </svg>
      )
    case 'kedarnath':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <line x1="10" y1="93" x2="150" y2="93" stroke="#C85A1E" strokeWidth="1.5" />
          <polyline points="10,93 32,38 55,62 80,18 105,50 128,32 150,93" fill="none" stroke="#C85A1E" strokeWidth="1.2" strokeLinejoin="round" />
          <polyline points="73,26 80,18 87,26" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <polyline points="122,39 128,32 134,40" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <polyline points="26,45 32,38 38,46" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <rect x="58" y="68" width="44" height="25" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <polygon points="58,68 80,40 102,68" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <polygon points="63,68 80,48 97,68" fill="none" stroke="#C85A1E" strokeWidth="0.7" />
          <polygon points="68,68 80,55 92,68" fill="none" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="80" y1="40" x2="80" y2="30" stroke="#C85A1E" strokeWidth="1.2" />
          <ellipse cx="80" cy="29" rx="4" ry="2" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="80" y1="27" x2="80" y2="22" stroke="#C85A1E" strokeWidth="1" />
          <circle cx="80" cy="21" r="2" fill="#C85A1E" />
          <path d="M71,93 L71,79 Q80,72 89,79 L89,93" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="60" y1="79" x2="100" y2="79" stroke="#C85A1E" strokeWidth="0.5" />
          <line x1="60" y1="84" x2="100" y2="84" stroke="#C85A1E" strokeWidth="0.5" />
          <rect x="53" y="93" width="54" height="4" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <rect x="47" y="97" width="66" height="4" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
        </svg>
      )
    case 'vaishno-devi':
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <polyline points="15,95 45,42 68,62 95,18 122,52 148,95" fill="none" stroke="#C85A1E" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="95" y1="18" x2="95" y2="6" stroke="#C85A1E" strokeWidth="1.2" />
          <polygon points="95,6 106,10 95,14" fill="none" stroke="#C85A1E" strokeWidth="1" />
          <line x1="45" y1="42" x2="45" y2="30" stroke="#C85A1E" strokeWidth="1" />
          <line x1="41" y1="34" x2="45" y2="29" stroke="#C85A1E" strokeWidth="1" />
          <line x1="49" y1="34" x2="45" y2="29" stroke="#C85A1E" strokeWidth="1" />
          <path d="M78,95 Q95,72 112,95" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <line x1="95" y1="95" x2="95" y2="78" stroke="#C85A1E" strokeWidth="0.7" />
          <path d="M60,95 L65,89 L70,89 L75,83 L80,83 L85,78" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <path d="M105,78 L110,83 L115,83 L120,89 L125,89 L130,95" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <line x1="10" y1="95" x2="150" y2="95" stroke="#C85A1E" strokeWidth="1.5" />
          <path d="M10,102 Q50,98 95,103 Q130,107 150,102" fill="none" stroke="#C85A1E" strokeWidth="0.8" />
          <circle cx="95" cy="5" r="2" fill="#C85A1E" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 160 110" width="100%" height="100%">
          <circle cx="80" cy="55" r="30" fill="none" stroke="#C85A1E" strokeWidth="1.5" />
          <circle cx="80" cy="55" r="2" fill="#C85A1E" />
        </svg>
      )
  }
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
    illustrationId: 'kashi',
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
    illustrationId: 'kedarnath',
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
    illustrationId: 'vaishno-devi',
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
      {/* ── Illustration area ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          background: '#EDE4CC',
          padding: '16px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 160,
          overflow: 'hidden',
          transform: hovered ? 'scale(1.02)' : 'scale(1)',
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
          />
        ) : (
          <JourneyIllustration id={journey.illustrationId} />
        )}

        {/* Days badge — top right */}
        <span
          style={{
            position: 'absolute', top: 10, right: 10,
            padding: '3px 9px',
            borderRadius: 9999,
            background: 'rgba(44,26,14,0.12)',
            border: '0.5px solid rgba(200,90,30,0.25)',
            fontSize: 10, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            color: '#7A4E28',
            letterSpacing: '0.3px',
          }}
        >
          {journey.days}
        </span>

        {/* Category badge — bottom left */}
        <span
          style={{
            position: 'absolute', bottom: 10, left: 10,
            padding: '4px 10px',
            borderRadius: 9999,
            background: 'rgba(200,90,30,0.12)',
            border: '0.5px solid rgba(200,90,30,0.30)',
            fontSize: 9.5, fontWeight: 600,
            fontFamily: 'var(--font-body)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#C85A1E',
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
