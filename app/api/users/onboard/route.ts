import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { signJWT } from '@/lib/jwt';

type OnboardBody = {
  name?: string;
  phone?: string;
  language?: string;
  intentionKey?: string;
  intentionLabel?: string;
  groupSize?: number;
  hasSenior?: boolean;
  seniorMode?: boolean;
  mobilityNeeds?: string[];
  dietaryPrefs?: string[];
  deviceToken?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body: OnboardBody = await req.json();

    const name = body.name?.trim();
    const phone = body.phone?.trim();
    const language = body.language || 'en';
    const intentionKey = body.intentionKey?.trim();
    const intentionLabel = body.intentionLabel?.trim();

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, message: 'Phone is required' },
        { status: 400 }
      );
    }

    if (!intentionKey || !intentionLabel) {
      return NextResponse.json(
        { success: false, message: 'Intention is required' },
        { status: 400 }
      );
    }

    const user = await db.user.upsert({
      where: { phone },
      update: {
        name,
        language,
        intentionKey,
        intentionLabel,
        groupSize: body.groupSize ?? 1,
        hasSenior: body.hasSenior ?? false,
        seniorMode: body.seniorMode ?? body.hasSenior ?? false,
        mobilityNeeds: body.mobilityNeeds?.length ? body.mobilityNeeds : ['none'],
        dietaryPrefs: body.dietaryPrefs?.length ? body.dietaryPrefs : ['no_preference'],
        deviceToken: body.deviceToken,
      },
      create: {
        name,
        phone,
        language,
        intentionKey,
        intentionLabel,
        groupSize: body.groupSize ?? 1,
        hasSenior: body.hasSenior ?? false,
        seniorMode: body.seniorMode ?? body.hasSenior ?? false,
        mobilityNeeds: body.mobilityNeeds?.length ? body.mobilityNeeds : ['none'],
        dietaryPrefs: body.dietaryPrefs?.length ? body.dietaryPrefs : ['no_preference'],
        deviceToken: body.deviceToken,
      },
    });

    const token = signJWT({
      userId: user.id,
      phone: user.phone,
    });

   const responseUser = {
  id: user.id,
  name: user.name,
  phone: user.phone,
  language: user.language,
};

return NextResponse.json(
  {
    success: true,
    message: 'User onboarded successfully',
    user: responseUser,
    token,
  },
  { status: 201 }
);
  } catch (error) {
    console.error('USER_ONBOARDING_ERROR', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while onboarding user',
      },
      { status: 500 }
    );
  }
}