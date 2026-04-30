'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SANKALPS } from '@/data/sankalps';
import { useYatra } from '@/hooks/useYatra';
import { BottomNav } from '@/components/layout/BottomNav';
import { YaatriLogo } from '@/components/YaatriLogo';
import { sampleTrip } from '@/lib/mockData';

export default function HomePage() {
  const router = useRouter();
  const { yatra, selectSankalp } = useYatra();

  const name = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('yaatri_user') ?? '{}').name || 'Aayush';
    } catch {
      return 'Aayush';
    }
  }, []);

  const activeTrip = sampleTrip || null;
  const selectedSankalp = SANKALPS.find((item) => item.id === yatra.sankalpId) || null;

  const routeForSankalp = (circuit: string) => {
    if (circuit === 'char_dham') return '/plan';
    if (circuit === 'shakti_peethas') return '/explore/shakti-peethas';
    if (circuit === 'jyotirlinga') return '/explore';
    return '/explore';
  };

  const circuitLabelMap = {
    shakti_peethas: 'Shakti Peetha',
    char_dham: 'Char Dham',
    jyotirlinga: 'Jyotirlinga',
  } as const;

  const circuitMetaMap = {
    shakti_peethas: '51 peethas',
    char_dham: '4 dhams',
    jyotirlinga: '12 temples',
  } as const;

  return (
    <main className="min-h-screen bg-[#FAF5EB] text-[#3F2D1F]">
      <div className="mx-auto max-w-md px-4 pb-24 pt-6">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <YaatriLogo size="sm" />
            <p className="pt-1 text-sm text-[#6E5642]">Namaste, {name}</p>
          </div>
          <Link
            href="/account"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7D5BF] text-sm font-medium text-[#7A542F] shadow-sm"
          >
            {name[0] || 'A'}
          </Link>
        </header>

        <section className="space-y-6">
          <div className="rounded-2xl bg-[#F5F0E8] p-5 shadow-sm">
            <h1 className="font-serif text-4xl leading-tight text-[#4A3322]">Your family&apos;s yatra starts right here.</h1>
            <p className="pt-3 text-sm leading-relaxed text-[#6E5642]">
              Begin with intention, move with clarity, and reach darshan with peace at every step.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-gradient-to-br from-[#C66A2B] to-[#D48A4F] p-5 text-[#FFF8EE] shadow-md">
                <p className="text-xs uppercase tracking-[0.12em] text-[#FDE9CC]">Primary</p>
                <h2 className="pt-2 text-2xl font-semibold leading-tight">Explore Yatras</h2>
                <p className="pt-2 text-sm leading-relaxed text-[#FBE8D0]">Discover sacred routes and begin at your own rhythm.</p>
                <Link
                  href="/explore"
                  className="mt-4 inline-flex min-h-[42px] items-center rounded-xl bg-[#FFF4E4] px-4 text-sm font-medium text-[#A4541E]"
                >
                  Explore →
                </Link>
              </div>

              <div className="rounded-2xl bg-[#FFF8EE] p-5 shadow-sm">
                <p className="text-xs uppercase tracking-[0.12em] text-[#8B6A4B]">Personal concierge</p>
                <h2 className="pt-2 text-2xl font-semibold leading-tight text-[#4A3322]">Talk to Meera</h2>
                <p className="pt-2 text-sm text-[#6E5642]">Online now</p>
                <Link href="/concierge" className="mt-4 inline-flex min-h-[42px] items-center text-sm font-medium text-[#A45C22]">
                  Talk to her →
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#FFF8EE] px-4 py-3 shadow-sm">
            <p className="text-xs font-medium text-[#7A5C3E]">Kartik Purnima is in 6 days</p>
            <p className="pt-1 text-xs text-[#8E7256]">Auspicious for river yatras</p>
          </div>

          <div className="rounded-2xl bg-[#F5F0E8] p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.12em] text-[#8A7665]">Choose your Sankalp</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {SANKALPS.map((sankalp) => {
                const isSelected = yatra.sankalpId === sankalp.id;
                const circuit = circuitLabelMap[sankalp.suggestedCircuit];
                const circuitMeta = circuitMetaMap[sankalp.suggestedCircuit];
                return (
                  <button
                    key={sankalp.id}
                    type="button"
                    onClick={() => selectSankalp(sankalp)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-[#C66A2B] bg-[#F5E7D3] shadow-sm ring-1 ring-[#DDBE80]'
                        : 'border-[rgba(43,33,25,0.12)] bg-[#FFFCF7]'
                    }`}
                  >
                    <p className="font-medium text-[#2B2119]">{sankalp.label}</p>
                    <p className="pt-1 text-sm leading-relaxed text-[#8A7665]">{sankalp.description}</p>
                    {isSelected && <p className="mt-2 inline-flex rounded-full bg-[#EDC173] px-2.5 py-1 text-xs text-[#5A3A20]">{circuit} · {circuitMeta}</p>}
                  </button>
                );
              })}
            </div>

            {selectedSankalp && (
              <div className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 transition">
                <p className="text-sm text-[#6E5642]">{circuitLabelMap[selectedSankalp.suggestedCircuit]} · {circuitMetaMap[selectedSankalp.suggestedCircuit]}</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-xl leading-tight">Begin your {circuitLabelMap[selectedSankalp.suggestedCircuit]} Yatra</p>
                  <button
                    type="button"
                    onClick={() => router.push(routeForSankalp(selectedSankalp.suggestedCircuit))}
                    className="inline-flex min-h-[42px] items-center rounded-xl border border-[rgba(43,33,25,0.25)] bg-white px-4 text-sm"
                  >
                    Begin →
                  </button>
                </div>
              </div>
            )}
          </div>

          {activeTrip && (
            <div className="rounded-xl bg-[#FFF8EE] px-4 py-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.1em] text-[#8B6A4B]">Your yatra</p>
              <p className="pt-1 text-sm text-[#4A3322]">{activeTrip.name}</p>
              <p className="text-xs text-[#8E7256]">{activeTrip.dates}</p>
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="home" /></div>
    </main>
  );
}
