'use client';

import Link from 'next/link';
import { BottomNav } from '@/components/layout/BottomNav';

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

          <article className="rounded-3xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-5 shadow-md">
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="rounded-full bg-[#F2E0C8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#A65A22]">Shiva Path</span>
              <div className="h-16 w-24 rounded-2xl bg-gradient-to-br from-[#F6E4CC] via-[#FDF5E9] to-[#EDD6B6] p-2">
                <svg viewBox="0 0 96 64" className="h-full w-full" aria-hidden="true">
                  <path d="M18 48h60" stroke="#C66A2B" strokeWidth="2" strokeLinecap="round" />
                  <rect x="34" y="30" width="28" height="16" rx="8" fill="#DDBE80" />
                  <path d="M48 16c5 4 8 8 8 12" stroke="#C66A2B" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="64" cy="18" r="4" fill="#DDBE80" />
                </svg>
              </div>
            </div>
            <h3 className="font-serif text-2xl leading-tight">Jyotirlinga</h3>
            <p className="pt-1 text-sm leading-relaxed text-[#8A7665]">12 sacred jyotirlinga traditions across Bharat.</p>
            <p className="pt-2 text-xs text-[#8A7665]">Shiva · 12 temples · Moksha</p>
            <Link href="/explore" className="mt-3 inline-flex min-h-[38px] items-center text-sm font-medium text-[#C66A2B]">
              Explore this yatra →
            </Link>
          </article>

          <article className="rounded-3xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-5 shadow-md">
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="rounded-full bg-[#F2E0C8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#A65A22]">Devi / Shakti</span>
              <div className="h-16 w-24 rounded-2xl bg-gradient-to-br from-[#FCEED9] via-[#FFF8EE] to-[#EFD8B6] p-2">
                <svg viewBox="0 0 96 64" className="h-full w-full" aria-hidden="true">
                  <circle cx="48" cy="32" r="18" fill="none" stroke="#DDBE80" strokeWidth="2" />
                  <path d="M48 16 62 40H34Z" fill="#C66A2B" opacity="0.75" />
                  <circle cx="48" cy="32" r="5" fill="#DDBE80" />
                </svg>
              </div>
            </div>
            <h3 className="font-serif text-2xl leading-tight">51 Shakti Peethas</h3>
            <p className="pt-1 text-sm leading-relaxed text-[#8A7665]">A living map of Devi traditions rooted in sacred geography.</p>
            <p className="pt-2 text-xs text-[#8A7665]">Devi · 51 sites · Energy centers</p>
            <Link href="/explore/shakti-peethas" className="mt-3 inline-flex min-h-[38px] items-center text-sm font-medium text-[#C66A2B]">
              Explore this yatra →
            </Link>
          </article>

          <article className="rounded-3xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-5 shadow-md">
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="rounded-full bg-[#F2E0C8] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-[#A65A22]">Himalayan Dham</span>
              <div className="h-16 w-24 rounded-2xl bg-gradient-to-br from-[#E9D5B8] via-[#FDF5EA] to-[#DDBE80] p-2">
                <svg viewBox="0 0 96 64" className="h-full w-full" aria-hidden="true">
                  <path d="M16 46 32 24l10 14 8-10 14 18" fill="none" stroke="#C66A2B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="28" cy="18" r="2.5" fill="#DDBE80" />
                  <circle cx="40" cy="16" r="2.5" fill="#DDBE80" />
                  <circle cx="54" cy="18" r="2.5" fill="#DDBE80" />
                  <circle cx="66" cy="16" r="2.5" fill="#DDBE80" />
                </svg>
              </div>
            </div>
            <h3 className="font-serif text-2xl leading-tight">Char Dham</h3>
            <p className="pt-1 text-sm leading-relaxed text-[#8A7665]">Four sacred Himalayan shrines for purification and liberation.</p>
            <p className="pt-2 text-xs text-[#8A7665]">Yamunotri · Gangotri · Kedarnath · Badrinath</p>
            <Link href="/explore/char-dham" className="mt-3 inline-flex min-h-[38px] items-center text-sm font-medium text-[#C66A2B]">
              Explore this yatra →
            </Link>
          </article>
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="explore" /></div>
    </main>
  );
}
