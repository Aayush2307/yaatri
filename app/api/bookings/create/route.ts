import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

function buildReference() {
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 12);
  return `YAATRI-${stamp}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const payload = (await request.json()) as {
    tripId?: string;
    amount?: number;
    currency?: string;
  };

  const booking = await db.booking.create({
    data: {
      userId: auth.userId,
      tripId: payload.tripId,
      amount: payload.amount,
      currency: payload.currency || 'INR',
      referenceCode: buildReference(),
      status: 'pending',
    },
  });

  return NextResponse.json({ ok: true, data: booking });
}
