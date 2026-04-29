'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';

export default function AccountPage() {
  const router = useRouter();
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('yaatri_user') ?? '{}');
    } catch {
      return {};
    }
  }, []);

  const initials = (user.name || 'Y').slice(0, 1).toUpperCase();
  const language = user.language || 'Not set yet';
  const familyTravellers = user.familyTravellers || user.family || 'Not set yet';
  const homeCity = user.homeCity || user.city || 'Not set yet';
  const savedYatras = Array.isArray(user.savedYatras) ? user.savedYatras.length : user.savedYatras || 'Not set yet';

  return (
    <main className="min-h-screen bg-[#F5F0E8] pb-24 text-[#2B2119]">
      <div className="mx-auto max-w-md px-4 pt-6">
        <section>
          <p className="text-sm tracking-[0.12em] text-[#8A7665]">Account</p>
          <h1 className="pt-2 font-serif text-4xl leading-tight">Your yatra preferences, kept simple.</h1>
          <p className="pt-3 text-sm leading-relaxed text-[#8A7665]">
            Manage how Yaatra supports your family’s sacred journeys.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F2E2CB] text-lg font-medium text-[#A65A22]">{initials}</div>
            <div>
              <p className="text-base font-medium text-[#2B2119]">{user.name || 'Yaatri User'}</p>
              <p className="text-xs text-[#8A7665]">Yaatra companion</p>
            </div>
          </div>
          <p className="pt-3 text-xs text-[#8A7665]">{user.phone || '+91XXXXXXXXXX'}</p>
        </section>

        <section className="mt-6 space-y-3">
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-[#8A7665]">Language</p>
            <p className="pt-1 text-sm text-[#2B2119]">{language}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-[#8A7665]">Family travellers</p>
            <p className="pt-1 text-sm text-[#2B2119]">{familyTravellers}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-[#8A7665]">Home city</p>
            <p className="pt-1 text-sm text-[#2B2119]">{homeCity}</p>
          </div>
          <div className="rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.1em] text-[#8A7665]">Saved yatras</p>
            <p className="pt-1 text-sm text-[#2B2119]">{savedYatras}</p>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[rgba(43,33,25,0.12)] bg-[#FFFCF7] p-4 shadow-sm">
          <p className="font-serif text-xl">Need help with a yatra?</p>
          <p className="pt-2 text-sm leading-relaxed text-[#8A7665]">
            Meera can help with rituals, timing, routes, and family needs.
          </p>
          <Link href="/concierge" className="mt-3 inline-flex min-h-[42px] items-center text-sm font-medium text-[#C66A2B]">
            Talk to Meera →
          </Link>
        </section>

        <button
          type="button"
          className="mt-6 w-full min-h-[44px] rounded-xl border border-[rgba(43,33,25,0.25)] bg-[#FFF8EE] text-sm text-[#7B4B2A]"
          onClick={() => {
            localStorage.removeItem('yaatri_token');
            localStorage.removeItem('yaatri_user');
            router.push('/welcome');
          }}
        >
          Sign out
        </button>
      </div>
      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="account" /></div>
    </main>
  );
}
