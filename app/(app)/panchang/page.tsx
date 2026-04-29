'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { panchangCard } from '@/lib/mockData';

export default function PanchangPage() {
  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-24 pt-6">
      <div className="mx-auto max-w-md space-y-3">
        <header className="rounded-card bg-indigo-deepest p-4 text-star-white">
          <p className="text-[10px] uppercase tracking-[0.1em] text-amethyst">Today&apos;s panchang</p>
          <p className="pt-1 font-serif text-[22px] font-light italic">{panchangCard.tithi}</p>
          <p className="text-[12px] text-star-white/75">{panchangCard.sanskrit}</p>
        </header>
        <section className="rounded-card border-[0.5px] border-divider bg-white p-4 text-[13px] text-text-dark">
          <p>{panchangCard.muhurat}</p>
          <p className="pt-2 text-text-muted">Best for darshan departures and sankalp rituals.</p>
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="home" /></div>
    </main>
  );
}
