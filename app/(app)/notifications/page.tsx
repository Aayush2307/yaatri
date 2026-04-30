'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import BackButton from '@/components/BackButton';

const notifications = [
  { id: 'n1', title: 'Muhurat window held', body: 'Meera reserved Friday Brahma Muhurta slot for your yatra.', time: '2m ago' },
  { id: 'n2', title: 'Trip progress updated', body: 'Kashi Darshan Yatra is now 64% arranged.', time: '1h ago' },
  { id: 'n3', title: 'Document reminder', body: 'Please upload one valid ID proof for each traveller.', time: 'Yesterday' },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen bg-bg-surface px-5 pb-24 pt-6">
      <div className="mx-auto max-w-md space-y-3">
        <BackButton />
        <header className="rounded-card bg-indigo-deepest p-4 text-star-white">
          <p className="font-serif text-[28px] font-light">Notifications</p>
        </header>

        {notifications.map((n) => (
          <article key={n.id} className="rounded-card border-[0.5px] border-divider bg-white p-3">
            <p className="text-[13px] text-text-dark">{n.title}</p>
            <p className="pt-1 text-[11px] text-text-muted">{n.body}</p>
            <p className="pt-1 text-[10px] uppercase tracking-[0.1em] text-text-muted">{n.time}</p>
          </article>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0"><BottomNav active="home" /></div>
    </main>
  );
}
