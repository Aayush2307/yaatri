'use client';

import Link from 'next/link';
import { useMemo } from 'react';

export type NavTab = 'home' | 'plan' | 'explore' | 'concierge' | 'account';

type BottomNavProps = {
  active: NavTab;
};

function Icon({ path, active }: { path: string; active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d={path} stroke={active ? '#534AB7' : '#7B74A8'} strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BottomNav({ active }: BottomNavProps) {
  const tabs = useMemo(
    () => [
      { key: 'home' as const, label: 'Home', href: '/home', path: 'M3 9.5L10 4l7 5.5V17H3V9.5Z M7.2 17v-4.5h5.6V17' },
      { key: 'plan' as const, label: 'Plan', href: '/plan', path: 'M4 5h12v12H4z M7 8h6 M7 11h6 M7 14h3' },
      { key: 'explore' as const, label: 'Explore', href: '/explore', path: 'M10 17s5-3.8 5-8.2A5 5 0 0 0 5 8.8C5 13.2 10 17 10 17Z M10 10.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z' },
      { key: 'concierge' as const, label: 'Concierge', href: '/concierge', path: 'M4 10c0-3.3 2.7-6 6-6s6 2.7 6 6 M6.3 13.2a3.7 3.7 0 0 0 7.4 0 M4 10v3.2 M16 10v3.2' },
      { key: 'account' as const, label: 'Account', href: '/account', path: 'M10 10a2.8 2.8 0 1 0 0-5.6A2.8 2.8 0 0 0 10 10Z M4.5 16.2c.6-2.2 2.7-3.7 5.5-3.7s4.9 1.5 5.5 3.7' },
    ],
    [],
  );

  return (
    <nav className="border-t-[0.5px] border-divider bg-white px-3 pb-5 pt-2.5">
      <ul className="grid grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.key}>
              <Link href={tab.href} className="flex min-h-[44px] flex-col items-center justify-center gap-1.5">
                <Icon path={tab.path} active={isActive} />
                <span className="text-[10px] uppercase tracking-[0.1em]" style={{ color: isActive ? '#534AB7' : '#7B74A8' }}>
                  {tab.label}
                </span>
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: isActive ? '#534AB7' : 'transparent' }} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
