import ConciergeChat from './ConciergeChat';

export default function ConciergePage({
  searchParams,
}: {
  searchParams: { q?: string; yatra?: string; from?: string };
}) {
  return (
    <div className="h-full min-h-screen">
      <ConciergeChat
        prefillQuery={searchParams.q ?? ''}
        prefillYatra={searchParams.yatra ?? ''}
        prefillFrom={searchParams.from ?? ''}
      />
    </div>
  );
}
