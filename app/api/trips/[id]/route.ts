import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

type RouteParams = {
  params: { id: string };
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const trip = await db.trip.findUnique({ where: { id: params.id } });
  if (!trip) {
    return NextResponse.json({ ok: false, error: 'Trip not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: trip });
}

export async function POST() {
  return NextResponse.json({ ok: false, error: 'Use /api/trips/create to create trips.' }, { status: 405 });
}
