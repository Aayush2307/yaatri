import Link from 'next/link';
import { shaktiPeethas } from '@/lib/mockData';
import BackButton from '@/components/BackButton';

export default function ShaktiPeethasPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <BackButton />
        <section className="rounded-2xl bg-[#FFFCF7] p-5 shadow-sm">
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Sacred circuit</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">51 Shakti Peethas</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            A sacred journey through the energy centers of Devi Shakti across Bharat.
          </p>
        </section>

        <section className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Why this yatra</h2>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            In the Devi tradition, when Sati’s body was carried by Shiva, Vishnu’s discus created sacred sites across Bharat.
            These became Shakti Peethas, each linked to a body part, a Devi form, and a Bhairava presence.
          </p>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            Each peetha is an energy center in sacred geography — approached with devotion, pacing, and regional context.
          </p>
        </section>

        <section className="mt-4 space-y-3">
          <h2 className="font-serif text-2xl">Key Peethas</h2>
          {shaktiPeethas.map((peetha) => (
            <article key={peetha.id} className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.1em] text-[#8A7665]">{peetha.devi}</p>
              <h3 className="pt-1 font-serif text-2xl leading-tight">{peetha.name}</h3>
              <p className="pt-1 text-sm text-[#8A7665]">{peetha.location}, {peetha.state} · {peetha.region}</p>
              <p className="pt-2 text-sm text-[#6F5A49]">Body part: {peetha.bodyPart} · Bhairava: {peetha.bhairava}</p>
              <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">{peetha.significance}</p>
              {(peetha.travel.nearestAirport || peetha.travel.nearestRailway || peetha.travel.distanceFromCity) && (
                <p className="pt-2 text-xs text-[#8A7665]">
                  Travel: {[peetha.travel.nearestAirport, peetha.travel.nearestRailway, peetha.travel.distanceFromCity].filter(Boolean).join(' · ')}
                </p>
              )}
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">How to approach this yatra</h2>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            This is not a single-trip circuit. Most yatris complete Shakti Peethas across phases.
          </p>
          <ul className="pt-2 space-y-1 text-sm text-[#8A7665]">
            <li>• North circuit</li>
            <li>• East circuit</li>
            <li>• South circuit</li>
          </ul>
        </section>

        <section className="mt-4 space-y-2 pb-8">
          <Link href="/plan?circuit=shakti-peethas" className="inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-[#C66A2B] px-4 text-sm font-medium text-[#FFF8EE] shadow-sm">
            Create my Shakti Yatra
          </Link>
          <Link href="/concierge" className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] px-4 text-sm text-[#A45C22]">
            Ask Meera for guidance
          </Link>
        </section>
      </div>
    </main>
  );
}
