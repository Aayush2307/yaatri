import { NextResponse, type NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { token?: string };
  if (!payload.token) {
    return NextResponse.json({ ok: false, error: 'Token is required.' }, { status: 400 });
  }

  const decoded = verifyJWT(payload.token);
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ ok: false, error: 'Invalid token.' }, { status: 401 });
  }

  return NextResponse.json({ ok: true, data: decoded });
}
