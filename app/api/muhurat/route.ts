import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { buildProkeralaDateTime, fetchProkeralaWithFallback, getProkeralaAyanamsa } from '@/lib/prokerala';

const DEFAULT_LAT = process.env.PROKERALA_DEFAULT_LAT || '26.9124';
const DEFAULT_LNG = process.env.PROKERALA_DEFAULT_LNG || '75.7873';
const DEFAULT_TZ = process.env.PROKERALA_DEFAULT_TZ || 'Asia/Kolkata';
const MUHURAT_ENDPOINT = process.env.PROKERALA_MUHURAT_ENDPOINT || '/astrology/choghadiya';
const MUHURAT_FALLBACKS = ['/astrology/choghadiya', '/astrology/gowri-muhurat', '/astrology/hora'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const templeId = searchParams.get('templeId')?.trim();
  const date = searchParams.get('date')?.trim();
  const lat = searchParams.get('lat')?.trim();
  const lng = searchParams.get('lng')?.trim();
  const tz = searchParams.get('tz')?.trim();

  const filters: { templeId?: string; date?: Date } = {};
  if (templeId) filters.templeId = templeId;
  if (date) filters.date = new Date(date);

  const muhurats = await db.muhurat.findMany({
    where: Object.keys(filters).length ? filters : undefined,
    take: 10,
    orderBy: { date: 'asc' },
  });

  if (muhurats.length > 0) {
    return NextResponse.json({ ok: true, source: 'db', data: muhurats });
  }

  const temple = templeId ? await db.temple.findUnique({ where: { id: templeId } }) : null;
  const latitude = String(temple?.latitude ?? lat ?? DEFAULT_LAT);
  const longitude = String(temple?.longitude ?? lng ?? DEFAULT_LNG);
  const timezone = tz || DEFAULT_TZ;
  const dateValue = date || new Date().toISOString().slice(0, 10);
  const datetime = buildProkeralaDateTime(dateValue, timezone);

  try {
    const data = await fetchProkeralaWithFallback(
      [MUHURAT_ENDPOINT, ...MUHURAT_FALLBACKS.filter((item) => item !== MUHURAT_ENDPOINT)],
      {
      coordinates: `${latitude},${longitude}`,
      datetime,
      ayanamsa: getProkeralaAyanamsa(),
      },
    );
    return NextResponse.json({ ok: true, source: 'prokerala', data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Prokerala muhurat error:', message);
    return NextResponse.json(
      { ok: false, error: 'Unable to fetch muhurat data.', details: process.env.NODE_ENV === 'development' ? message : undefined },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    templeId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    notes?: string;
  };

  if (!payload.date || !payload.startTime || !payload.endTime) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
  }

  const muhurat = await db.muhurat.create({
    data: {
      templeId: payload.templeId,
      date: new Date(payload.date),
      startTime: payload.startTime,
      endTime: payload.endTime,
      notes: payload.notes,
    },
  });

  return NextResponse.json({ ok: true, data: muhurat });
}
