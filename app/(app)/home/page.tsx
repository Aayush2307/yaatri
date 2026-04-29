'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { circuits, meera, panchangCard, sampleTrip } from '@/lib/mockData';

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(timer);
  }, []);

  const name = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('yaatri_user') ?? '{}').name || 'Aayush Prajapati';
    } catch {
      return 'Aayush Prajapati';
    }
  }, []);

  const handleCircuitSelect = (id: string) => {
    localStorage.setItem('yaatri_selected_circuit', id);
  };

  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <header className="flex items-center justify-between bg-[#FBF8F2] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-[20px] text-[#C6A25D]">•</span>
          <span className="font-serif text-[42px] tracking-[0.12em]">YAATRI</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/notifications" aria-label="Notifications" className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[rgba(43,33,25,0.22)] text-[17px] text-[#7A6554]">
            bell
          </Link>
          <Link href="/account" className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[rgba(43,33,25,0.24)] bg-[#ECE3D4] text-[14px] text-[#4E4033]">
            AP
          </Link>
        </div>
      </header>

      <section
        className="px-5 pb-7 pt-7 text-[#FAF5EB]"
        style={{
          background:
            'radial-gradient(circle at 84% 22%, rgba(198,162,93,0.09), transparent 40%), linear-gradient(160deg, #1C110D 0%, #291813 62%, #1D120F 100%)',
        }}
      >
        <p className="text-[11px] uppercase tracking-[0.2em] text-[#DDBE80]">GOOD MORNING, {name}</p>
        <h1 className="pt-4 font-serif text-[56px] leading-[1.07] text-[#FAF5EB]">
          From <span className="italic text-[#DDBE80]">sankalp</span> to darshan — every step held.
        </h1>

        <Link href="/panchang" className="mt-6 flex items-center gap-3 rounded-[18px] border-[0.5px] border-[rgba(198,162,93,0.45)] bg-[rgba(255,255,255,0.04)] px-4 py-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border-[0.5px] border-[rgba(198,162,93,0.6)] text-[#DDBE80]">☾</span>
          <span>
            <span className="block text-[15px] text-[#FAF2E5]">
              {panchangCard.tithi} · {panchangCard.sanskrit}
            </span>
            <span className="block pt-0.5 text-[13px] text-[#CCB38E]">{panchangCard.muhurat}</span>
          </span>
        </Link>
      </section>

      <section className="space-y-6 px-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <Link href="/plan" className="flex min-h-[44px] items-center justify-center rounded-[12px] border-[0.5px] border-[rgba(43,33,25,0.32)] text-[18px]">
            Plan my yatra
          </Link>
          <Link href="/concierge" className="flex min-h-[44px] items-center justify-center rounded-[12px] border-[0.5px] border-[rgba(43,33,25,0.32)] text-[18px]">
            Concierge
          </Link>
        </div>

        <section className="rounded-[18px] border-[0.5px] border-[rgba(198,162,93,0.5)] bg-[#FFFCF7] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#9A6D2B]">ACTIVE YATRA</p>
              <p className="font-serif text-[42px] leading-none text-[#2D2118]">{sampleTrip.name}</p>
              <p className="pt-1 text-[14px] text-[#7A6554]">12 Jun – 16 Jun · 4 nights</p>
            </div>
            <span className="rounded-full border-[0.5px] border-[#D9C28F] bg-[#F1E5CC] px-3 py-1 text-[13px] text-[#9A6D2B]">In progress</span>
          </div>

          <div className="mt-4 h-[3px] rounded-full bg-[#DFD4C1]">
            <div className="h-full rounded-full bg-[#C6A25D]" style={{ width: `${sampleTrip.progress}%` }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[#7A6554]">
            <span>Booked</span>
            <span>Darshan</span>
            <span>Return</span>
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-[46px] leading-none">Sacred circuits</h2>
            <Link href="/explore" className="text-[14px] text-[#9A6D2B]">
              See all
            </Link>
          </div>

          {loading ? (
            <div className="rounded-[18px] border-[0.5px] border-[rgba(43,33,25,0.22)] bg-[#FFFCF7] p-4 text-[13px] text-[#7A6554]">Loading circuits...</div>
          ) : (
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {circuits.map((c) => (
                <Link
                  key={c.id}
                  href={`/destination/${c.id}`}
                  onClick={() => handleCircuitSelect(c.id)}
                  className="min-w-[188px] rounded-[18px] border-[0.5px] border-[rgba(43,33,25,0.25)] bg-[#FFFCF7]"
                >
                  <div className="h-[102px] rounded-t-[18px]" style={{ background: c.gradient }} />
                  <div className="p-3">
                    <p className="font-serif text-[36px] leading-none text-[#2D2118]">{c.name}</p>
                    <p className="text-[13px] text-[#7A6554]">{c.stops}</p>
                    <div className="mt-1 flex items-center justify-between text-[13px] text-[#7A6554]">
                      <span className="text-[#2D2118]">{c.price}</span>
                      <span>{c.nights}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[18px] border-[0.5px] border-[rgba(43,33,25,0.25)] bg-[#FFFCF7] p-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full border-[0.5px] border-[#D8CCB8] bg-[radial-gradient(circle_at_40%_30%,#F7E6CF,transparent_55%),#F2E6D5]" />
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#7A6554]">Meera · online</p>
              <p className="pt-1 font-serif text-[32px] leading-tight text-[#2D2118]">“{meera.lastMessage}”</p>
            </div>
          </div>
          <Link href="/concierge" className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-[12px] border-[0.5px] border-[rgba(43,33,25,0.32)] text-[18px]">
            Open concierge
          </Link>
        </section>
      </section>

      <nav className="fixed bottom-0 left-0 right-0 border-t-[0.5px] border-[rgba(43,33,25,0.22)] bg-[#F5F0E8] px-3 pb-5 pt-2.5">
        <ul className="grid grid-cols-4 gap-1">
          <li className="flex min-h-[44px] flex-col items-center justify-center gap-1.5 text-[#2B2119]">
            <span>⌂</span>
            <span className="text-[10px] tracking-[0.06em]">Home</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C6A25D]" />
          </li>
          <li className="flex min-h-[44px] flex-col items-center justify-center gap-1.5 text-[#7D6A59]">
            <span>⌕</span>
            <span className="text-[10px] tracking-[0.06em]">Explore</span>
          </li>
          <li className="flex min-h-[44px] flex-col items-center justify-center gap-1.5 text-[#7D6A59]">
            <span>☷</span>
            <span className="text-[10px] tracking-[0.06em]">Yatras</span>
          </li>
          <li className="flex min-h-[44px] flex-col items-center justify-center gap-1.5 text-[#7D6A59]">
            <span>◌</span>
            <span className="text-[10px] tracking-[0.06em]">Profile</span>
          </li>
        </ul>
      </nav>
    </main>
  );
}

