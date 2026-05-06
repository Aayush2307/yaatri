'use client';

import { useCallback, useRef, useState } from 'react';
import type { MeeraError, MeeraMessage, MeeraSSEEvent } from '@/types/meera';

// ── auth ──────────────────────────────────────────────────────────────────────

function authHeaders(): Record<string, string> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('yaatri_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── internal fetch helpers (all spread authHeaders) ───────────────────────────

async function sendInternal(text: string) {
  return fetch('/api/concierge/message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message: text }),
  });
}

async function requestHandoff(context: string) {
  return fetch('/api/concierge/handoff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ context }),
  });
}

async function loadMore(before?: string) {
  const url = before
    ? `/api/concierge/messages?before=${encodeURIComponent(before)}`
    : '/api/concierge/messages';
  return fetch(url, { headers: { ...authHeaders() } });
}

// ── helpers ───────────────────────────────────────────────────────────────────

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

// ── hook ──────────────────────────────────────────────────────────────────────

export interface UseMeeraChatReturn {
  messages: MeeraMessage[];
  isStreaming: boolean;
  error: MeeraError | null;
  send: (text: string) => Promise<void>;
  handoff: (context: string) => Promise<void>;
  fetchMore: (before?: string) => Promise<void>;
  clearError: () => void;
}

export function useMeeraChat(): UseMeeraChatReturn {
  const [messages, setMessages] = useState<MeeraMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<MeeraError | null>(null);

  // Tracks the id of the in-progress assistant message so finishStreaming can
  // remove the `streaming` flag without needing isStreaming in its dep array.
  const streamingIdRef = useRef<string | null>(null);
  // Guards send() against re-entry without a stale-closure dependency on isStreaming.
  const isStreamingRef = useRef(false);

  // idempotent: safe to call even if already finished
  const finishStreaming = useCallback(() => {
    const id = streamingIdRef.current;
    streamingIdRef.current = null;
    isStreamingRef.current = false;
    setIsStreaming(false);
    if (id) {
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, streaming: false } : m)),
      );
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (isStreamingRef.current) return;
      isStreamingRef.current = true;
      setIsStreaming(true);
      setError(null);

      const userMsg: MeeraMessage = { id: newId(), role: 'user', text };
      setMessages((prev) => [...prev, userMsg]);

      const assistantId = newId();
      streamingIdRef.current = assistantId;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', text: '', streaming: true },
      ]);

      let accumulatedText = '';
      let didTerminate = false;

      try {
        const res = await sendInternal(text);

        if (!res.ok) {
          const code: MeeraError['code'] =
            res.status === 401 ? 'unauthorized' : 'server_error';
          setError({ code });
          didTerminate = true;
          finishStreaming();
          return;
        }

        if (!res.body) {
          setError({ code: 'server_error' });
          didTerminate = true;
          finishStreaming();
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // ── streaming loop (lines ~104–183 in the diagnosed file) ────────────
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === '[DONE]') continue;

            let event: MeeraSSEEvent;
            try {
              event = JSON.parse(raw) as MeeraSSEEvent;
            } catch {
              continue;
            }

            switch (event.type) {
              case 'token': {
                accumulatedText += event.text;
                const snapshot = accumulatedText;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, text: snapshot } : m,
                  ),
                );
                break;
              }
              case 'done':
                didTerminate = true;
                finishStreaming();
                break;
              case 'error':
                didTerminate = true;
                setError({ code: event.code, message: event.message });
                finishStreaming();
                break;
            }

            if (didTerminate) break;
          }

          if (didTerminate) break;
        }
        // ── end streaming loop ────────────────────────────────────────────────
      } catch {
        // network failure or reader abort — fall through to the finally guard
      } finally {
        // Fallback: if the server closed the stream without a done/error event,
        // recover accumulated text and always unblock the composer.
        if (!didTerminate) {
          if (accumulatedText.length > 0) {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, text: accumulatedText } : m,
              ),
            );
          }
          finishStreaming(); // idempotent
        }
      }
    },
    [finishStreaming],
  );

  const handoff = useCallback(async (context: string) => {
    await requestHandoff(context);
  }, []);

  const fetchMore = useCallback(async (before?: string) => {
    const res = await loadMore(before);
    if (!res.ok) return;
    const data = (await res.json()) as { messages?: MeeraMessage[] };
    if (data.messages?.length) {
      setMessages((prev) => [...(data.messages ?? []), ...prev]);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { messages, isStreaming, error, send, handoff, fetchMore, clearError };
}
