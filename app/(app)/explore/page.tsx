'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { circuits } from '@/lib/mockData';

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-24 pt-6">
      <div className="mx-auto max-w-md">
        <h1 className="font-serif text-[30px] font-light text-text-dark">Sacred destinations</h1>
        <p className="pb-3 text-[13px] text-text-muted">Explore verified circuits and muhurat-aligned journeys.</p>
        <div className="grid grid-cols-2 gap-2">
          {circuits.map((c) => (
            <article key={c.id} className="rounded-card border-[0.5px] border-divider bg-white p-2">
              <div className="h-[58px] rounded-[10px]" style={{ background: c.gradient }} />
              <p className="pt-2 text-[13px] text-text-dark">{c.name}</p>
              <p className="text-[11px] text-text-muted">{c.stops}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="explore" /></div>
    </main>
  );
}
