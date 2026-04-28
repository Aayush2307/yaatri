'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';

const intentions = [
  { key: 'darshan_devotion', label: 'Darshan & devotion', desc: 'Temple darshan journeys', accent: '#534AB7' },
  { key: 'mannat_fulfilment', label: 'Mannat & fulfilment', desc: 'Offerings and gratitude', accent: '#1D9E75' },
  { key: 'spiritual_seeking', label: 'Spiritual seeking', desc: 'Silence, satsang, reflection', accent: '#D4537E' },
];

export default function WelcomePage() {
  const router = useRouter();
  const setIntention = useOnboardingStore((s) => s.setIntention);
  const [selected, setSelected] = useState(intentions[0]);

  return (
    <main className="min-h-screen bg-indigo-deepest px-5 pb-10 pt-8 text-star-white">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <div className="flex items-center gap-2 pt-2">
          <span className="h-[0.5px] w-7 bg-gold-warm" />
          <span className="text-[10px] uppercase tracking-[0.1em] text-gold-warm">Welcome to Yaatri</span>
        </div>
        <h1 className="font-serif text-[26px] font-light leading-[1.18]">
          What calls you <br /> to this <span className="italic text-amethyst">yatra?</span>
        </h1>
        <p className="text-[12px] font-light text-star-white/45">Select your sankalp so Meera can curate your path with care.</p>

        <div className="grid gap-2 pt-2">
          {intentions.map((item) => {
            const isActive = selected.key === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelected(item)}
                className="flex min-h-[44px] items-center justify-between rounded-card border-[0.5px] p-3 text-left"
                style={{
                  borderColor: isActive ? item.accent : 'rgba(127,119,221,0.3)',
                  backgroundColor: isActive ? `${item.accent}22` : 'rgba(127,119,221,0.08)',
                }}
              >
                <div>
                  <p className="text-[13px] font-medium">{item.label}</p>
                  <p className="text-[11px] text-star-white/55">{item.desc}</p>
                </div>
                <motion.span
                  className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px]"
                  style={{ backgroundColor: isActive ? item.accent : 'transparent', border: '0.5px solid rgba(127,119,221,0.4)' }}
                  animate={{ scale: isActive ? 1 : 0.95 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                >
                  {isActive ? '✓' : ''}
                </motion.span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setIntention({ key: selected.key, label: selected.label });
            router.push('/onboarding/profile');
          }}
          className="mt-2 min-h-[44px] rounded-[11px] bg-indigo-mid text-[13px] font-medium"
        >
          Continue →
        </button>
        <p className="text-center text-[12px] text-text-muted">
          Already have an account?{' '}
          <Link className="text-amethyst" href="/signin">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
