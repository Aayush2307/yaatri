import { NextRequest, NextResponse } from 'next/server';
import { signJWT } from '@/lib/jwt';
import { db } from '@/lib/db';

// Dev-only endpoint — not available in production.
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'not_available' }, { status: 404 });
  }

  const { phone } = await req.json();
  const user = await db.user.findUnique({ where: { phone } });
  if (!user) {
    return NextResponse.json({ error: 'user_not_found' }, { status: 404 });
  }

  const token = signJWT({ id: user.id });
  return NextResponse.json({ token, user });
}
