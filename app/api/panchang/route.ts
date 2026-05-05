import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { buildProkeralaDateTime, fetchProkerala, getProkeralaAyanamsa } from '@/lib/prokerala';

const DEFAULT_LAT = process.env.PROKERALA_DEFAULT_LAT || '26.9124';
const DEFAULT_LNG = process.env.PROKERALA_DEFAULT_LNG || '75.7873';
const DEFAULT_TZ = process.env.PROKERALA_DEFAULT_TZ || 'Asia/Kolkata';
const PANCHANG_ENDPOINT = process.env.PROKERALA_PANCHANG_ENDPOINT || '/astrology/panchang';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');
  const templeId = searchParams.get('templeId');
  const lat = searchParams.get('lat')?.trim();
  const lng = searchParams.get('lng')?.trim();
  const tz = searchParams.get('tz')?.trim();

  const date = dateParam ? new Date(dateParam) : new Date();

  const temple = templeId ? await db.temple.findUnique({ where: { id: templeId } }) : null;
  const latitude = String(temple?.latitude ?? lat ?? DEFAULT_LAT);
  const longitude = String(temple?.longitude ?? lng ?? DEFAULT_LNG);
  const timezone = tz || DEFAULT_TZ;
  const dateValue = date.toISOString().slice(0, 10);
  const datetime = buildProkeralaDateTime(dateValue, timezone);

  try {
    const data = await fetchProkerala(PANCHANG_ENDPOINT, {
      coordinates: `${latitude},${longitude}`,
      datetime,
      ayanamsa: getProkeralaAyanamsa(),
    });
    return NextResponse.json({ ok: true, source: 'prokerala', date: date.toISOString(), data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Prokerala panchang error:', message);
    return NextResponse.json(
      { ok: false, error: 'Unable to fetch panchang data.', details: process.env.NODE_ENV === 'development' ? message : undefined },
      { status: 502 },
    );
  }
}

export async function POST() {
  return NextResponse.json({ ok: false, error: 'Create muhurat via /api/muhurat.' }, { status: 405 });
}
