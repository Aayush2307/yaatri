'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useMeeraStore,
  TOP_DESTINATIONS,
  NEEDS_CHIPS,
} from '@/store/meeraStore';
import { ItineraryCard } from '@/components/concierge/ItineraryCard';
import MeeraAvatar from '@/components/concierge/MeeraAvatar';
import MandalaBackground from '@/components/concierge/MandalaBackground';
import OfferingChips from '@/components/concierge/OfferingChips';
import { M } from '@/components/concierge/tokens';
import type { BudgetTier, GeneratedItinerary } from '@/types/yatra';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseGroupCount(label: string): number {
  if (label === 'Just me') return 1;
  if (label === '2') return 2;
  if (label.startsWith('3')) return 3;
  if (label.startsWith('5')) return 5;
  return 9;
}

function parseBudgetTier(label: string): BudgetTier {
  if (label === 'Basic') return 'basic';
  if (label === 'Premium') return 'premium';
  return 'standard';
}

// ─── Thinking Indicator (sacred flame) ───────────────────────────────────────

function ThinkingIndicator() {
  return (
    <motion.div
      key="thinking"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}
    >
      <MeeraAvatar size={36} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px',
          background: M.parchment,
          border: `1px solid ${M.divider}`,
          borderRadius: '0 12px 12px 12px',
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>🪔</span>
        <span
          style={{
            fontFamily: 'var(--font-cormorant), Georgia, serif',
            fontStyle: 'italic',
            fontSize: 14,
            color: M.warmBrown,
          }}
        >
          crafting your sacred yatra…
        </span>
      </div>
    </motion.div>
  );
}

// ─── Send Icon ────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

// ─── Chip button ──────────────────────────────────────────────────────────────

function Chip({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        fontSize: 12,
        padding: '6px 13px',
        borderRadius: 20,
        border: `1.5px solid ${active ? M.terracotta : M.divider}`,
        background: active ? M.terracotta : M.parchment,
        color: active ? M.parchment : M.warmBrown,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ConciergeChat() {
  const {
    step, messages, currentChips, brief, itinerary, activeChipMessageId,
    init, selectDestination, submitFromCity, submitTravelMonth,
    submitGroupSize, submitBudgetTier, submitSpecialNeeds,
    setItinerary, setGenerationError, selectOfferingChip, submitPhone, reset,
  } = useMeeraStore();

  const [draft, setDraft] = useState('');
  const [phone, setPhone] = useState('');
  const [specialNeedsSelected, setSpecialNeedsSelected] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const generationCalledRef = useRef(false);
  const saveBriefCalledRef = useRef(false);

  useEffect(() => {
    init();
    generationCalledRef.current = false;
    saveBriefCalledRef.current = false;
  }, [init]);

  useEffect(() => {
    if (step === 'SPECIAL_NEEDS') setSpecialNeedsSelected(new Set());
  }, [step]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, step]);

  // Itinerary generation
  useEffect(() => {
    if (step !== 'GENERATING' || generationCalledRef.current) return;
    generationCalledRef.current = true;

    const generate = async () => {
      try {
        const res = await fetch('/api/yatra/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(brief),
        });
        if (!res.ok) throw new Error('Generation failed');
        const data = (await res.json()) as GeneratedItinerary;
        setItinerary(data);
      } catch (err) {
        console.error('[ConciergeChat] generation error:', err);
        setGenerationError('Could not create itinerary. Please try again.');
      }
    };

    void generate();
  }, [step, brief, setItinerary, setGenerationError]);

  // Save brief to DB
  useEffect(() => {
    if (step !== 'DONE' || !brief.phone || saveBriefCalledRef.current) return;
    saveBriefCalledRef.current = true;

    const save = async () => {
      try {
        await fetch('/api/yatra/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...brief, itinerary }),
        });
      } catch (err) {
        console.error('[ConciergeChat] brief save error:', err);
      }
    };

    void save();
  }, [step, brief, itinerary]);

  // ── Event handlers ──────────────────────────────────────────────────────────

  const handleChipTap = (chip: string) => {
    switch (step) {
      case 'GREETING':        selectDestination(chip); break;
      case 'FROM_CITY':       submitFromCity(chip); break;
      case 'TRAVEL_MONTH':    submitTravelMonth(chip); break;
      case 'GROUP_SIZE':      submitGroupSize(chip, parseGroupCount(chip)); break;
      case 'BUDGET_TIER':     submitBudgetTier(chip, parseBudgetTier(chip)); break;
      default: break;
    }
  };

  const toggleNeed = (chip: string) => {
    setSpecialNeedsSelected((prev) => {
      const next = new Set(prev);
      if (chip === 'None of these') return new Set(['None of these']);
      next.delete('None of these');
      if (next.has(chip)) next.delete(chip); else next.add(chip);
      return next;
    });
  };

  const submitNeeds = () => {
    const selected = Array.from(specialNeedsSelected);
    const isNone = selected.length === 0 || selected.includes('None of these');
    const label = isNone ? 'None' : selected.join(', ');
    generationCalledRef.current = false;
    submitSpecialNeeds(label, isNone ? [] : selected);
    setSpecialNeedsSelected(new Set());
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    switch (step) {
      case 'GREETING':     selectDestination(text); break;
      case 'FROM_CITY':    submitFromCity(text); break;
      case 'TRAVEL_MONTH': submitTravelMonth(text); break;
      case 'GROUP_SIZE': {
        const n = parseInt(text, 10);
        submitGroupSize(text, isNaN(n) ? 1 : n);
        break;
      }
      case 'BUDGET_TIER':   submitBudgetTier(text, parseBudgetTier(text)); break;
      case 'SPECIAL_NEEDS': {
        generationCalledRef.current = false;
        submitSpecialNeeds(text, [text]);
        break;
      }
      default: break;
    }
  };

  const handlePhoneSubmit = () => {
    const p = phone.replace(/\D/g, '');
    if (p.length < 10) return;
    submitPhone(p);
    setPhone('');
  };

  const handleReset = () => {
    generationCalledRef.current = false;
    saveBriefCalledRef.current = false;
    reset();
  };

  // ── Derived ─────────────────────────────────────────────────────────────────

  const activeSteps = ['GREETING', 'FROM_CITY', 'TRAVEL_MONTH', 'GROUP_SIZE', 'BUDGET_TIER', 'SPECIAL_NEEDS'];
  const showTextInput = activeSteps.includes(step);

  const inputPlaceholderMap: Record<string, string> = {
    GREETING: 'Or type a destination…',
    FROM_CITY: 'Or type your city…',
    TRAVEL_MONTH: 'Or type a month…',
    GROUP_SIZE: 'Or type a number…',
    BUDGET_TIER: 'Or describe your budget…',
    SPECIAL_NEEDS: 'Or type your needs…',
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        minHeight: '100svh',
        background: M.cream,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          flexDirection: 'column',
          height: '100svh',
          position: 'relative',
        }}
      >
        {/* Mandala background */}
        <MandalaBackground />

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header
          style={{
            background: M.terracotta,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
            zIndex: 10,
            position: 'relative',
          }}
        >
          <MeeraAvatar size={40} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span
              style={{
                fontFamily: 'var(--font-cormorant), Georgia, serif',
                fontSize: 20,
                fontWeight: 600,
                color: M.parchment,
                lineHeight: 1.1,
              }}
            >
              Meera
            </span>
            <span
              style={{
                fontSize: 10,
                letterSpacing: '0.1em',
                color: M.terracottaMuted,
                textTransform: 'uppercase',
              }}
            >
              Your Yatra Guide
            </span>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 10, color: `${M.parchment}88` }}>Online</span>
            {step !== 'GREETING' && (
              <button
                onClick={handleReset}
                title="Start over"
                aria-label="Start over"
                style={{
                  background: 'none',
                  border: 'none',
                  color: `${M.parchment}88`,
                  cursor: 'pointer',
                  fontSize: 16,
                  padding: '4px',
                }}
              >
                ↺
              </button>
            )}
          </div>
        </header>

        {/* ── Chat scroll area ─────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 16px 8px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Messages */}
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: msg.itinerary ? 0.35 : 0.22, ease: 'easeOut' }}
              style={{
                marginBottom: 12,
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              {msg.role === 'meera' ? (
                <>
                  <MeeraAvatar size={32} />
                  <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {msg.itinerary ? (
                      <ItineraryCard
                        itinerary={msg.itinerary}
                        fromCity={brief.fromCity}
                        travelMonth={brief.travelMonth}
                        groupSize={brief.groupSize}
                      />
                    ) : (
                      <div
                        style={{
                          padding: '10px 14px',
                          background: M.parchment,
                          border: `1px solid ${M.divider}`,
                          borderRadius: '0 12px 12px 12px',
                          borderLeft: `3px solid ${M.terracotta}`,
                        }}
                      >
                        {msg.isGreeting ? (
                          <>
                            <p
                              style={{
                                fontFamily: 'var(--font-cormorant), Georgia, serif',
                                fontSize: 17,
                                fontStyle: 'italic',
                                color: M.terracotta,
                                margin: '0 0 4px',
                                lineHeight: 1.2,
                              }}
                            >
                              नमस्ते 🪔
                            </p>
                            <p
                              style={{
                                fontSize: 13,
                                color: M.warmBrown,
                                lineHeight: 1.6,
                                margin: 0,
                                whiteSpace: 'pre-line',
                              }}
                            >
                              {msg.text}
                            </p>
                          </>
                        ) : (
                          <p
                            style={{
                              fontSize: 13,
                              color: M.warmBrown,
                              lineHeight: 1.6,
                              margin: 0,
                              whiteSpace: 'pre-line',
                            }}
                          >
                            {msg.text}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Offering chips — only for active chip message */}
                    {msg.offeringChips && msg.id === activeChipMessageId && (
                      <OfferingChips
                        chips={msg.offeringChips}
                        onSelect={(chip) => {
                          if (chip.includes('book')) generationCalledRef.current = false;
                          selectOfferingChip(chip);
                        }}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    padding: '8px 14px',
                    background: M.terracotta,
                    color: M.parchment,
                    borderRadius: '12px 12px 0 12px',
                    fontSize: 13,
                    lineHeight: 1.5,
                    maxWidth: '72%',
                  }}
                >
                  {msg.text}
                </div>
              )}
            </motion.div>
          ))}

          {/* ── Destination grid (GREETING) ────────────────────────────────── */}
          <AnimatePresence>
            {step === 'GREETING' && (
              <motion.div
                key="destination-grid"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8,
                  paddingLeft: 42,
                  marginTop: 4,
                  marginBottom: 8,
                }}
              >
                {TOP_DESTINATIONS.slice(0, 14).map((dest) => (
                  <button
                    key={dest}
                    onClick={() => handleChipTap(dest)}
                    style={{
                      background: M.parchment,
                      border: `1px solid ${M.divider}`,
                      borderRadius: 10,
                      padding: '8px 4px',
                      minHeight: 48,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                      gap: 2,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = M.terracotta;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = M.divider;
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Noto Sans Devanagari', sans-serif",
                        fontSize: 12,
                        color: M.gold,
                        lineHeight: 1,
                      }}
                    >
                      ॐ
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-cormorant), Georgia, serif',
                        fontSize: 12,
                        color: M.deepBrown,
                        lineHeight: 1.25,
                        textAlign: 'center',
                      }}
                    >
                      {dest}
                    </span>
                  </button>
                ))}
                <button
                  style={{
                    background: M.parchment,
                    border: `1px dashed ${M.divider}`,
                    borderRadius: 10,
                    padding: '8px 4px',
                    minHeight: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => document.getElementById('meera-text-input')?.focus()}
                >
                  <span style={{ fontSize: 11, color: M.mutedText, fontStyle: 'italic' }}>
                    + more
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Regular chips (non-GREETING, non-SPECIAL_NEEDS) ──────────── */}
          <AnimatePresence mode="wait">
            {step !== 'GREETING' && step !== 'SPECIAL_NEEDS' && currentChips.length > 0 && step !== 'PHONE' && (
              <motion.div
                key={`chips-${step}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  paddingLeft: 42,
                  marginBottom: 8,
                  display: 'flex',
                  gap: 6,
                  flexWrap: step === 'TRAVEL_MONTH' ? 'nowrap' : 'wrap',
                  overflowX: step === 'TRAVEL_MONTH' ? 'auto' : undefined,
                }}
              >
                {currentChips.map((chip) => (
                  <Chip key={chip} label={chip} onClick={() => handleChipTap(chip)} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Special needs multi-select ─────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {step === 'SPECIAL_NEEDS' && (
              <motion.div
                key="chips-SPECIAL_NEEDS"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{
                  paddingLeft: 42,
                  marginBottom: 8,
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                }}
              >
                {NEEDS_CHIPS.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    active={specialNeedsSelected.has(chip)}
                    onClick={() => toggleNeed(chip)}
                  />
                ))}
                <button
                  onClick={submitNeeds}
                  style={{
                    fontSize: 12,
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: 'none',
                    background: M.terracotta,
                    color: M.parchment,
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Done ✓
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Thinking indicator (GENERATING) ───────────────────────────── */}
          <AnimatePresence>
            {step === 'GENERATING' && <ThinkingIndicator />}
          </AnimatePresence>

          {/* ── Phone input (PHONE step) ───────────────────────────────────── */}
          <AnimatePresence>
            {step === 'PHONE' && (
              <motion.div
                key="phone-input"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22 }}
                style={{ paddingLeft: 42, marginBottom: 12 }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: M.parchment,
                    border: `1.5px solid ${M.divider}`,
                    borderRadius: 24,
                    padding: '6px 6px 6px 14px',
                    gap: 6,
                  }}
                >
                  <span style={{ fontSize: 12, color: M.mutedText, borderRight: `1px solid ${M.divider}`, paddingRight: 8 }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePhoneSubmit(); }}
                    placeholder="Mobile number"
                    inputMode="tel"
                    maxLength={10}
                    autoFocus
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: 13,
                      color: M.deepBrown,
                      width: 140,
                    }}
                  />
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={phone.length < 10}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: phone.length >= 10 ? M.terracotta : M.creamDark,
                      border: 'none',
                      color: phone.length >= 10 ? M.parchment : M.mutedText,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: phone.length >= 10 ? 'pointer' : 'default',
                      flexShrink: 0,
                    }}
                  >
                    <SendIcon />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Confirmation card (DONE) ───────────────────────────────────── */}
          <AnimatePresence>
            {step === 'DONE' && brief.phone && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ paddingLeft: 42, marginBottom: 12 }}
              >
                <div
                  style={{
                    background: M.cardGradient,
                    borderRadius: 14,
                    padding: '18px 20px',
                    maxWidth: 300,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: M.gold,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <span style={{ color: M.deepBrown, fontSize: 16 }}>✓</span>
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: 17,
                      fontWeight: 600,
                      color: M.goldLight,
                      margin: '0 0 6px',
                    }}
                  >
                    Your yatra is reserved.
                  </p>
                  <p style={{ fontSize: 12, color: M.terracottaMuted, margin: 0, lineHeight: 1.5 }}>
                    A pilgrimage advisor will call you within 24 hours to confirm dates, hotels and darshan timings.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    marginTop: 12,
                    background: 'transparent',
                    border: `1.5px solid ${M.terracotta}`,
                    color: M.terracotta,
                    borderRadius: 20,
                    padding: '7px 16px',
                    fontSize: 13,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-cormorant), Georgia, serif',
                  }}
                >
                  Plan another yatra
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </div>

        {/* ── Bottom text input ────────────────────────────────────────────── */}
        {showTextInput && (
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: M.parchment,
              borderTop: `1px solid ${M.divider}`,
              position: 'relative',
              zIndex: 10,
            }}
          >
            <input
              id="meera-text-input"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={inputPlaceholderMap[step] ?? 'Type your answer…'}
              style={{
                flex: 1,
                background: M.cream,
                border: `1px solid ${M.divider}`,
                borderRadius: 20,
                padding: '9px 16px',
                fontSize: 13,
                color: M.deepBrown,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                background: draft.trim() ? M.terracotta : M.creamDark,
                color: draft.trim() ? M.parchment : M.mutedText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: draft.trim() ? 'pointer' : 'default',
                flexShrink: 0,
              }}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConciergeChat;
