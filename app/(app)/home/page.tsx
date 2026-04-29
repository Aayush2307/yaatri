'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { LogoMark } from '@/components/icons/LogoMark';
import { MandalaWatermark } from '@/components/icons/MandalaWatermark';
import { sampleTrip } from '@/lib/mockData';

export default function HomePage() {
  const name = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('yaatri_user') ?? '{}').name || 'Aayush';
    } catch {
      return 'Aayush';
    }
  }, []);

  const activeTrip = sampleTrip || null;

  return (
    <main className="min-h-screen bg-bg-surface pb-24">
      <section className="relative overflow-hidden bg-indigo-deepest px-5 pb-6 pt-6 text-star-white">
        <MandalaWatermark className="pointer-events-none absolute -right-12 -top-12 h-[220px] w-[220px] opacity-[0.06]" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <span className="text-[14px] tracking-[0.18em]">YAATRI</span>
          </div>

          <Link href="/account" className="h-8 w-8 rounded-full bg-amethyst/25 text-center text-[12px] leading-8">
            {name[0] || 'A'}
          </Link>
        </div>

        <p className="pt-5 text-[10px] uppercase tracking-[0.1em] text-gold-warm">Namaste, {name}</p>

        <h1 className="pt-2 font-serif text-[30px] font-light leading-[1.18]">
          Where does your <span className="italic text-amethyst">sankalp</span> call you?
        </h1>

        <p className="pt-2 text-[13px] text-star-white/80">
          Every sacred journey begins with a single intention.
        </p>
      </section>

      <section className="space-y-3 px-5 pt-4">
        <div className="rounded-card border-[0.5px] border-divider bg-white px-4 py-3">
          <p className="text-[12px] font-medium text-text-dark">Kartik Purnima is in 6 days</p>
          <p className="pt-1 text-[11px] text-text-muted">Auspicious for river yatras</p>
        </div>

        <div className="rounded-card border-[0.5px] border-divider bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Self-guided</p>
          <p className="pt-1 text-[18px] font-medium text-text-dark">Explore Yatras</p>
          <p className="pt-1 text-[13px] text-text-mid">
            Browse circuits, destinations &amp; sacred routes. Plan at your own pace.
          </p>
          <Link href="/explore" className="mt-3 inline-flex min-h-[44px] items-center text-[13px] text-indigo-mid">
            Begin your yatra &rarr;
          </Link>
        </div>

        <div className="rounded-card border-[0.5px] border-divider bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Personal concierge</p>
          <p className="pt-1 text-[18px] font-medium text-text-dark">Talk to Meera</p>
          <p className="pt-1 text-[13px] text-text-mid">
            Get guidance on rituals, darshan timing &amp; trip planning. She&apos;ll guide you.
          </p>
          <Link href="/concierge" className="mt-3 inline-flex min-h-[44px] items-center text-[13px] text-indigo-mid">
            Start a conversation &rarr;
          </Link>
        </div>

        {activeTrip && (
          <div className="rounded-card border-[0.5px] border-divider bg-white px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Your yatra</p>
            <p className="pt-1 text-[13px] text-text-dark">{activeTrip.name}</p>
            <p className="text-[11px] text-text-muted">{activeTrip.dates}</p>
          </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
