import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  const destinations = await db.temple.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { state: { contains: query, mode: 'insensitive' } },
          ],
        }
      : undefined,
    take: 10,
    orderBy: { name: 'asc' },
  });

  return NextResponse.json({ ok: true, data: destinations });
}

export async function POST() {
  return NextResponse.json({ ok: false, error: 'Create destinations via /api/temples.' }, { status: 405 });
}
