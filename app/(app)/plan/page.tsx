'use client';

import { useMemo, useState } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { CHAR_DHAM_ROUTE } from '@/data/routes';

const MEERA_WHATSAPP_NUMBER = 'REPLACE_WITH_NUMBER';

export default function PlanPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(CHAR_DHAM_ROUTE.tirths.map((t) => t.id));

  const selectedDhams = useMemo(
    () => CHAR_DHAM_ROUTE.tirths.filter((t) => selectedIds.includes(t.id)),
    [selectedIds],
  );

  const estimatedDays = useMemo(
    () => selectedDhams.reduce((sum, t) => sum + t.recommendedDays, 0),
    [selectedDhams],
  );

  const toggleDham = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const configuredNumber = process.env.NEXT_PUBLIC_CONCIERGE_WHATSAPP?.replace(/\D/g, '') || MEERA_WHATSAPP_NUMBER;
  const selectedNames = selectedDhams.map((d) => d.name).join(', ') || 'None selected';
  const message = `Namaste Meera, I want help planning a Char Dham Yatra. Selected dhams: ${selectedNames}. Estimated duration: ${estimatedDays || 0} days. Please guide me with route, darshan timing, stays, and travel support.`;
  const whatsappHref = `https://wa.me/${configuredNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-44 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <section>
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Plan</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Char Dham Yatra</h1>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            Review the sacred route and continue with Meera for guided planning.
          </p>
        </section>

        <section className="mt-5 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <p className="text-sm text-[#6E6256]">Selected dhams: {selectedDhams.length} / {CHAR_DHAM_ROUTE.tirths.length}</p>
          <p className="pt-1 text-sm text-[#6E6256]">Estimated days: {estimatedDays}</p>
          <p className="pt-1 text-sm text-[#6E6256]">Order: Yamunotri → Gangotri → Kedarnath → Badrinath</p>
        </section>

        <section className="relative mt-6 pl-6">
          <div className="absolute bottom-6 left-[11px] top-3 w-px bg-[rgba(43,33,25,0.18)]" />
          <div className="space-y-3">
            {CHAR_DHAM_ROUTE.tirths.map((tirth) => {
              const isSelected = selectedIds.includes(tirth.id);
              return (
                <div key={tirth.id} className="relative">
                  <span className={`absolute -left-6 top-6 h-3 w-3 rounded-full ${isSelected ? 'bg-[#C67C1D]' : 'bg-[#CFBCA3]'}`} />
                  <button
                    type="button"
                    onClick={() => toggleDham(tirth.id)}
                    className={`w-full rounded-2xl border p-4 text-left shadow-sm transition ${
                      isSelected
                        ? 'border-[#C67C1D] bg-[#F5E9D3]'
                        : 'border-[rgba(43,33,25,0.12)] bg-[#FFFCF7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xl text-[#2B2119]">{tirth.name}</p>
                        <p className="pt-1 text-sm text-[#8A5A1A]">{tirth.deity} · {tirth.state}</p>
                      </div>
                      <span className="rounded-full bg-[#EDC173] px-3 py-1 text-xs text-[#5B3E1D]">{tirth.recommendedDays} days</span>
                    </div>
                    <p className="pt-2 text-sm leading-relaxed text-[#6A4314]">{tirth.significance}</p>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4">
        <div className="mx-auto max-w-md rounded-2xl border border-[rgba(43,33,25,0.15)] bg-[#FFFCF7] p-3 shadow-md">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C66A2B] px-4 text-sm font-medium text-[#FFF8EE]"
          >
            Continue with Meera
          </a>
          <p className="pt-2 text-center text-xs leading-relaxed text-[#8A7665]">
            WhatsApp concierge for route, stays, darshan timing, and family support.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="plan" /></div>
    </main>
  );
}
