'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoadingDots } from '@/components/ui/LoadingDots';
import { useOnboardingStore } from '@/store/onboardingStore';

const options = [
  { key: 'en' as const, title: 'English', desc: 'Default · NRI-friendly', accent: '#534AB7', message: 'Namaste, I will guide every booking with clarity.' },
  { key: 'hi' as const, title: 'हिंदी', desc: 'भारत के लिए उत्तम', accent: '#C8A855', message: 'नमस्ते, मैं आपकी यात्रा की हर तैयारी संभालूँगी।' },
  { key: 'bilingual' as const, title: 'EN + हिं', desc: 'Recommended', accent: '#1D9E75', message: 'Namaste, I can speak in English + हिंदी as your family prefers.' },
];

export default function LanguagePage() {
  const router = useRouter();
  const setLanguage = useOnboardingStore((s) => s.setLanguage);
  const reset = useOnboardingStore((s) => s.reset);
  const profile = useOnboardingStore((s) => s.profile);
  const intention = useOnboardingStore((s) => s.intention);

  const [selected, setSelected] = useState<'en' | 'hi' | 'bilingual'>('bilingual');
  const [loading, setLoading] = useState(false);

  const message = options.find((x) => x.key === selected)?.message;

  return (
    <main className="min-h-screen bg-indigo-deepest px-5 pb-8 pt-6 text-star-white">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="rounded-[12px] bg-[rgba(127,119,221,0.15)] px-3 py-2 text-[11px] text-amethyst">
          {profile?.name ?? 'Guest'} · {profile?.groupSize ?? 1} travellers · Senior Mode {profile?.hasSenior ? 'on' : 'off'}
        </div>
        <h1 className="font-serif text-[28px] font-light leading-[1.18]">How shall Meera speak to you?</h1>

        {options.map((opt) => {
          const active = selected === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelected(opt.key)}
              className="rounded-[16px] border-[0.5px] p-4 text-left"
              style={{ borderColor: active ? opt.accent : 'rgba(127,119,221,0.3)', backgroundColor: active ? `${opt.accent}22` : 'rgba(127,119,221,0.08)' }}
            >
              <p className="text-[13px] font-medium">{opt.title}</p>
              <p className="text-[11px] text-star-white/60">{opt.desc}</p>
            </button>
          );
        })}

        <div className="rounded-card border-[0.5px] border-divider bg-[#0E0C1A] p-4">
          <p className="text-[10px] uppercase tracking-[0.1em] text-text-muted">Meera · spiritual concierge</p>
          <AnimatePresence mode="wait">
            <motion.p key={selected} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: 'easeOut' }} className="pt-2 text-[13px]">
              {message}
            </motion.p>
          </AnimatePresence>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            setLanguage(selected);
            localStorage.setItem('yaatri_token', 'mock-token');
            localStorage.setItem(
              'yaatri_user',
              JSON.stringify({ name: profile?.name ?? 'Yaatri', phone: profile?.phone ?? '', intention: intention?.label ?? '', language: selected, seniorMode: profile?.hasSenior ?? false }),
            );
            setTimeout(() => {
              reset();
              router.push('/home?welcome=true');
            }, 900);
          }}
          className="flex min-h-[44px] items-center justify-center rounded-[11px] bg-indigo-mid text-[13px] font-medium"
        >
          {loading ? <LoadingDots /> : 'Begin my Yatra →'}
        </button>
      </div>
    </main>
  );
}
