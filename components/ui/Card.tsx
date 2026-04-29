import type { ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[18px] border-[0.5px] border-[var(--color-divider)] bg-[var(--color-paper)] p-4 ${className}`}>{children}</section>;
}
