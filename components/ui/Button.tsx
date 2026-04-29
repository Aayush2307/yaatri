import Link from 'next/link';
import type { ReactNode } from 'react';

export function ButtonLink({ href, children, variant = 'outline', className = '' }: { href: string; children: ReactNode; variant?: 'outline' | 'solid'; className?: string }) {
  const base = 'flex min-h-[44px] items-center justify-center rounded-[12px] px-4 text-[18px] font-normal';
  const style =
    variant === 'solid'
      ? 'border-[0.5px] border-[var(--color-ink-soft)] bg-[var(--color-ink-soft)] text-[var(--color-paper)]'
      : 'border-[0.5px] border-[var(--color-divider-strong)] bg-transparent text-[var(--color-text-dark)]';
  return (
    <Link href={href} className={`${base} ${style} ${className}`}>
      {children}
    </Link>
  );
}
