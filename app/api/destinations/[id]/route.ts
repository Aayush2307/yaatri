import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

type RouteParams = {
  params: { id: string };
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const destination = await db.temple.findUnique({ where: { id: params.id } });
  if (!destination) {
    return NextResponse.json({ ok: false, error: 'Destination not found.' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, data: destination });
}

export async function POST() {
  return NextResponse.json({ ok: false, error: 'Update destinations via /api/temples.' }, { status: 405 });
}
