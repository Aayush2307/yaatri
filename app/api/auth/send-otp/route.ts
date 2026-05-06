import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as { phone?: string };
  if (!payload.phone) {
    return NextResponse.json({ ok: false, error: 'Phone is required.' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: 'OTP sent (mock).' });
}