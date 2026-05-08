'use client'

import { useState } from 'react'

const WHATSAPP_NUMBER = '918153026157'
const FAB_MESSAGE = 'Namaste Meera, I would like to speak with you about planning my yatra'

export default function MeeraFAB() {
  const [hovered, setHovered] = useState(false)

  function handleClick() {
    const encoded = encodeURIComponent(FAB_MESSAGE)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 20,
        display: 'flex',
        alignItems: 'center',
        zIndex: 100,
        animation: 'fab-slide-in 400ms cubic-bezier(0.22,1,0.36,1) 2s both',
      }}
    >
      {/* Tooltip — slides in from right when hovered */}
      <span
        className="fab-tooltip"
        style={{
          whiteSpace: 'nowrap',
          padding: '7px 13px',
          background: '#2C1A0E',
          color: '#FDF8EE',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          borderRadius: 9999,
          letterSpacing: '0.3px',
          position: 'relative',
          marginRight: 10,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(8px)',
          transition: 'opacity 160ms ease, transform 160ms ease',
          pointerEvents: 'none',
        }}
      >
        Ask Meera
      </span>

      {/* FAB button */}
      <button
        className="fab-btn"
        onClick={handleClick}
        aria-label="Ask Meera — open WhatsApp"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #E8630A 0%, #C24F00 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          animation: hovered
            ? 'none'
            : 'fab-pulse 3s ease-in-out 2.4s infinite',
          transform: hovered ? 'scale(1.07)' : 'scale(1)',
          boxShadow: hovered
            ? '0 8px 36px rgba(224,92,0,0.55), 0 3px 12px rgba(224,92,0,0.30)'
            : '0 6px 28px rgba(224,92,0,0.40), 0 2px 8px rgba(224,92,0,0.20)',
          transition: 'transform 150ms ease, box-shadow 150ms ease',
        }}
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#C85A1E] opacity-20 scale-[1.35] blur-sm pointer-events-none" />
          <span
            className="relative z-10 font-serif text-white"
            style={{ fontSize: '1.4rem', lineHeight: 1 }}
            aria-label="Meera"
          >
            म
          </span>
        </div>
      </button>
    </div>
  )
}
