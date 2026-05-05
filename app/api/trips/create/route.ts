import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  return NextResponse.json({ ok: true, message: 'Use POST to create a trip.' });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as {
    userId?: string;
    name?: string;
    intentionKey?: string;
    intentionLabel?: string;
    contextNote?: string;
    duration?: string;
    budget?: string;
    circuitId?: string;
    circuitName?: string;
    departureFrom?: string;
    departureTo?: string;
    muhuratTithi?: string;
    muhuratQuality?: string;
    pilgrims?: number;
    hasSenior?: boolean;
    mobilityNeeds?: string[];
    dietaryPrefs?: string[];
    specialNote?: string;
  };

  if (!payload.userId || !payload.name || !payload.duration || !payload.budget || !payload.circuitId || !payload.circuitName) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 400 });
  }

  const trip = await db.trip.create({
    data: {
      userId: payload.userId,
      name: payload.name,
      intentionKey: payload.intentionKey || 'general',
      intentionLabel: payload.intentionLabel || 'General',
      contextNote: payload.contextNote,
      duration: payload.duration,
      budget: payload.budget,
      circuitId: payload.circuitId,
      circuitName: payload.circuitName,
      departureFrom: payload.departureFrom,
      departureTo: payload.departureTo,
      muhuratTithi: payload.muhuratTithi,
      muhuratQuality: payload.muhuratQuality,
      pilgrims: payload.pilgrims ?? 1,
      hasSenior: payload.hasSenior ?? false,
      mobilityNeeds: payload.mobilityNeeds ?? ['none'],
      dietaryPrefs: payload.dietaryPrefs ?? ['no_preference'],
      specialNote: payload.specialNote,
    },
  });

  return NextResponse.json({ ok: true, data: trip });
}
