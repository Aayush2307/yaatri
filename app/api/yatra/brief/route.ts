import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import type { YatraBrief } from '@/types/yatra';

export async function POST(req: NextRequest) {
  try {
    const brief = (await req.json()) as YatraBrief;

    const { destination, fromCity, travelMonth, groupSize, budgetTier, specialNeeds, phone, itinerary } = brief;

    if (!destination || !fromCity || !travelMonth) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const saved = await db.yatraBrief.create({
      data: {
        destination,
        fromCity,
        travelMonth,
        groupSize: groupSize ?? 1,
        budgetTier: budgetTier ?? 'standard',
        specialNeeds: specialNeeds ?? [],
        phone: phone ?? null,
        itinerary: itinerary ? JSON.parse(JSON.stringify(itinerary)) : undefined,
        status: 'new',
      },
    });

    return NextResponse.json({ ok: true, id: saved.id });
  } catch (err) {
    console.error('[yatra/brief] Error:', err);
    return NextResponse.json({ error: 'Failed to save brief' }, { status: 500 });
  }
}
