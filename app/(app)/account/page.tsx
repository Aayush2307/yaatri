'use client';

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

  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-24 pt-6">
      <div className="mx-auto max-w-md space-y-3">
        <div className="rounded-card bg-indigo-deepest p-4 text-star-white">
          <div className="h-12 w-12 rounded-full bg-[linear-gradient(135deg,#534AB7,#7F77DD)] text-center text-[20px] leading-[48px]">{(user.name || 'Y')[0]}</div>
          <p className="pt-2 text-[13px]">{user.name || 'Yaatri User'}</p>
          <p className="text-[11px] text-star-white/70">{user.phone || '+91XXXXXXXXXX'}</p>
        </div>

        <button
          type="button"
          className="w-full min-h-[44px] rounded-[11px] border-[0.5px] border-error text-[13px] text-error"
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
