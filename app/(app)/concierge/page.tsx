import { Suspense } from 'react';
import ConciergeChat from './ConciergeChat';

export default function ConciergePage() {
  return (
    <Suspense fallback={null}>
      <ConciergeChat />
    </Suspense>
  );
}
