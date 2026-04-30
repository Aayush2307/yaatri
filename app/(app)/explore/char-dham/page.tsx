import Link from 'next/link';
import { charDham } from '@/lib/mockData';
import BackButton from '@/components/BackButton';

export default function CharDhamPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <BackButton />
        <section className="rounded-2xl bg-[#FFFCF7] p-5 shadow-sm">
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Sacred circuit</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Char Dham Yatra</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            A sacred Himalayan journey through four abodes of spiritual transformation.
          </p>
        </section>

        <section className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Why this yatra</h2>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            Char Dham connects purification through Ganga and Yamuna, liberation through Shiva at Kedarnath,
            and moksha-oriented devotion through Vishnu at Badrinath.
          </p>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            The journey is often seen as a life-cycle path: cleansing, surrender, strength, and spiritual completion.
          </p>
        </section>

        <section className="mt-4 space-y-3">
          <h2 className="font-serif text-2xl">The Four Dhams</h2>
          {charDham.map((temple) => (
            <article key={temple.id} className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
              <h3 className="font-serif text-2xl leading-tight">{temple.name}</h3>
              <p className="pt-1 text-sm text-[#8A7665]">{temple.deity} · {temple.location}, {temple.state}</p>
              {temple.altitude && <p className="pt-1 text-xs text-[#8A7665]">Altitude: {temple.altitude}</p>}
              <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">{temple.significance}</p>
              <p className="pt-2 text-xs text-[#8A7665]">Travel: {temple.travel.access}{temple.travel.trek ? ` · ${temple.travel.trek}` : ''}</p>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Journey structure</h2>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            Recommended order: Yamunotri → Gangotri → Kedarnath → Badrinath.
          </p>
          <p className="pt-2 text-sm text-[#8A7665]">Duration: ~10–12 days</p>
          <p className="text-sm text-[#8A7665]">Season: May–October</p>
        </section>

        <section className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Planning guidance</h2>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            This route includes high-altitude terrain, trekking stretches, and weather-sensitive windows.
            Keep buffer days, prepare for altitude changes, and align darshan pace with family comfort.
          </p>
        </section>

        <section className="mt-4 space-y-2 pb-8">
          <Link href="/plan?circuit=char-dham" className="inline-flex min-h-[46px] w-full items-center justify-center rounded-xl bg-[#C66A2B] px-4 text-sm font-medium text-[#FFF8EE] shadow-sm">
            Create my Char Dham Yatra
          </Link>
          <Link href="/concierge" className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] px-4 text-sm text-[#A45C22]">
            Ask Meera for guidance
          </Link>
        </section>
      </div>
    </main>
  );
}
