import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

type RouteParams = {
  params: { id: string };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const auth = requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const booking = await db.booking.findFirst({
    where: { id: params.id, userId: auth.userId },
  });

  if (!booking) {
    return NextResponse.json({ ok: false, error: 'Booking not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: booking });
}
