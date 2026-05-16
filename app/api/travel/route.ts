// Server-side proxy for all travel data APIs — keeps RAPIDAPI_KEY out of the browser.
import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/services/flights';
import { getTrainsBetweenStations } from '@/services/trains';
import { searchHotels } from '@/services/hotels';

export const runtime = 'nodejs'; // FIXED: must be nodejs, not edge

export async function POST(req: NextRequest) {
  let body: { type?: string; params?: Record<string, unknown> };
  try { body = await req.json(); }
  catch { return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 }); }

  const { type, params = {} } = body;
  const p = params as Record<string, unknown>;

  try {
    if (type === 'flights') {
      if (!p.fromCity || !p.toCity || !p.date)
        return NextResponse.json({ ok: false, error: 'flights needs fromCity, toCity, date' }, { status: 400 });
      return NextResponse.json({ ok: true, data: await searchFlights(String(p.fromCity), String(p.toCity), String(p.date), Number(p.adults ?? 1)) });
    }
    if (type === 'trains') {
      if (!p.fromCity || !p.toCity || !p.date)
        return NextResponse.json({ ok: false, error: 'trains needs fromCity, toCity, date' }, { status: 400 });
      return NextResponse.json({ ok: true, data: await getTrainsBetweenStations(String(p.fromCity), String(p.toCity), String(p.date)) });
    }
    if (type === 'hotels') {
      if (!p.city || !p.checkIn || !p.checkOut)
        return NextResponse.json({ ok: false, error: 'hotels needs city, checkIn, checkOut' }, { status: 400 });
      return NextResponse.json({ ok: true, data: await searchHotels(String(p.city), String(p.checkIn), String(p.checkOut), Number(p.adults ?? 2), p.tier as 'basic' | 'better' | 'premium' | undefined) });
    }
    return NextResponse.json({ ok: false, error: `Unknown type: ${type}` }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[travel API] ${type}:`, msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
