import { Suspense } from 'react';
import ConciergeChat from './ConciergeChat';

type RawParams = { [key: string]: string | string[] | undefined };

function first(val: string | string[] | undefined): string {
  return Array.isArray(val) ? (val[0] ?? '') : (val ?? '');
}

function ConciergeChatLoader({ searchParams }: { searchParams: RawParams }) {
  return (
    <ConciergeChat
      prefillQuery={first(searchParams.q)}
      prefillYatra={first(searchParams.yatra)}
      prefillFrom={first(searchParams.from)}
    />
  );
}

export default function ConciergePage({ searchParams }: { searchParams: RawParams }) {
  return (
    <div className="h-full min-h-screen">
      <Suspense fallback={null}>
        <ConciergeChatLoader searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
