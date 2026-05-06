'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { sendChatMessage } from '@/services/chatbot.service';

export type ChatAction = {
  type: 'redirect';
  label: string;
  url: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: ChatAction[];
  timestamp: string;
};

type ChatbotResponse = {
  message: string;
  actions: ChatAction[];
  intent: string;
  sessionId?: string | null;
};

const INITIAL_MESSAGE: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  content: 'Namaste. I can help with temple timings, muhurat, routes, and booking guidance.',
  actions: [
    { type: 'redirect', label: 'Explore Yatras', url: '/explore' },
    { type: 'redirect', label: 'Plan a Yatra', url: '/plan' },
    { type: 'redirect', label: 'Talk to Meera', url: '/concierge' },
  ],
  timestamp: new Date().toISOString(),
};

function ensureSessionId() {
  if (typeof window === 'undefined') return null;
  const existing = localStorage.getItem('yaatri_chat_session');
  if (existing) return existing;
  const created = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `yaatri-${Date.now()}`;
  localStorage.setItem('yaatri_chat_session', created);
  return created;
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(ensureSessionId());
    if (typeof window !== 'undefined') {
      setAuthToken(localStorage.getItem('yaatri_token'));
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsSending(true);

      try {
        const response = (await sendChatMessage(content, sessionId, authToken)) as ChatbotResponse;
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.message,
          actions: response.actions,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (response.sessionId && response.sessionId !== sessionId) {
          setSessionId(response.sessionId);
          if (typeof window !== 'undefined') {
            localStorage.setItem('yaatri_chat_session', response.sessionId);
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: 'I am having trouble responding. Please try again shortly.',
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [sessionId, authToken],
  );

  const value = useMemo(
    () => ({
      messages,
      isSending,
      sendMessage,
    }),
    [messages, isSending, sendMessage],
  );

  return value;
}
