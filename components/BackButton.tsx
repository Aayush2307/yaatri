'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ label = 'Back' }: { label?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/');
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="inline-flex items-center gap-2 rounded-full border border-[#E4D7C4] bg-[#FBF7EF] px-4 py-2 text-sm font-medium text-[#6F5845] shadow-sm transition hover:bg-[#F3EADC]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}
