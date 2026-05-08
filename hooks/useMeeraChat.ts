'use client';

import { useCallback, useRef, useState } from 'react';
import type { MeeraError, MeeraMessage } from '@/types/meera';

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export interface UseMeeraChatReturn {
  messages: MeeraMessage[];
  isStreaming: boolean;
  error: MeeraError | null;
  send: (text: string) => Promise<void>;
  clearError: () => void;
}

export function useMeeraChat(): UseMeeraChatReturn {
  const [messages, setMessages] = useState<MeeraMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<MeeraError | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false);

  const send = useCallback(async (text: string) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsStreaming(true);
    setError(null);

    const userMsg: MeeraMessage = { id: newId(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    const assistantId = newId();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', text: '', streaming: true },
    ]);

    try {
      const res = await fetch('/api/chatbot/message', {
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

      const data = (await res.json()) as {
        message: string;
        sessionId?: string | null;
      };

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

  const clearError = useCallback(() => setError(null), []);

  return { messages, isStreaming, error, send, clearError };
}
