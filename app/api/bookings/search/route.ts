import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status')?.trim();
  const reference = searchParams.get('reference')?.trim();

  const bookings = await db.booking.findMany({
    where: {
      userId: auth.userId,
      ...(status ? { status } : {}),
      ...(reference ? { referenceCode: { contains: reference, mode: 'insensitive' } } : {}),
    },
    take: 20,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ ok: true, data: bookings });
}
