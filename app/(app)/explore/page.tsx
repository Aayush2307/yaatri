'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { exploreCircuits } from '@/lib/mockData';

function CircuitImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <div className="h-36 w-full rounded-2xl bg-gradient-to-br from-[#F1DFC6] via-[#EFD4B5] to-[#D9B189]" />;
  }

  return (
    <div className="relative h-36 w-full overflow-hidden rounded-2xl">
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 430px) 100vw, 430px" onError={() => setErrored(true)} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#3d201014] via-transparent to-transparent" />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <section>
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Explore Yatras</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Where does your sankalp call you?</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Choose a sacred path based on intention, tradition, season, and family needs.
          </p>
        </section>

        <section className="mt-6 space-y-4">
          <div>
            <h2 className="font-serif text-2xl">Sacred circuits of Bharat</h2>
            <p className="pt-1 text-xs text-[#8A7665]">Each path can be planned with Meera for route, stays, darshan timing, and family support.</p>
          </div>

          {exploreCircuits.map((circuit) => (
            <Link key={circuit.id} href={circuit.href} className="block rounded-3xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-md">
              <CircuitImage src={circuit.image} alt={circuit.title} />

              <div className="pt-3">
                <span className="rounded-full bg-[#F2E0C8] px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-[#A65A22]">{circuit.tradition}</span>
                <h3 className="pt-2 font-serif text-2xl leading-tight text-[#2B2119]">{circuit.title}</h3>
                <p className="pt-1 text-sm text-[#8A7665]">{circuit.significance}</p>

                <div className="pt-2 text-xs text-[#7E6956]">
                  <p>{circuit.duration} · {circuit.regions}</p>
                  <p className="pt-1">Best season: {circuit.bestSeason}</p>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {circuit.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#F7ECDD] px-2.5 py-1 text-[10px] text-[#7A5A42]">{tag}</span>
                  ))}
                </div>

                <p className="pt-3 text-sm font-medium text-[#C4671A]">Explore this yatra →</p>
              </div>
            </Link>
          ))}
        </section>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="explore" /></div>
    </main>
  );
}
