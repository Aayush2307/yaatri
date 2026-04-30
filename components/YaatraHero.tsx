'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface YaatraHeroProps {
  userName: string;
  onExplore: () => void;
}

const HERO_LINES = [
  "Your family's yatra starts right here.",
  'Set your sankalp. The path will open.',
  'Every pilgrimage begins with one step.',
];

export default function YaatraHero({ userName, onExplore }: YaatraHeroProps) {
  const router = useRouter();
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [activeSankalpId, setActiveSankalpId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setHeadlineIndex((prev) => (prev + 1) % HERO_LINES.length);
        setIsVisible(true);
      }, 280);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('yaatra_yatra');
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (parsed?.sankalpId) {
      setActiveSankalpId(parsed.sankalpId);
    }
  }, []);

  const initial = useMemo(() => userName?.trim()?.[0]?.toUpperCase() || 'Y', [userName]);

  return (
    <section className="mx-auto w-full max-w-[430px] space-y-4 px-4 pt-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="font-serif text-[13px] tracking-widest text-[#5A3520]">YAATRA</p>
          <p className="pt-1 text-sm text-[#7A5A42]">Namaste, {userName}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C4671A] text-sm font-medium text-[#FFF6EB]">{initial}</div>
      </header>

      <div className="relative overflow-hidden rounded-2xl bg-[#F7EFE4] p-5 shadow-sm">
        <h1 className={`font-serif text-4xl leading-tight text-[#3D2010] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {HERO_LINES[headlineIndex]}
        </h1>
        <p className="relative z-10 pt-3 text-sm leading-relaxed text-[#6A4A34]">
          Begin with intention, move with clarity, and reach darshan with peace at every step.
        </p>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 opacity-20">
          <svg viewBox="0 0 430 140" className="h-36 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 122C62 112 76 76 106 78C124 79 140 99 168 99C199 99 211 51 240 50C272 49 286 95 320 96C350 97 372 69 410 72" stroke="#C4671A" strokeWidth="2" strokeLinecap="round" />
            <path d="M215 102L228 84L242 102" stroke="#C4671A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M228 84V108" stroke="#C4671A" strokeWidth="2" strokeLinecap="round" />
            <path d="M54 124C85 114 103 104 126 87" stroke="#C4671A" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 7" />
            <path d="M372 28C377 24 385 25 389 31C383 33 376 31 372 28Z" stroke="#C4671A" strokeWidth="2" />
            <circle cx="403" cy="22" r="2.5" stroke="#C4671A" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl bg-[#C4671A] p-4 text-[#FFF5E7] shadow-md">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wider">Primary</p>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
              <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 2.5V6M12 18V21.5M2.5 12H6M18 12H21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="12" r="1.7" fill="currentColor" />
            </svg>
          </div>
          <h2 className="pt-1 font-serif text-[26px] leading-tight">Explore Yatras</h2>
          <p className="pt-2 text-sm leading-relaxed text-[#F9E7D4]">Discover sacred routes and begin at your own rhythm.</p>
          <button
            type="button"
            onClick={onExplore}
            className="mt-4 inline-flex min-h-[2.625rem] items-center rounded-full bg-[#FFF1DE] px-4 text-sm font-medium text-[#A6521B]"
          >
            Explore →
          </button>
        </article>

        <article className="rounded-2xl bg-[#FFF8EE] p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wider text-[#7A5A42]">Personal concierge</p>
          <h2 className="pt-1 font-serif text-2xl leading-tight text-[#3D2010]">Talk to Meera</h2>
          <div className="mt-2 flex items-center gap-2 text-sm text-[#6A4A34]">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Online now</span>
          </div>
          <div className="pt-3">
            <svg viewBox="0 0 40 40" className="h-10 w-10 text-[#C4671A]" fill="none">
              <path d="M20 30C19 24 14 21 14 16C14 12.5 16.5 10 20 10C23.5 10 26 12.5 26 16C26 21 21 24 20 30Z" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 28C18 24.5 10.5 22.5 10 16.5M20 28C22 24.5 29.5 22.5 30 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="20" cy="16" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => window.open('https://wa.me/919999999999?text=Namaste%20Meera,%20I%20want%20to%20begin%20my%20Yatra.', '_blank', 'noopener,noreferrer')}
            className="mt-2 text-sm font-medium text-[#C4671A]"
          >
            Talk to her →
          </button>
          <p className="pt-1 text-[10px] text-[#8D8378]">Avg. reply: 8 min</p>
        </article>
      </div>

      {activeSankalpId && (
        <div className="flex items-center justify-between rounded-xl border border-[rgba(61,32,16,0.15)] bg-[#FFF8EE] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#C4671A]" fill="none">
              <path d="M8 1.5C10 3.3 11 5.3 11 7.3C11 10 9.6 12 8 14.5C6.4 12 5 10 5 7.3C5 5.3 6 3.3 8 1.5Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <p className="text-[13px] text-[#4B2A17]">Your {activeSankalpId} Sankalp is active</p>
          </div>
          <button type="button" onClick={() => router.push('/plan')} className="text-xs font-medium text-[#C4671A]">
            Continue →
          </button>
        </div>
      )}
    </section>
  );
}
