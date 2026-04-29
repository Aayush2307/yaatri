'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';
import { circuits } from '@/lib/mockData';

export default function DestinationPage() {
  const params = useParams<{ id: string }>();
  const destination = circuits.find((c) => c.id === params.id) ?? circuits[0];

  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-24 pt-6">
      <div className="mx-auto max-w-md space-y-4">
        <div className="rounded-card p-4 text-star-white" style={{ background: destination.gradient }}>
          <p className="font-serif text-[28px] font-light italic">{destination.name}</p>
          <p className="text-[12px] text-star-white/75">{destination.stops}</p>
        </div>

        <section className="rounded-card border-[0.5px] border-divider bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Ritual bookings</p>
          <ul className="space-y-2 pt-2 text-[13px] text-text-dark">
            <li className="flex items-center justify-between">
              <span>Abhishek seva</span>
              <span className="text-success">Available</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Rudrabhishek</span>
              <span className="text-gold-warm">On request</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Mangala aarti</span>
              <span className="text-error">3 seats left</span>
            </li>
          </ul>
        </section>

        <Link
          href={`/plan?circuit=${destination.id}`}
          onClick={() => localStorage.setItem('yaatri_selected_circuit', destination.id)}
          className="flex min-h-[44px] items-center justify-center rounded-[11px] bg-indigo-mid text-[13px] text-star-white"
        >
          Add to my yatra plan
        </Link>
      </div>

      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav active="explore" />
      </div>
    </main>
  );
}
