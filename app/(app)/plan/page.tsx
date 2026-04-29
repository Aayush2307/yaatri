'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BottomNav } from '@/components/layout/BottomNav';
import { circuits } from '@/lib/mockData';

export default function PlanPage() {
  const [selected, setSelected] = useState(circuits[0].id);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCircuit = params.get('circuit');
    const stored = localStorage.getItem('yaatri_selected_circuit');

    const initial =
      (requestedCircuit && circuits.some((c) => c.id === requestedCircuit) && requestedCircuit) ||
      (stored && circuits.some((c) => c.id === stored) && stored) ||
      circuits[0].id;

    setSelected(initial);
  }, []);

  useEffect(() => {
    localStorage.setItem('yaatri_selected_circuit', selected);
  }, [selected]);

  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-24 pt-6">
      <div className="mx-auto max-w-md space-y-3">
        <h1 className="font-serif text-[30px] font-light text-text-dark">Plan your yatra</h1>
        <p className="text-[13px] text-text-muted">What draws you to this yatra? Tell us your intention.</p>
        {circuits.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className="w-full rounded-card border-[0.5px] p-3 text-left"
            style={{ borderColor: selected === c.id ? '#534AB7' : 'rgba(127,119,221,0.3)', backgroundColor: selected === c.id ? 'rgba(83,74,183,0.08)' : 'white' }}
          >
            <p className="text-[13px] text-text-dark">{c.name}</p>
            <p className="text-[11px] text-text-muted">{c.stops}</p>
          </button>
        ))}
        <Link href="/wallet/demo-trip?confirmed=true" className="flex min-h-[44px] items-center justify-center rounded-[11px] bg-indigo-mid text-[13px] text-star-white">
          Send to Meera →
        </Link>
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav active="plan" />
      </div>
    </main>
  );
}
