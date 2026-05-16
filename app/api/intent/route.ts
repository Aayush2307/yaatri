// Server-side wrapper for extractTravelIntent — keeps GROQ_API_KEY server-only.
import { NextRequest, NextResponse } from 'next/server';
import { extractTravelIntent } from '@/services/groq';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { message?: string };
  const message = body?.message?.trim();
  if (!message) {
    return NextResponse.json({ isPlanningIntent: false, destination: null, fromCity: null, travelMonth: null, peopleCount: null });
  }
  const intent = await extractTravelIntent(message);
  return NextResponse.json(intent);
}
