import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  const temples = await db.temple.findMany({
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

  return NextResponse.json({ ok: true, data: temples });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    name?: string;
    location?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    openingTime?: string;
    closingTime?: string;
    description?: string;
  };

  if (!payload.name || !payload.location || !payload.state) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
  }

  const temple = await db.temple.create({
    data: {
      name: payload.name,
      location: payload.location,
      state: payload.state,
      latitude: payload.latitude,
      longitude: payload.longitude,
      openingTime: payload.openingTime,
      closingTime: payload.closingTime,
      description: payload.description,
    },
  });

  return NextResponse.json({ ok: true, data: temple });
}
