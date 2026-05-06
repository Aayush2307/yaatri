import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Temporary debug endpoint — remove before final deploy
export async function GET() {
  try {
    const count = await db.temple.count();
    return NextResponse.json({ ok: true, count, db_url_prefix: process.env.DATABASE_URL?.substring(0, 40) + '...' });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
