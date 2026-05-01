import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

// Allowed fields for PATCH
const updateTripSchema = z.object({
  name: z.string().optional(),
  contextNote: z.string().optional(),
  duration: z.string().optional(),
  budget: z.string().optional(),
  departureFrom: z.string().optional(),
  departureTo: z.string().optional(),
  muhuratTithi: z.string().optional(),
  muhuratQuality: z.string().optional(),
  pilgrims: z.number().int().positive().optional(),
  hasSenior: z.boolean().optional(),
  mobilityNeeds: z.array(z.string()).optional(),
  dietaryPrefs: z.array(z.string()).optional(),
  specialNote: z.string().optional(),
  status: z.string().optional(),
  planningProgressPct: z.number().int().min(0).max(100).optional(),
});

function toTripDTO(trip) {
  return {
    tripId: trip.id,
    userId: trip.userId,
    name: trip.name,
    intentionKey: trip.intentionKey,
    intentionLabel: trip.intentionLabel,
    contextNote: trip.contextNote,
    duration: trip.duration,
    budget: trip.budget,
    circuitId: trip.circuitId,
    circuitName: trip.circuitName,
    departureFrom: trip.departureFrom,
    departureTo: trip.departureTo,
    muhuratTithi: trip.muhuratTithi,
    muhuratQuality: trip.muhuratQuality,
    pilgrims: trip.pilgrims,
    hasSenior: trip.hasSenior,
    mobilityNeeds: trip.mobilityNeeds,
    dietaryPrefs: trip.dietaryPrefs,
    specialNote: trip.specialNote,
    status: trip.status,
    planningProgressPct: trip.planningProgressPct,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
    documents: trip.documents?.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      status: d.status,
      fileUrl: d.fileUrl,
      createdAt: d.createdAt,
    })) || [],
    reminders: trip.reminders?.map((r) => ({
      id: r.id,
      message: r.message,
      scheduledAt: r.scheduledAt,
      sent: r.sent,
      createdAt: r.createdAt,
    })) || [],
  };
}

export async function GET(req, { params }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Trip id is required' }, { status: 400 });
  }
  try {
    const trip = await db.trip.findUnique({
      where: { id },
      include: { documents: true, reminders: true },
    });
    if (!trip) {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Trip fetched', data: toTripDTO(trip) });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch trip' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'Trip id is required' }, { status: 400 });
  }
  try {
    const body = await req.json();
    const parsed = updateTripSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid data',
        errors: parsed.error.flatten().fieldErrors,
      }, { status: 400 });
    }
    // Do not allow updating id or userId
    if ('id' in body || 'userId' in body) {
      return NextResponse.json({ success: false, message: 'Cannot update id or userId' }, { status: 400 });
    }
    const trip = await db.trip.update({
      where: { id },
      data: parsed.data,
      include: { documents: true, reminders: true },
    });
    return NextResponse.json({ success: true, message: 'Trip updated', data: toTripDTO(trip) });
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, message: 'Trip not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to update trip' }, { status: 500 });
  }
}
