import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { signJWT } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { phone?: string; name?: string; otp?: string };
  if (!payload.phone || !payload.otp) {
    return NextResponse.json({ ok: false, error: 'Phone and OTP are required.' }, { status: 400 });
  }

  const phone = payload.phone.trim();
  const name = payload.name?.trim() || 'Yaatri User';

  let user = await db.user.findUnique({ where: { phone } });
  if (!user) {
    user = await db.user.create({
      data: {
        phone,
        name,
        intentionKey: 'general',
        intentionLabel: 'General',
        groupSize: 1,
        hasSenior: false,
        seniorMode: false,
        mobilityNeeds: ['none'],
        dietaryPrefs: ['no_preference'],
      },
    });
  }

  const token = signJWT({ userId: user.id, phone: user.phone });
  return NextResponse.json({ ok: true, token, user: { id: user.id, name: user.name, phone: user.phone } });
}
