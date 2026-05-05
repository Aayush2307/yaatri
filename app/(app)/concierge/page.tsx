'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import BackButton from '@/components/BackButton';
import { buildMeeraWhatsAppUrl } from '@/lib/whatsapp';

const defaultPrompt = 'Namaste Meera, I need help planning my yatra';

const promptChips = [
  'Which yatra is right for my family?',
  'What is the best time for darshan?',
  'Can you help plan a 3-day trip?',
];

function buildWhatsAppLink(message: string) {
  return buildMeeraWhatsAppUrl(message);
}

export default function ConciergePage() {
  const primaryWhatsAppHref = buildWhatsAppLink(defaultPrompt);

  return (
    <main className="min-h-screen bg-[#FAF5EB] pb-24 text-[#2B2119] flex flex-col">
      <div className="mx-auto w-full px-4 md:px-8 lg:px-12 md:max-w-2xl pt-6">
        <BackButton />
        <section className="mt-4 md:mt-2">
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Meera Concierge</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Your yatra, held by someone who understands.</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Meera helps with rituals, darshan timing, routes, and family needs — through WhatsApp.
          </p>
        </section>

        <section className="mt-6 rounded-2xl bg-gradient-to-br from-[#F8E9D3] via-[#FFFCF7] to-[#F4E2BF] p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF8EE] text-xl text-[#C66A2B] shadow-sm">ॐ</div>
            <div>
              <p className="font-serif text-2xl leading-tight">Meera</p>
              <p className="text-xs text-[#8A7665]">Available on WhatsApp</p>
            </div>
          </div>
          <p className="pt-4 text-sm leading-relaxed text-[#6F5946]">Ask before you plan. Ask while you travel.</p>

          <a
            href={primaryWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C66A2B] px-4 text-sm font-medium text-[#FFF8EE] shadow-sm"
          >
            Continue on WhatsApp
          </a>
        </section>

        <section className="mt-6 space-y-3">
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="font-medium">Choose the right yatra</p>
            <p className="pt-1 text-sm text-[#8A7665]">Based on your sankalp, dates, and family needs.</p>
          </div>
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="font-medium">Plan darshan correctly</p>
            <p className="pt-1 text-sm text-[#8A7665]">Understand temple timings, rituals, and local flow.</p>
          </div>
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="font-medium">Travel with confidence</p>
            <p className="pt-1 text-sm text-[#8A7665]">Get help when plans change during the journey.</p>
          </div>
        </section>

        <section className="mt-6">
          <p className="text-xs uppercase tracking-[0.12em] text-[#8A7665]">Suggested prompts</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {promptChips.map((prompt) => (
              <a
                key={prompt}
                href={buildWhatsAppLink(prompt)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] px-3 py-2 text-xs text-[#6F5946] shadow-sm"
              >
                {prompt}
              </a>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="concierge" /></div>
    </main>
  );
}
