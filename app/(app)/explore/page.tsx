'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { circuits } from '@/lib/mockData';

const intentChips = ['All', 'Jyotirlinga', 'Devi', 'River', 'Family', 'First Yatra'] as const;

type IntentChip = (typeof intentChips)[number];

export default function ExplorePage() {
  const [activeIntent, setActiveIntent] = useState<IntentChip>('All');

  const visibleCircuits = useMemo(() => {
    if (activeIntent === 'All') return circuits;

    return circuits.filter((c) => {
      const title = c.name.toLowerCase();
      const stops = c.stops.toLowerCase();

      if (activeIntent === 'Jyotirlinga') return title.includes('omkareshwar') || stops.includes('mahakal') || stops.includes('trimbak');
      if (activeIntent === 'Devi') return title.includes('vaishno') || stops.includes('devi');
      if (activeIntent === 'River') return title.includes('kashi') || title.includes('prayag') || stops.includes('prayagraj');
      if (activeIntent === 'Family') return true;
      if (activeIntent === 'First Yatra') return c.nights.includes('3');
      return true;
    });
  }, [activeIntent]);

  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <section>
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Explore Yatras</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Where does your sankalp call you?</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Discover sacred circuits, temple journeys, and family yatras with clarity.
          </p>
        </section>

        <section className="mt-5">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {intentChips.map((chip) => {
              const isActive = chip === activeIntent;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setActiveIntent(chip)}
                  className={`rounded-full px-3 py-1.5 text-xs whitespace-nowrap transition ${
                    isActive
                      ? 'bg-[#C66A2B] text-[#FFFCF7] shadow-sm'
                      : 'border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] text-[#8A7665]'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6 space-y-4">
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="font-serif text-xl">Not sure where to begin?</p>
            <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
              Meera can help you choose based on your sankalp, dates, and family needs.
            </p>
            <Link href="/concierge" className="mt-3 inline-flex min-h-[42px] items-center text-sm font-medium text-[#C66A2B]">
              Ask Meera →
            </Link>
          </div>

          {visibleCircuits.map((c) => (
            <article key={c.id} className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
              <div className="h-[76px] rounded-xl" style={{ background: c.gradient }} />
              <h2 className="pt-3 font-serif text-2xl leading-tight text-[#2B2119]">{c.name}</h2>
              <p className="pt-1 text-sm leading-relaxed text-[#8A7665]">A guided path from sankalp to darshan, aligned for mindful travel.</p>
              <div className="pt-3 text-xs text-[#8A7665]">
                <p>{c.stops}</p>
                <p className="pt-1">{c.nights} · Easy</p>
              </div>
              <Link href={`/destination/${c.id}`} className="mt-3 inline-flex min-h-[42px] items-center text-sm font-medium text-[#C66A2B]">
                View Yatra →
              </Link>
            </article>
          ))}
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="explore" /></div>
    </main>
  );
}
