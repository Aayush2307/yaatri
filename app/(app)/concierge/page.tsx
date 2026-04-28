'use client';

import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';

const seed = [
  { sender: 'concierge', body: 'Namaste. I am Meera, your spiritual concierge.' },
  { sender: 'concierge', body: 'Would you like darshan-first itinerary or ritual-first itinerary?' },
];

export default function ConciergePage() {
  const [messages, setMessages] = useState(seed);
  const [text, setText] = useState('');

  return (
    <main className="flex min-h-screen flex-col bg-bg-surface pb-24">
      <header className="bg-indigo-deepest px-5 py-4 text-star-white">
        <p className="text-[14px]">Meera · Online · spiritual concierge</p>
      </header>
      <div className="flex-1 space-y-2 px-5 py-4">
        {messages.map((m, idx) => (
          <div key={`${m.body}-${idx}`} className={`max-w-[82%] rounded-card border-[0.5px] px-3 py-2 text-[11px] ${m.sender === 'concierge' ? 'border-divider bg-white text-text-dark' : 'ml-auto border-indigo-primary bg-indigo-primary text-star-white'}`}>
            {m.body}
          </div>
        ))}
      </div>
      <div className="px-5 pb-3">
        <div className="flex items-center gap-2 rounded-card border-[0.5px] border-divider bg-white p-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Meera anything" className="min-h-[44px] flex-1 rounded-[10px] bg-bg-surface px-3 text-[13px]" />
          <button
            type="button"
            onClick={() => {
              if (!text.trim()) return;
              setMessages((prev) => [...prev, { sender: 'user', body: text }, { sender: 'concierge', body: 'Received. I will refine your itinerary and revert shortly.' }]);
              setText('');
            }}
            className="h-[30px] w-[30px] rounded-full bg-indigo-mid text-star-white"
          >
            →
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="concierge" /></div>
    </main>
  );
}
