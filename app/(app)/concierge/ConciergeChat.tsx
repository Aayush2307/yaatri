'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useMeeraChat } from '@/hooks/useMeeraChat';

interface ConciergeChatProps {
  prefillQuery?: string;
}

// ── constants ─────────────────────────────────────────────────────────────────

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP?.replace(/\D/g, '') ?? '910000000000';

function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const PROMPT_CHIPS = [
  'Which yatra is right for my family?',
  'What is the best time for darshan?',
  'Can you help plan a 3-day trip?',
];

// ── component ─────────────────────────────────────────────────────────────────

export function ConciergeChat({ prefillQuery = '' }: ConciergeChatProps) {
  const { messages, isStreaming, error, send, clearError } = useMeeraChat();
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

  const handleSend = (e?: FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || isStreaming) return;
    setDraft('');
    void send(text);
  };

  const lastUserText =
    messages.filter((m) => m.role === 'user').at(-1)?.text ??
    'Namaste Meera, I need help planning my yatra';

  return (
    <div className="flex h-full flex-col">
      {/* ── message list ───────────────────────────────────────────────────── */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <>
            <p className="pt-6 text-center text-sm text-ink-muted">
              Ask Meera anything about your yatra…
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => void send(chip)}
                  disabled={isStreaming}
                  className="rounded-full border border-divider bg-cream px-3 py-2 text-xs text-ink-muted shadow-sm disabled:opacity-40"
                >
                  {chip}
                </button>
              ))}
            </div>
          </>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={[
                'max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-ochre text-cream'
                  : 'border border-divider bg-cream text-ink',
                msg.streaming ? 'opacity-70' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {msg.text || (msg.streaming ? '…' : '')}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* ── error pill ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 pb-2">
          {error.code === 'unauthorized' ? (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-divider bg-parchment px-4 py-3 text-sm text-ink">
              <span>Please sign in again to chat with Meera.</span>
              <Link
                href="/signin"
                onClick={clearError}
                className="shrink-0 rounded-lg bg-ochre px-3 py-1.5 text-xs font-semibold text-cream"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <a
              href={buildWhatsAppLink(lastUserText)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-divider bg-parchment px-4 py-3 text-sm text-ink"
            >
              <span>Meera is resting — Continue on WhatsApp</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0 text-whatsapp"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          )}
        </div>
      )}

      {/* ── composer ───────────────────────────────────────────────────────── */}
      <form
        onSubmit={handleSend}
        className="flex items-end gap-3 border-t border-divider bg-ivory px-4 py-3"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isStreaming}
          placeholder="Ask Meera…"
          rows={1}
          className="flex-1 resize-none rounded-xl border border-divider bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-ochre focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isStreaming || !draft.trim()}
          aria-label="Send"
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-ochre text-cream disabled:opacity-40"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M22 2L11 13" />
            <path d="m22 2-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default ConciergeChat;
