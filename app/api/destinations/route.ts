import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { getSupabaseClient } from '@/lib/supabaseClient';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();

  try {
    const destinations = await db.temple.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { location: { contains: query, mode: 'insensitive' } },
              { state: { contains: query, mode: 'insensitive' } },
            ],
          }
        : undefined,
      take: 10,
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ ok: true, data: destinations });
  } catch (prismaError) {
    // Prisma's direct TCP connection may fail in IPv4-only environments (e.g. Vercel Lambda).
    // Fall back to Supabase REST API which uses HTTPS and is always IPv4-accessible.
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let sbQuery = supabase.from('Temple').select('*').order('name', { ascending: true }).limit(10);
        if (query) {
          sbQuery = sbQuery.or(`name.ilike.%${query}%,location.ilike.%${query}%,state.ilike.%${query}%`);
        }
        const { data, error } = await sbQuery;
        if (!error) {
          return NextResponse.json({ ok: true, data: data ?? [] });
        }
      } catch {
        // fall through to error response
      }
    }
    console.error('[destinations] DB error:', prismaError);
    return NextResponse.json({ ok: false, error: 'Service temporarily unavailable.' }, { status: 503 });
  }
}

export async function POST() {
  return NextResponse.json({ ok: false, error: 'Create destinations via /api/temples.' }, { status: 405 });
}
