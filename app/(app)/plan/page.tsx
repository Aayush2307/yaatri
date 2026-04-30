'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { usePlan } from '@/hooks/usePlan';
import type { SuggestedCircuit } from '@/types/yaatra';

const CIRCUIT_LABEL: Record<SuggestedCircuit, string> = {
  char_dham: 'Char Dham Circuit',
  jyotirlinga: 'Jyotirlinga Circuit',
  shakti_peethas: 'Shakti Peethas Circuit',
};

export default function PlanPage() {
  const [circuit, setCircuit] = useState<SuggestedCircuit | null>(null);

  useEffect(() => {
    const y = JSON.parse(localStorage.getItem('yaatra_yatra') || '{}');
    setCircuit((y.circuit as SuggestedCircuit) ?? 'char_dham');
  }, []);

  if (!circuit) return null;

  return <PlanPhase circuit={circuit} />;
}

function PlanPhase({ circuit }: { circuit: SuggestedCircuit }) {
  const router = useRouter();
  const { route, tirths, toggleTirth, plannedDays, departureDate, setDepartureDate, confirmPlan, plannedTirths } = usePlan(circuit);

  const selectedKm = useMemo(
    () => tirths.filter((t) => t.status === 'planned').reduce((sum, t) => sum + (t.distanceFromPrev || 0), 0),
    [tirths],
  );

  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <section>
          <p className="text-sm text-[#8A7665]">Sankalp</p>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="font-serif text-[44px] leading-none">{CIRCUIT_LABEL[circuit]}</h1>
            <span className="rounded-full bg-[#F2E0C8] px-4 py-1 text-sm text-[#A65A22]">Plan</span>
          </div>
          <p className="pt-2 text-sm text-[#8A7665]">Select the dhams for your Yatra.</p>
        </section>

        <section className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-5xl leading-none">{plannedDays}</p>
            <p className="pt-1 text-sm text-[#6E6256]">days planned</p>
          </div>
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-5xl leading-none">{plannedTirths.length} / {route.tirths.length}</p>
            <p className="pt-1 text-sm text-[#6E6256]">dhams selected</p>
          </div>
        </section>

        <section className="mt-6">
          <p className="text-xs uppercase tracking-[0.12em] text-[#8A7665]">Route</p>
          <div className="relative mt-3 pl-6">
            <div className="absolute bottom-6 left-[11px] top-3 w-px bg-[rgba(43,33,25,0.18)]" />
            <div className="space-y-3">
              {tirths.map((tirth, idx) => {
                const isPlanned = tirth.status === 'planned';
                return (
                  <div key={tirth.id}>
                    <div className="relative">
                      <span className={`absolute -left-6 top-6 h-3 w-3 rounded-full ${isPlanned ? 'bg-[#C67C1D]' : 'bg-[#CFBCA3]'}`} />
                      <button
                        type="button"
                        onClick={() => toggleTirth(tirth.id)}
                        className={`w-full rounded-3xl border p-4 text-left shadow-sm ${
                          isPlanned
                            ? 'border-[#C67C1D] bg-[#F5E9D3]'
                            : 'border-[rgba(43,33,25,0.12)] bg-[#FFFCF7]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-2xl leading-tight">{tirth.name}</p>
                            <p className="pt-1 text-sm text-[#8A5A1A]">{tirth.deity} · {tirth.state}</p>
                          </div>
                          <span className="rounded-full bg-[#EDC173] px-3 py-1 text-sm text-[#5B3E1D]">{tirth.recommendedDays} days</span>
                        </div>
                        <p className="pt-2 text-[34px] leading-tight text-[#6A4314]">{tirth.significance}</p>
                      </button>
                    </div>
                    {idx > 0 && <p className="px-1 pt-2 text-sm text-[#7C746A]">{tirth.distanceFromPrev} km from previous</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <label className="flex items-center justify-between gap-3">
            <span className="text-[34px]">Departure</span>
            <input
              type="date"
              value={departureDate ?? ''}
              onChange={(e) => setDepartureDate(e.target.value || null)}
              className="min-h-[44px] flex-1 rounded-xl border border-[rgba(43,33,25,0.15)] bg-[#FFFCF7] px-3 text-sm"
            />
          </label>
        </section>

        <button
          type="button"
          disabled={plannedTirths.length < 1}
          onClick={() => {
            confirmPlan();
            router.push('/home');
          }}
          className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center rounded-2xl border border-[rgba(43,33,25,0.2)] bg-[#FFFCF7] px-4 text-sm disabled:opacity-50"
        >
          Confirm {plannedTirths.length} dhams · {plannedDays} days →
        </button>

        <p className="pt-3 text-center text-xs text-[#8A7665]">Distance selected: {selectedKm} km · Season guidance: May–October.</p>

        <Link href="/concierge" className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl text-sm text-[#A45C22]">
          Ask Meera for guidance
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="plan" /></div>
    </main>
  );
}
