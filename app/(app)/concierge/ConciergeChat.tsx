'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useMeeraChat } from '@/hooks/useMeeraChat';
import { usePlannerStore } from '@/store/plannerStore';
import { QuickIntake } from '@/components/chat/planning/QuickIntake';
import { PlanningRouter } from '@/components/chat/planning/PlanningRouter';
import './concierge-animations.css';

// MEERA HEALTH: If Meera shows 'unavailable' in production, check:
// (1) Vercel env vars — GROQ_API_KEY must be set, (2) /api/meera/health endpoint,
// (3) Vercel function logs for MEERA_CONFIG_MISSING

interface ConciergeChatProps {
  prefillQuery?: string;
}

type IntentResult = {
  isPlanningIntent: boolean;
  destination?: string | null;
  fromCity?: string | null;
  travelMonth?: string | null;
  peopleCount?: number | null;
};

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP?.replace(/\D/g, '') ?? '910000000000';

function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function ConciergeChat({ prefillQuery = '' }: ConciergeChatProps) {
  const { messages, isStreaming, error, send, retry, clearError, addMessage } = useMeeraChat();
  const {
    concierge,
    setPlanningMode,
    setIntake,
    setConcierge,
    resetConcierge,
  } = usePlannerStore();
  const { planningMode, intakeComplete, destination, fromCity, travelMonth } = concierge;

  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const prefillSentRef = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (prefillQuery && !prefillSentRef.current) {
      prefillSentRef.current = true;
      void send(prefillQuery);
    }
  }, [prefillQuery, send]);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || isStreaming) return;
    setDraft('');
    void send(text);

    // Detect travel planning intent server-side (keeps API key safe)
    try {
      const res = await fetch('/api/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (res.ok) {
        const intent = (await res.json()) as IntentResult;
        if (intent.isPlanningIntent) {
          setPlanningMode(true);
          const patch: Partial<typeof concierge> = {};
          if (intent.destination) patch.destination = intent.destination;
          if (intent.fromCity) patch.fromCity = intent.fromCity;
          if (intent.travelMonth) patch.travelMonth = intent.travelMonth;
          if (intent.peopleCount) patch.peopleCount = intent.peopleCount;
          if (Object.keys(patch).length > 0) setConcierge(patch);
        }
      }
    } catch {
      // Intent detection failed silently — no planning mode triggered
    }
  };

  const lastUserText =
    messages.filter((m) => m.role === 'user').at(-1)?.text ??
    'Namaste Meera, I need help planning my yatra';

  const visibleMessages = messages.filter((m) => !m.streaming);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(175deg, #C85A1E 0%, #E8C88A 15%, #F5EDD9 48%, #EDE4CC 100%)',
      }}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3 backdrop-blur-md flex-shrink-0"
        style={{ background: 'rgba(44, 26, 14, 0.88)' }}
      >
        <div className="relative flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#FBF5E8] font-serif text-lg ring-2 ring-[#F2C97E] select-none"
            style={{ background: 'radial-gradient(circle at 35% 35%, #F2C97E, #C85A1E)' }}
          >
            म
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-[rgba(44,26,14,0.88)]" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[#F5EDD9] text-sm font-sans font-medium leading-tight truncate">
            Meera · Yaatri Concierge
          </p>
          <p className="text-[#F2C97E] text-xs font-sans">● Online now</p>
        </div>

        {/* Plan a Yatra button */}
        {!planningMode && (
          <button
            type="button"
            onClick={() => {
              resetConcierge();
              setPlanningMode(true);
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-[#FBF5E8] text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ background: 'rgba(200, 90, 30, 0.75)', border: '1px solid rgba(242, 201, 126, 0.4)' }}
          >
            Plan a Yatra
          </button>
        )}

        <a
          href={buildWhatsAppLink(lastUserText)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-sans font-medium flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ background: 'rgba(37, 211, 102, 0.85)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </a>
      </header>

      {/* SCROLL AREA */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-4 flex flex-col gap-3">
        {visibleMessages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 py-20 text-center">
            <span className="text-6xl leading-none select-none">🪔</span>
            <p
              className="font-sans text-sm leading-relaxed max-w-[200px]"
              style={{ color: '#7A5C42' }}
            >
              Tell Meera where your journey calls you
            </p>
          </div>
        )}

        {visibleMessages.map((msg) =>
          msg.role === 'assistant' ? (
            <div
              key={msg.id}
              className="flex items-end gap-2 max-w-[85%]"
              style={{ animation: 'floatUp 0.35s ease-out both' }}
            >
              <div
                className="backdrop-blur-sm rounded-r-2xl rounded-tl-2xl px-4 py-3 border-l-[3px] border-[#C85A1E]"
                style={{
                  background: 'rgba(251, 245, 232, 0.82)',
                  boxShadow: '0 2px 12px rgba(44, 26, 14, 0.12)',
                }}
              >
                <p className="font-sans text-sm leading-relaxed" style={{ color: '#2C1A0E' }}>
                  {msg.text}
                </p>
              </div>
            </div>
          ) : (
            <div
              key={msg.id}
              className="flex justify-end"
              style={{ animation: 'floatUp 0.35s ease-out both' }}
            >
              <div
                className="bg-[#C85A1E] rounded-l-2xl rounded-tr-2xl px-4 py-3 max-w-[75%]"
                style={{ boxShadow: '0 2px 8px rgba(200, 90, 30, 0.35)' }}
              >
                <p className="font-sans text-sm leading-relaxed text-[#FBF5E8]">
                  {msg.text}
                </p>
              </div>
            </div>
          ),
        )}

        {isStreaming && (
          <div
            className="flex items-end gap-2 max-w-[85%]"
            style={{ animation: 'floatUp 0.35s ease-out both' }}
          >
            <div
              className="backdrop-blur-sm rounded-r-2xl rounded-tl-2xl px-4 py-3 border-l-[3px] border-[#C85A1E]"
              style={{ background: 'rgba(251, 245, 232, 0.82)' }}
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C85A1E] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C85A1E] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#C85A1E] animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="px-0 pb-2">
            {error.code === 'unauthorized' ? (
              <div
                className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-sans"
                style={{ background: 'rgba(251, 245, 232, 0.82)', color: '#2C1A0E' }}
              >
                <span>Please sign in again to chat with Meera.</span>
                <Link
                  href="/signin"
                  onClick={clearError}
                  className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#FBF5E8] bg-[#C85A1E]"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <div
                className="flex flex-col gap-3 rounded-2xl px-4 py-3 text-sm font-sans"
                style={{ background: 'rgba(251, 245, 232, 0.82)', color: '#2C1A0E' }}
              >
                <span>Meera is unavailable right now — please try again</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={retry}
                    className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#FBF5E8] bg-[#C85A1E]"
                  >
                    Retry
                  </button>
                  <a
                    href={buildWhatsAppLink(lastUserText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={clearError}
                    className="flex items-center gap-1.5 shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold"
                    style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#1a8a45' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Continue on WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* PLANNING PANEL — replaces composer when planning mode is active */}
      {planningMode ? (
        <div
          className="flex-shrink-0 overflow-y-auto border-t"
          style={{
            maxHeight: '68vh',
            background: 'rgba(237, 228, 204, 0.96)',
            borderColor: 'rgba(242, 201, 126, 0.5)',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          }}
        >
          {/* Planning panel header */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1 sticky top-0" style={{ background: 'rgba(237,228,204,0.96)' }}>
            <p className="text-[10px] font-semibold text-[#7A5C42] uppercase tracking-widest">
              🗺️ Yatra Planner
            </p>
            <button
              type="button"
              onClick={() => setPlanningMode(false)}
              className="text-xs text-[#7A5C42] hover:text-[#C85A1E] transition-colors"
            >
              × Exit planning
            </button>
          </div>

          {!intakeComplete ? (
            <QuickIntake
              prefill={{ destination, fromCity, travelMonth }}
              onComplete={(d, f, m, p) => {
                setIntake(d, f, m, p);
                addMessage('assistant', `Wonderful! ${f} → ${d}, ${m}, ${p} ${p === 1 ? 'person' : 'people'}. What shall we sort first — travel, stay, or activities?`);
              }}
            />
          ) : (
            <PlanningRouter
              onMessage={(text) => addMessage('assistant', text)}
            />
          )}
        </div>
      ) : (
        /* COMPOSER BAR */
        <div
          className="flex-shrink-0 flex items-center gap-3 px-4 py-3 backdrop-blur-md border-t"
          style={{
            background: 'rgba(237, 228, 204, 0.92)',
            borderColor: 'rgba(242, 201, 126, 0.5)',
            paddingBottom: 'env(safe-area-inset-bottom, 0.75rem)',
          }}
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Ask Meera…"
            disabled={isStreaming}
            className="flex-1 rounded-full px-4 py-2.5 text-sm font-sans outline-none border disabled:opacity-60"
            style={{
              background: 'rgba(251, 245, 232, 0.8)',
              borderColor: 'rgba(242, 201, 126, 0.4)',
              color: '#2C1A0E',
            }}
          />
          <button
            onClick={() => void handleSend()}
            disabled={!draft.trim() || isStreaming}
            aria-label="Send message"
            className="w-11 h-11 rounded-full bg-[#C85A1E] flex items-center justify-center flex-shrink-0 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ boxShadow: '0 2px 8px rgba(200, 90, 30, 0.4)' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FBF5E8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ConciergeChat;
