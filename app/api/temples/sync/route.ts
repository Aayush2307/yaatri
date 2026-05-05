import { NextResponse, type NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { fetchTemplesByBbox } from '@/lib/overpass';

const DEFAULT_BBOX = process.env.TEMPLE_SYNC_DEFAULT_BBOX || '26.7,75.6,27.1,76.0';

function isAuthorized(request: NextRequest) {
  const token = process.env.TEMPLE_SYNC_TOKEN;
  if (!token) return true;
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return false;
  return header.replace('Bearer ', '').trim() === token;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as { bbox?: string };
  const bbox = payload.bbox || DEFAULT_BBOX;

  try {
    const temples = await fetchTemplesByBbox(bbox);

    let created = 0;
    let updated = 0;

    for (const temple of temples) {
      const upserted = await db.temple.upsert({
        where: {
          name_location_state: {
            name: temple.name,
            location: temple.location,
            state: temple.state,
          },
        },
        create: {
          name: temple.name,
          location: temple.location,
          state: temple.state,
          latitude: temple.latitude,
          longitude: temple.longitude,
        },
        update: {
          latitude: temple.latitude ?? undefined,
          longitude: temple.longitude ?? undefined,
        },
      });

      if (upserted) {
        created += 1;
      }
    }

    return NextResponse.json({ ok: true, bbox, created, updated, total: temples.length });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Temple sync failed.' }, { status: 502 });
  }
}
