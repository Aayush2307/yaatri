'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { circuits } from '@/lib/mockData';

export default function ExplorePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-24 pt-6">
      <div className="mx-auto max-w-md space-y-3">
        <h1 className="font-serif text-[30px] font-light text-text-dark">Sacred destinations</h1>
        <p className="text-[13px] text-text-muted">Explore verified circuits and muhurat-aligned journeys.</p>

        {loading ? (
          <div className="rounded-card border-[0.5px] border-divider bg-white p-4 text-[12px] text-text-muted">Loading destinations...</div>
        ) : circuits.length === 0 ? (
          <div className="rounded-card border-[0.5px] border-divider bg-white p-4 text-[12px] text-text-muted">No destinations found.</div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {circuits.map((c) => (
              <Link
                key={c.id}
                href={`/destination/${c.id}`}
                onClick={() => localStorage.setItem('yaatri_selected_circuit', c.id)}
                className="rounded-card border-[0.5px] border-divider bg-white p-2"
              >
                <div className="h-[58px] rounded-[10px]" style={{ background: c.gradient }} />
                <p className="pt-2 text-[13px] text-text-dark">{c.name}</p>
                <p className="text-[11px] text-text-muted">{c.stops}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0">
        <BottomNav active="explore" />
      </div>
    </main>
  );
}
