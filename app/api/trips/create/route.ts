import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';

const createTripSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  name: z.string().min(1, 'Trip name is required'),
  intentionKey: z.string().min(1, 'Intention key is required'),
  intentionLabel: z.string().min(1, 'Intention label is required'),
  contextNote: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  budget: z.string().min(1, 'Budget is required'),
  circuitId: z.string().min(1, 'Circuit ID is required'),
  circuitName: z.string().min(1, 'Circuit name is required'),
  departureFrom: z.string().optional(),
  departureTo: z.string().optional(),
  muhuratTithi: z.string().optional(),
  muhuratQuality: z.string().optional(),
  pilgrims: z.number().int().positive('Pilgrims must be at least 1'),
  hasSenior: z.boolean().default(false),
  mobilityNeeds: z.array(z.string()).default([]),
  dietaryPrefs: z.array(z.string()).default([]),
  specialNote: z.string().optional(),
});

function toCreateTripResponse(trip: any) {
  return {
    tripId: trip.id,
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
    documents: trip.documents.map((document: any) => ({
      id: document.id,
      name: document.name,
      type: document.type,
      status: document.status,
      fileUrl: document.fileUrl,
    })),
    reminders: trip.reminders.map((reminder: any) => ({
      id: reminder.id,
      message: reminder.message,
      scheduledAt: reminder.scheduledAt,
      sent: reminder.sent,
    })),
  };
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: 'Trip create API is running. Use POST to create a trip.',
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsedData = createTripSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid trip data',
          errors: parsedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parsedData.data;

    const user = await db.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + 1);

    const trip = await db.trip.create({
      data: {
        userId: data.userId,
        name: data.name,
        intentionKey: data.intentionKey,
        intentionLabel: data.intentionLabel,
        contextNote: data.contextNote,
        duration: data.duration,
        budget: data.budget,
        circuitId: data.circuitId,
        circuitName: data.circuitName,
        departureFrom: data.departureFrom,
        departureTo: data.departureTo,
        muhuratTithi: data.muhuratTithi,
        muhuratQuality: data.muhuratQuality,
        pilgrims: data.pilgrims,
        hasSenior: data.hasSenior,
        mobilityNeeds: data.mobilityNeeds,
        dietaryPrefs: data.dietaryPrefs,
        specialNote: data.specialNote,
        status: 'planning',
        planningProgressPct: 20,

        documents: {
          create: [
            {
              name: 'Government ID Proof',
              type: 'identity',
            },
            {
              name: 'Travel Tickets',
              type: 'travel',
            },
            {
              name: 'Stay Confirmation',
              type: 'stay',
            },
          ],
        },

        reminders: {
          create: [
            {
              message: 'Complete your yatra document checklist',
              scheduledAt: reminderDate,
            },
          ],
        },
      },
      include: {
        documents: true,
        reminders: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Trip created successfully',
        data: toCreateTripResponse(trip),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Trip creation failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while creating trip',
      },
      { status: 500 }
    );
  }
}