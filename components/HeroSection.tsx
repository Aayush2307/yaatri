'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = '918153026157'

function openWhatsApp(message: string) {
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
}

const CHIPS = [
  { id: 'varanasi',     icon: '🕉',  label: 'Plan my Varanasi yatra',      message: 'I want to plan my Varanasi yatra' },
  { id: 'kashi-timing', icon: '🌅',  label: 'Best time to visit Kashi',     message: 'What is the best time to visit Kashi?' },
  { id: 'puja-father',  icon: '🪔',  label: 'Puja for my departed father',  message: 'I need help arranging puja for my departed father' },
  { id: 'char-dham',    icon: '🚶',  label: 'Char Dham for seniors',        message: 'Help me plan Char Dham yatra for senior citizens' },
]

function MandalaSVG() {
  return (
    <svg
      viewBox="0 0 140 140"
      width="140"
      height="140"
      fill="none"
      stroke="#B84B10"
      strokeWidth={0.6}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0.06,
        animation: 'mandala-slow 60s linear infinite',
        pointerEvents: 'none',
      }}
    >
      <circle cx="70" cy="70" r="66" />
      <circle cx="70" cy="70" r="48" />
      <circle cx="70" cy="70" r="26" />
      <circle cx="70" cy="70" r="8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="70" cy="36" rx="7" ry="22"
          transform={`rotate(${deg} 70 70)`} />
      ))}
      {[0, 45, 90, 135].map((deg) => (
        <line key={deg} x1="70" y1="4" x2="70" y2="136"
          strokeWidth={0.4} transform={`rotate(${deg} 70 70)`} />
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <circle key={`dot-${deg}`} cx="70" cy="5" r="2"
          fill="#B84B10" stroke="none"
          transform={`rotate(${deg} 70 70)`} />
      ))}
    </svg>
  )
}

export default function HeroSection() {
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (inputValue.trim()) openWhatsApp(inputValue.trim())
  }

  return (
    <div className="meera-page-bg">
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(48px, 8vw, 96px) 24px 40px',
          animation: 'hero-fade-in 600ms ease-out forwards',
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            pointerEvents: 'none', opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 'var(--space-hero-max)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          margin: '0 auto',
        }}>

          {/* Glyph + Mandala */}
          <div style={{
            position: 'relative',
            width: 140, height: 140,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 4,
          }}>
            <MandalaSVG />
            <span className="hero-glyph">म</span>
          </div>

          {/* MEERA label */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 600,
            letterSpacing: '3px', textTransform: 'uppercase',
            color: 'var(--color-text-muted)', marginTop: 6, marginBottom: 14,
          }}>
            MEERA
          </p>

          {/* Divider */}
          <div aria-hidden style={{
            width: 40, height: 1, marginBottom: 20,
            background: 'linear-gradient(90deg, transparent, #C8B89A, transparent)',
          }} />

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 5vw, 52px)',
            fontWeight: 400, lineHeight: 1.15,
            letterSpacing: '-0.5px',
            color: 'var(--color-text-primary)',
            marginBottom: 28,
          }}>
            Jai Shri Ram. Where does your{' '}
            <em style={{ color: 'var(--color-glyph)', fontStyle: 'italic' }}>sankalp</em>
            {' '}call you?
          </h1>

          {/* Input */}
          <div style={{ position: 'relative', width: '100%', maxWidth: 520, marginBottom: 14 }}>
            <input
              type="text"
              className="hero-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
              placeholder="Tell me your sankalp…"
              aria-label="Tell Meera your sankalp"
              style={{
                width: '100%', height: 60,
                background: 'var(--color-bg-input)',
                border: '1.5px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-pill)',
                padding: '0 72px 0 24px',
                fontFamily: 'var(--font-body)', fontSize: 16,
                color: 'var(--color-text-primary)',
                boxShadow: 'var(--shadow-input)',
                transition: 'border-color 200ms ease, box-shadow 200ms ease',
              }}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              aria-label="Share your sankalp with Meera"
              style={{
                position: 'absolute', right: 7, top: '50%',
                transform: 'translateY(-50%)',
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--color-saffron)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: 'var(--shadow-send)',
                transition: 'background 150ms ease, transform 100ms ease, box-shadow 150ms ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                  stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Chips */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8,
            justifyContent: 'center', maxWidth: 520,
          }}>
            {CHIPS.map(chip => (
              <button
                key={chip.id}
                className="hero-chip"
                onClick={() => openWhatsApp(chip.message)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 15px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--color-bg-input)',
                  border: '1.5px solid var(--color-chip-border)',
                  fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 180ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>{chip.icon}</span>
                {chip.label}
              </button>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}
