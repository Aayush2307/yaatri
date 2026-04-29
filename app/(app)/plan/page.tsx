'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/layout/BottomNav';
import { circuits } from '@/lib/mockData';

const paceOptions = ['Easy', 'Balanced', 'Packed'] as const;

export default function PlanPage() {
  const [selected, setSelected] = useState(circuits[0].id);
  const [sankalp, setSankalp] = useState('');
  const [city, setCity] = useState('');
  const [dates, setDates] = useState('');
  const [travellers, setTravellers] = useState('');
  const [pace, setPace] = useState<(typeof paceOptions)[number]>('Balanced');

  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <section>
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Plan Your Yatra</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Turn your sankalp into a clear journey.</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Share a few details and we’ll shape a simple path from intent to darshan.
          </p>

          <div className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.1em] text-[#8A7665]">
              <span>Sankalp</span>
              <span>Dates</span>
              <span>Family</span>
              <span>Darshan</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#C66A2B]" />
              <span className="h-[2px] flex-1 rounded-full bg-[#DDBE80]" />
              <span className="h-2 w-2 rounded-full bg-[#DDBE80]" />
              <span className="h-[2px] flex-1 rounded-full bg-[#E9D7B6]" />
              <span className="h-2 w-2 rounded-full bg-[#E9D7B6]" />
              <span className="h-[2px] flex-1 rounded-full bg-[#F1E5D1]" />
              <span className="h-2 w-2 rounded-full bg-[#F1E5D1]" />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs text-[#8A7665]">Sankalp / intention</span>
              <input
                value={sankalp}
                onChange={(e) => setSankalp(e.target.value)}
                placeholder="e.g., Family darshan with a peaceful pace"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#C66A2B]"
              />
            </label>

            <label className="block">
              <span className="text-xs text-[#8A7665]">Starting city</span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Delhi"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#C66A2B]"
              />
            </label>

            <label className="block">
              <span className="text-xs text-[#8A7665]">Dates or “Need guidance”</span>
              <input
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="e.g., 12–15 June or Need guidance"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#C66A2B]"
              />
            </label>

            <label className="block">
              <span className="text-xs text-[#8A7665]">Travellers / family</span>
              <input
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
                placeholder="e.g., 2 adults, 1 child"
                className="mt-1.5 min-h-[44px] w-full rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#C66A2B]"
              />
            </label>

            <div>
              <p className="text-xs text-[#8A7665]">Pace</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {paceOptions.map((option) => {
                  const isActive = option === pace;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPace(option)}
                      className={`min-h-[40px] rounded-xl border text-xs ${
                        isActive
                          ? 'border-[#C66A2B] bg-[#F8E6CE] text-[#8C4B1E]'
                          : 'border-[rgba(43,33,25,0.12)] bg-[#FFFDF9] text-[#8A7665]'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="pb-2 text-xs text-[#8A7665]">Sacred route</p>
              <div className="space-y-2">
                {circuits.map((c) => {
                  const isSelected = selected === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelected(c.id)}
                      className={`w-full rounded-xl border p-3 text-left shadow-sm ${
                        isSelected
                          ? 'border-[#C66A2B] bg-[#F8E6CE]/70'
                          : 'border-[rgba(43,33,25,0.12)] bg-[#FFFCF7]'
                      }`}
                    >
                      <p className="text-sm text-[#2B2119]">{c.name}</p>
                      <p className="text-xs text-[#8A7665]">{c.stops} · {c.nights}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button type="button" className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C66A2B] px-4 text-sm font-medium text-[#FFF8EE] shadow-sm">
            Create Yatra Plan
          </button>

          <Link href="/concierge" className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] px-4 text-sm text-[#8C4B1E]">
            Ask Meera to help
          </Link>
        </section>

        <section className="mt-6 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <p className="font-serif text-xl">Not sure about dates or rituals?</p>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            Meera can help choose the right timing, temple order, and family-friendly pace.
          </p>
          <Link href="/concierge" className="mt-3 inline-flex min-h-[42px] items-center text-sm font-medium text-[#C66A2B]">
            Talk to Meera →
          </Link>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="plan" /></div>
    </main>
  );
}
