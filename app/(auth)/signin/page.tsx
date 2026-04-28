'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');

  return (
    <main className="min-h-screen bg-indigo-deepest px-5 pb-10 pt-8 text-star-white">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <p className="text-[10px] uppercase tracking-[0.1em] text-amethyst">Welcome back</p>
        <h1 className="font-serif text-[30px] font-light leading-[1.18]">
          Sign in to <span className="italic text-amethyst">your yatra</span>
        </h1>
        <p className="text-[12px] text-star-white/55">We&apos;ll send a 6-digit code to your WhatsApp.</p>

        <div className="flex gap-2">
          <div className="flex min-h-[44px] items-center rounded-[10px] border-[0.5px] border-divider px-3 text-[13px]">+91 🇮🇳</div>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Phone number"
            className="min-h-[44px] flex-1 rounded-[10px] border-[0.5px] border-divider bg-transparent px-3 text-[13px]"
          />
        </div>

        <button
          type="button"
          disabled={phone.length < 10}
          onClick={() => {
            localStorage.setItem('yaatri_token', 'mock-token');
            localStorage.setItem('yaatri_user', JSON.stringify({ name: 'Yaatri User', phone: `+91${phone}` }));
            router.push('/home');
          }}
          className="min-h-[44px] rounded-[11px] bg-indigo-mid text-[13px] disabled:opacity-40"
        >
          Verify & sign in
        </button>

        <p className="text-center text-[12px] text-text-muted">
          New to Yaatri?{' '}
          <Link href="/welcome" className="text-amethyst">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
