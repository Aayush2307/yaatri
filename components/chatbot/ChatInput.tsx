'use client';

import { useState } from 'react';

type ChatInputProps = {
  onSend: (message: string) => void;
  isSending: boolean;
};

export function ChatInput({ onSend, isSending }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#E7D5BF] px-3 py-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about temples, muhurat, or booking"
          className="flex-1 rounded-full border border-[#E7D5BF] bg-white px-3 py-2 text-sm text-[#4A3322] placeholder:text-[#9A7B5A]"
          aria-label="Chat message"
        />
        <button
          type="submit"
          disabled={isSending}
          className="min-w-[64px] rounded-full bg-[#C66A2B] px-4 py-2 text-sm font-medium text-[#FFF8EE] disabled:opacity-60"
        >
          {isSending ? '...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
