'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatHeader } from '@/components/chatbot/ChatHeader';
import { ChatInput } from '@/components/chatbot/ChatInput';
import { ChatMessage } from '@/components/chatbot/ChatMessage';
import { useChatbot, type ChatAction } from '@/hooks/useChatbot';

export function ChatWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isSending, sendMessage } = useChatbot();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const quickActions = [
    { label: 'Temple Visit', prompt: 'I want to visit a temple. Please guide me.' },
    { label: 'Book Journey', prompt: 'Help me with booking options for a yatra.' },
    { label: 'Track Booking', prompt: 'Check booking status.' },
  ];

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen]);

  const handleAction = (action: ChatAction) => {
    if (action.type === 'redirect') {
      router.push(action.url);
      setIsOpen(false);
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end px-4 pb-[110px] sm:px-8 sm:pb-8">
      <div className="flex flex-col items-end w-full sm:max-w-[460px]">
        {isOpen ? (
          <div className="pointer-events-auto flex h-[calc(100vh-180px)] sm:h-[calc(100vh-140px)] max-h-[750px] min-h-[500px] w-full flex-col overflow-hidden rounded-3xl border border-[#E7D5BF] bg-[#FFF8EE] shadow-[0_8px_40px_-5px_rgba(198,106,43,0.15)] transition-all mb-4">
            <ChatHeader onClose={() => setIsOpen(false)} />
            <div className="flex flex-wrap gap-2 border-b border-[#E7D5BF] bg-[#FAF5EE] px-5 py-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => sendMessage(action.prompt)}
                  disabled={isSending}
                  className="rounded-full border border-[#E7D5BF] bg-white px-3 py-1.5 text-[13px] font-medium text-[#7A4E28] hover:bg-[#FDF9F3] transition-colors disabled:opacity-60"
                >
                  {action.label}
                </button>
              ))}
            </div>
            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-5 py-5 scroll-smooth">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} onAction={handleAction} />
              ))}
            </div>
            <div className="bg-[#FFF8EE] p-5 pt-2">
              <ChatInput onSend={sendMessage} isSending={isSending} />
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="pointer-events-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#C66A2B] text-lg font-bold text-[#FFF8EE] shadow-xl hover:bg-[#A95621] transition-transform hover:scale-105 shrink-0"
          aria-expanded={isOpen}
          aria-label="Open chat assistant"
        >
          AI
        </button>
      </div>
    </div>
  );
}
