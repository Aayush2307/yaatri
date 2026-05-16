'use client';

import { useCallback, useRef, useState } from 'react';
import type { MeeraError, MeeraMessage } from '@/types/meera';

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

const RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 8000;

async function fetchWithRetry(input: string, init: RequestInit): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(input, { ...init, signal: controller.signal });
      clearTimeout(timeoutId);
      return res;
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err;
    }
  }
  throw lastError;
}

export interface UseMeeraChatReturn {
  messages: MeeraMessage[];
  isStreaming: boolean;
  error: MeeraError | null;
  send: (text: string) => Promise<void>;
  retry: () => Promise<void>;
  clearError: () => void;
  addMessage: (role: MeeraMessage['role'], text: string) => void;
}

export function useMeeraChat(): UseMeeraChatReturn {
  const [messages, setMessages] = useState<MeeraMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<MeeraError | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);
  const lastTextRef = useRef<string | null>(null);

  const attemptFetch = useCallback(async (text: string, assistantId: string) => {
    try {
      const res = await fetchWithRetry('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: sessionIdRef.current }),
      });

      if (!res.ok) {
        const code: MeeraError['code'] = res.status === 401 ? 'unauthorized' : 'server_error';
        setError({ code });
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        return;
      }

      const data = (await res.json()) as { message: string; sessionId?: string | null };

      if (data.sessionId) sessionIdRef.current = data.sessionId;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, text: data.message, streaming: false } : m,
        ),
      );
    } catch {
      setError({ code: 'network' });
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      isLoadingRef.current = false;
      setIsStreaming(false);
    }
  }, []);

  const send = useCallback(
    async (text: string) => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setIsStreaming(true);
      setError(null);
      lastTextRef.current = text;

      setMessages((prev) => [...prev, { id: newId(), role: 'user', text }]);
      const assistantId = newId();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', text: '', streaming: true },
      ]);

      await attemptFetch(text, assistantId);
    },
    [attemptFetch],
  );

  // Re-sends the last failed message without adding a duplicate user bubble.
  const retry = useCallback(async () => {
    const text = lastTextRef.current;
    if (!text || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsStreaming(true);
    setError(null);

    const assistantId = newId();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', text: '', streaming: true },
    ]);

    await attemptFetch(text, assistantId);
  }, [attemptFetch]);

  const clearError = useCallback(() => setError(null), []);

  const addMessage = useCallback((role: MeeraMessage['role'], text: string) => {
    setMessages((prev) => [...prev, { id: newId(), role, text }]);
  }, []);

  return { messages, isStreaming, error, send, retry, clearError, addMessage };
}
