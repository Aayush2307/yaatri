'use client';

import { notFound } from 'next/navigation';
import { sacredCircuits } from '@/lib/mockData';
import BackButton from '@/components/BackButton';
import { openMeeraWhatsApp } from '@/lib/whatsapp';

export default function YatraPage({ params }: { params: { id: string } }) {
  const circuit = sacredCircuits.find((c) => c.id === params.id);
  if (!circuit) notFound();

  const meeraPrompt = `Namaste Meera, I want to know more about ${circuit.title}. Can you help me plan this yatra?`;

  return (
    <main className="min-h-screen bg-[#FAF5EB] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <BackButton />

        <section className="mt-4 rounded-2xl bg-[#FFFCF7] p-5 shadow-sm">
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">{circuit.tradition}</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">{circuit.title}</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">{circuit.significance}</p>
        </section>

        {circuit.routeSummary && (
          <section className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <h2 className="font-serif text-xl">Route</h2>
            <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">{circuit.routeSummary}</p>
            <p className="pt-2 text-sm text-[#8A7665]">Duration: {circuit.duration}</p>
            {circuit.bestSeason && (
              <p className="text-sm text-[#8A7665]">Best season: {circuit.bestSeason}</p>
            )}
          </section>
        )}

        {circuit.planningNotes.length > 0 && (
          <section className="mt-4 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <h2 className="font-serif text-xl">Planning notes</h2>
            <ul className="pt-2 space-y-1">
              {circuit.planningNotes.map((note) => (
                <li key={note} className="text-sm leading-relaxed text-[#8A7665]">
                  · {note}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <h2 className="font-serif text-xl">Meera can help with</h2>
          <ul className="pt-2 space-y-1">
            {circuit.meeraCanHelpWith.map((item) => (
              <li key={item} className="text-sm text-[#8A7665]">· {item}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => openMeeraWhatsApp(meeraPrompt)}
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C66A2B] px-4 text-sm font-medium text-[#FFF8EE] shadow-sm"
          >
            Ask Meera about this yatra →
          </button>
        </section>
      </div>
    </main>
  );
}
