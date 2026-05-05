'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || 'Unable to send OTP.');
        return;
      }

      setStep('otp');
    } catch {
      setError('Unable to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91${phone}`, otp }),
      });

      const data = (await response.json()) as { ok?: boolean; token?: string; user?: { name?: string; phone?: string } };
      if (!response.ok || !data.ok || !data.token) {
        setError('Invalid OTP. Please try again.');
        return;
      }

      localStorage.setItem('yaatri_token', data.token);
      localStorage.setItem('yaatri_user', JSON.stringify({ name: data.user?.name || 'Yaatri User', phone: data.user?.phone || `+91${phone}` }));
      router.push('/home');
    } catch {
      setError('Unable to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

        {step === 'otp' ? (
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter OTP"
            className="min-h-[44px] rounded-[10px] border-[0.5px] border-divider bg-transparent px-3 text-[13px]"
          />
        ) : null}

        {error ? <p className="text-[12px] text-[#F0B3B3]">{error}</p> : null}

        {step === 'phone' ? (
          <button
            type="button"
            disabled={phone.length < 10 || isLoading}
            onClick={sendOtp}
            className="min-h-[44px] rounded-[11px] bg-indigo-mid text-[13px] disabled:opacity-40"
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
              }}
              className="min-h-[44px] flex-1 rounded-[11px] border border-divider text-[13px]"
            >
              Back
            </button>
            <button
              type="button"
              disabled={otp.length < 6 || isLoading}
              onClick={verifyOtp}
              className="min-h-[44px] flex-1 rounded-[11px] bg-indigo-mid text-[13px] disabled:opacity-40"
            >
              {isLoading ? 'Verifying...' : 'Verify & sign in'}
            </button>
          </div>
        )}

        <p className="text-center text-[12px] text-text-muted">
          New to Yaatri?{' '}
          <Link href="/" className="text-amethyst">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
