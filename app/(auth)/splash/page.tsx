'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LogoMark } from '@/components/icons/LogoMark';
import { MandalaWatermark } from '@/components/icons/MandalaWatermark';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('yaatri_token');
      router.replace(token ? '/home' : '/');
    }, 2200);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-indigo-deepest px-5 py-12 text-star-white">
      <MandalaWatermark className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" />
      <div />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <LogoMark className="h-20 w-20" />
        <div className="text-[28px] font-light tracking-[0.22em]">YAATRI</div>
        <p className="font-serif text-[13px] font-light italic text-text-muted">Yatra begins within.</p>
      </div>
      <div className="z-10 flex flex-col items-center gap-2 pb-6">
        <div className="h-[2px] w-12 overflow-hidden rounded-full bg-indigo-primary">
          <motion.div className="h-full bg-amethyst" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2, ease: 'easeOut' }} />
        </div>
        <p className="text-[11px] text-text-muted/40">v1.0 · spiritual concierge</p>
      </div>
    </main>
  );
}
