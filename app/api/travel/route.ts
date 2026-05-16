// Server-side proxy for all travel data APIs — keeps RAPIDAPI_KEY out of the browser.
import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/services/flights';
import { getTrainsBetweenStations } from '@/services/trains';
import { searchHotels } from '@/services/hotels';

type FlightParams = {
  fromCity: string;
  toCity: string;
  date: string;
  adults?: number;
};

type TrainParams = {
  fromCity: string;
  toCity: string;
  date: string;
};

type HotelParams = {
  city: string;
  checkIn: string;
  checkOut: string;
  adults?: number;
  tier?: 'basic' | 'better' | 'premium';
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as
    | { type: 'flights'; params: FlightParams }
    | { type: 'trains'; params: TrainParams }
    | { type: 'hotels'; params: HotelParams }
    | { type: string; params: Record<string, unknown> };

  const { type, params } = body;

  try {
    if (type === 'flights') {
      const p = params as FlightParams;
      const data = await searchFlights(p.fromCity, p.toCity, p.date, p.adults ?? 1);
      return NextResponse.json({ ok: true, data });
    }

    if (type === 'trains') {
      const p = params as TrainParams;
      const data = await getTrainsBetweenStations(p.fromCity, p.toCity, p.date);
      return NextResponse.json({ ok: true, data });
    }

    if (type === 'hotels') {
      const p = params as HotelParams;
      const data = await searchHotels(p.city, p.checkIn, p.checkOut, p.adults ?? 2, p.tier);
      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json({ ok: false, error: 'Unknown type' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[travel API] ${type} error:`, message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
