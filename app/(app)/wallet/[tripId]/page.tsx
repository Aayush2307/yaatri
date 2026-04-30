'use client';

import { useParams } from 'next/navigation';
import { sampleTrip } from '@/lib/mockData';
import BackButton from '@/components/BackButton';

export default function WalletTripPage() {
  const params = useParams<{ tripId: string }>();

  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-10 pt-6">
      <div className="mx-auto max-w-md space-y-3">
        <BackButton />
        <div className="rounded-card bg-[linear-gradient(155deg,#1A1630_0%,#2D2660_55%,#3D3480_100%)] p-4 text-star-white">
          <p className="text-[11px] uppercase tracking-[0.1em] text-star-white/60">Trip wallet</p>
          <p className="pt-1 font-serif text-[26px] font-light italic">{sampleTrip.name}</p>
          <p className="text-[12px] text-star-white/75">Ref: {params.tripId}</p>
          <p className="text-[12px] text-star-white/75">{sampleTrip.dates}</p>
          <div className="mt-2 h-[4px] rounded-full bg-star-white/20"><div className="h-full rounded-full bg-amethyst" style={{ width: `${sampleTrip.progress}%` }} /></div>
        </div>

        <section className="rounded-card border-[0.5px] border-divider bg-white p-4">
          <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Documents</p>
          <ul className="space-y-2 pt-2 text-[13px] text-text-dark">
            <li className="flex items-center justify-between"><span>ID Proof</span><span className="text-success">Confirmed</span></li>
            <li className="flex items-center justify-between"><span>Train tickets</span><span className="text-gold-warm">Pending</span></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
