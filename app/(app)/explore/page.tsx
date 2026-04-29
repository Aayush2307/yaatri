'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/layout/BottomNav';
import { circuits } from '@/lib/mockData';

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <section>
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Explore Yatras</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Where does your sankalp call you?</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Discover sacred circuits, temple journeys, and family yatras with clarity.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <h2 className="font-serif text-2xl">Sacred circuits of Bharat</h2>

          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-sm font-medium text-[#2B2119]">Jyotirlinga</p>
            <p className="pt-1 text-sm text-[#8A7665]">12 sacred jyotirlinga traditions across Bharat.</p>
            <Link href="/explore" className="mt-2 inline-flex min-h-[36px] items-center text-sm font-medium text-[#C66A2B]">
              Explore this yatra →
            </Link>
          </div>

          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-[#2B2119]">Shakti Peethas</p>
              <span className="rounded-full bg-[#F3E0C7] px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] text-[#A45B21]">Devi / Shakti</span>
            </div>
            <p className="pt-1 text-sm text-[#8A7665]">A living map of Devi traditions rooted in sacred geography.</p>
            <p className="pt-1 text-sm text-[#8A7665]">51 sacred sites across Bharat</p>
            <Link href="/explore/shakti-peethas" className="mt-2 inline-flex min-h-[36px] items-center text-sm font-medium text-[#C66A2B]">
              Explore this yatra →
            </Link>
          </div>

          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-sm font-medium text-[#2B2119]">Char Dham</p>
            <p className="pt-1 text-sm text-[#8A7665]">Four sacred Himalayan shrines representing the path to purification and liberation.</p>
            <p className="pt-1 text-sm text-[#8A7665]">Yamunotri · Gangotri · Kedarnath · Badrinath</p>
            <Link href="/explore/char-dham" className="mt-2 inline-flex min-h-[36px] items-center text-sm font-medium text-[#C66A2B]">
              Explore this yatra →
            </Link>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="font-serif text-xl">Not sure where to begin?</p>
            <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
              Meera can help you choose based on your sankalp, dates, and family needs.
            </p>
            <Link href="/concierge" className="mt-3 inline-flex min-h-[42px] items-center text-sm font-medium text-[#C66A2B]">
              Ask Meera →
            </Link>
          </div>

          {circuits.map((c) => (
            <article key={c.id} className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
              <div className="h-[76px] rounded-xl" style={{ background: c.gradient }} />
              <h2 className="pt-3 font-serif text-2xl leading-tight text-[#2B2119]">{c.name}</h2>
              <p className="pt-1 text-sm leading-relaxed text-[#8A7665]">A guided path from sankalp to darshan, aligned for mindful travel.</p>
              <div className="pt-3 text-xs text-[#8A7665]">
                <p>{c.stops}</p>
                <p className="pt-1">{c.nights} · Easy</p>
              </div>
              <Link href={`/destination/${c.id}`} className="mt-3 inline-flex min-h-[42px] items-center text-sm font-medium text-[#C66A2B]">
                View Yatra →
              </Link>
            </article>
          ))}
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="explore" /></div>
    </main>
  );
}
