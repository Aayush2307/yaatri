'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('yaatri_token');
    if (!token) {
      router.replace('/');
    }
  }, [router, pathname]);

  return <>{children}</>;
}
