'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/Button';
import { circuits, meera, panchangCard, sampleTrip } from '@/lib/mockData';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 260);
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
    <main className="min-h-screen bg-[var(--color-parchment)] pb-24">
      <header className="flex items-center justify-between border-b-[0.5px] border-[var(--color-divider)] px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="text-[26px] leading-none text-[var(--color-gold)]">•</span>
          <span className="font-serif text-[44px] tracking-[0.12em] text-[var(--color-text-dark)]">YAATRI</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/notifications" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[var(--color-divider)] text-[18px] text-[var(--color-text-mid)]">
            🔔
          </Link>
          <Link href="/account" className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[var(--color-divider-strong)] bg-[#ECE2D0] text-[14px] text-[var(--color-text-mid)]">
            {(name[0] || 'Y').toUpperCase()}
          </Link>
        </div>
      </header>

      <section className="px-5 pb-6 pt-7 text-[var(--color-paper)]" style={{ background: 'var(--gradient-ink-hero)' }}>
        <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold)]">Good morning, {name}</p>
        <h1 className="pt-4 text-[58px] leading-[1.06]">
          From <span className="italic text-[var(--color-gold)]">sankalp</span> to darshan — every step held.
        </h1>

        <Link href="/panchang" className="mt-6 block rounded-[18px] border-[0.5px] border-[#6d5433] bg-[rgba(255,255,255,0.04)] p-4">
          <p className="text-[15px]">{panchangCard.tithi} · {panchangCard.sanskrit}</p>
          <p className="pt-1 text-[13px] text-[#cab897]">{panchangCard.muhurat}</p>
        </Link>
      </section>

      <section className="space-y-6 px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <ButtonLink href="/plan">Plan my yatra</ButtonLink>
          <ButtonLink href="/concierge">Concierge</ButtonLink>
        </div>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#9a6d2b]">Active yatra</p>
              <p className="font-serif text-[44px] leading-none text-[var(--color-text-dark)]">{sampleTrip.name}</p>
              <p className="pt-1 text-[14px] text-[var(--color-text-mid)]">{sampleTrip.dates} · 4 nights</p>
            </div>
            <span className="rounded-full border-[0.5px] border-[#d8bf8a] bg-[#efe2c6] px-3 py-1 text-[13px] text-[#9a6d2b]">In progress</span>
          </div>
          <div className="mt-4 h-[3px] rounded-full bg-[#ded3bf]">
            <div className="h-full rounded-full bg-[var(--color-gold)]" style={{ width: `${sampleTrip.progress}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--color-text-mid)]">
            <span>Booked</span>
            <span>Darshan</span>
            <span>Return</span>
          </div>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[48px] leading-none text-[var(--color-text-dark)]">Sacred circuits</h2>
            <Link href="/explore" className="text-[14px] text-[#9a6d2b]">See all</Link>
          </div>

          {loading ? (
            <Card className="text-[13px] text-[var(--color-text-mid)]">Loading circuits...</Card>
          ) : circuits.length === 0 ? (
            <Card className="text-[13px] text-[var(--color-text-mid)]">No circuits available right now.</Card>
          ) : (
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {circuits.map((c) => (
                <Link key={c.id} href={`/destination/${c.id}`} onClick={() => handleCircuitSelect(c.id)} className="min-w-[178px] rounded-[18px] border-[0.5px] border-[var(--color-divider)] bg-[var(--color-paper)] p-2">
                  <div className="h-[98px] rounded-[14px]" style={{ background: c.gradient }} />
                  <p className="pt-2 font-serif text-[38px] leading-none text-[var(--color-text-dark)]">{c.name}</p>
                  <p className="text-[13px] text-[var(--color-text-mid)]">{c.stops}</p>
                  <div className="mt-1 flex items-center justify-between text-[13px] text-[var(--color-text-mid)]">
                    <span className="text-[var(--color-text-dark)]">{c.price}</span>
                    <span>{c.nights}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Card>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full border-[0.5px] border-[#d8ccb8] bg-[radial-gradient(circle_at_40%_30%,#f7e6cf,transparent_55%),#f2e6d5]" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--color-text-mid)]">Meera · online</p>
              <p className="pt-1 font-serif text-[34px] leading-tight text-[var(--color-text-dark)]">“{meera.lastMessage}”</p>
            </div>
          </div>
          <ButtonLink href="/concierge" className="mt-4 w-full">Open concierge</ButtonLink>
        </Card>
      </section>

      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav active="home" />
      </div>
    </main>
  );
}
