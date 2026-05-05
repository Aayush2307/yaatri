import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId')?.trim();

  const trips = await db.trip.findMany({
    where: userId ? { userId } : undefined,
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ ok: true, data: trips });
}
