import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const querySchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

function toTripListDTO(trip) {
  return {
    tripId: trip.id,
    name: trip.name,
    intentionLabel: trip.intentionLabel,
    circuitName: trip.circuitName,
    departureFrom: trip.departureFrom,
    departureTo: trip.departureTo,
    pilgrims: trip.pilgrims,
    status: trip.status,
    planningProgressPct: trip.planningProgressPct,
    createdAt: trip.createdAt,
  };
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const parsed = querySchema.safeParse({ userId });
  if (!parsed.success) {
    return NextResponse.json({
      success: false,
      message: 'userId is required',
      errors: parsed.error.flatten().fieldErrors,
    }, { status: 400 });
  }
  try {
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const trips = await db.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({
      success: true,
      message: 'Trips fetched',
      data: trips.map(toTripListDTO),
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch trips' }, { status: 500 });
  }
}