'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { LogoMark } from '@/components/icons/LogoMark';
import { MandalaWatermark } from '@/components/icons/MandalaWatermark';
import { circuits, meera, panchangCard, sampleTrip } from '@/lib/mockData';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const name = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('yaatri_user') ?? '{}').name || 'Yaatri';
    } catch {
      return 'Yaatri';
    }
  }, []);

  const handleCircuitSelect = (id: string) => {
    localStorage.setItem('yaatri_selected_circuit', id);
  };

  return (
    <main className="min-h-screen bg-bg-surface pb-24">
      <section className="relative overflow-hidden bg-indigo-deepest px-5 pb-5 pt-6 text-star-white">
        <MandalaWatermark className="pointer-events-none absolute -right-12 -top-12 h-[220px] w-[220px] opacity-[0.06]" />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <span className="text-[14px] tracking-[0.18em]">YAATRI</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/notifications" aria-label="Notifications" className="flex h-8 w-8 items-center justify-center rounded-full border-[0.5px] border-divider text-[14px]">
              🔔
            </Link>
            <Link href="/account" className="h-8 w-8 rounded-full bg-amethyst/25 text-center text-[12px] leading-8">
              {name[0] || 'Y'}
            </Link>
          </div>
        </div>
        <p className="pt-5 text-[10px] uppercase tracking-[0.1em] text-gold-warm">Good morning, {name}</p>
        <h1 className="pt-2 font-serif text-[30px] font-light leading-[1.18]">
          From <span className="italic text-amethyst">sankalp</span> to darshan — every step held.
        </h1>
        <Link href="/panchang" className="mt-4 block rounded-card border-[0.5px] border-[rgba(200,184,255,0.2)] bg-[rgba(127,119,221,0.12)] p-3">
          <p className="text-[13px]">
            {panchangCard.tithi} · {panchangCard.sanskrit}
          </p>
          <p className="pt-1 text-[11px] text-star-white/70">{panchangCard.muhurat}</p>
        </Link>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link href="/plan" className="flex min-h-[44px] items-center justify-center rounded-[11px] bg-indigo-mid text-[13px]">
            Plan my yatra
          </Link>
          <Link href="/concierge" className="flex min-h-[44px] items-center justify-center rounded-[11px] border-[0.5px] border-amethyst text-[13px]">
            Concierge
          </Link>
        </div>
      </section>

      <section className="space-y-4 px-5 pt-5">
        <div className="rounded-card p-4 text-star-white" style={{ background: 'linear-gradient(155deg, #1A1630 0%, #2D2660 55%, #3D3480 100%)' }}>
          <p className="text-[13px]">{sampleTrip.name}</p>
          <p className="text-[11px] text-star-white/70">{sampleTrip.dates}</p>
          <div className="mt-2 h-[4px] rounded-full bg-star-white/20">
            <div className="h-full rounded-full bg-amethyst" style={{ width: `${sampleTrip.progress}%` }} />
          </div>
        </div>

        <div>
          <p className="pb-2 text-[14px] font-medium text-text-dark">Sacred circuits</p>
          {loading ? (
            <div className="rounded-card border-[0.5px] border-divider bg-white p-4 text-[12px] text-text-muted">Loading circuits...</div>
          ) : circuits.length === 0 ? (
            <div className="rounded-card border-[0.5px] border-divider bg-white p-4 text-[12px] text-text-muted">No circuits available right now.</div>
          ) : (
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {circuits.map((c) => (
                <Link
                  key={c.id}
                  href={`/destination/${c.id}`}
                  onClick={() => handleCircuitSelect(c.id)}
                  className="min-w-[152px] rounded-card border-[0.5px] border-divider bg-white p-2"
                >
                  <div className="h-[86px] rounded-[10px]" style={{ background: c.gradient }} />
                  <p className="pt-2 text-[13px] text-text-dark">{c.name}</p>
                  <p className="text-[11px] text-text-muted">{c.stops}</p>
                  <p className="pt-1 text-[11px] text-text-mid">
                    {c.price} · {c.nights}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-card border-[0.5px] border-divider bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Meera · online</p>
          <p className="pt-1 text-[13px] text-text-dark">{meera.lastMessage}</p>
          <Link href="/concierge" className="mt-3 inline-flex min-h-[44px] items-center rounded-[10px] bg-indigo-mid px-4 text-[13px] text-star-white">
            Open concierge
          </Link>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav active="home" />
      </div>
    </main>
  );
}
