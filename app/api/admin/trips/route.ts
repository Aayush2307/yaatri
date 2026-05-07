import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);

    let page = parseInt(searchParams.get('page') || '1', 10);
    let limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = (searchParams.get('search') || '').trim();

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;

    const skip = (page - 1) * limit;

    const where: any = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { circuitName: { contains: search, mode: 'insensitive' } },
            { intentionLabel: { contains: search, mode: 'insensitive' } },
            { departureFrom: { contains: search, mode: 'insensitive' } },
            { departureTo: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          userId: true,
          name: true,
          status: true,
          circuitName: true,
          intentionLabel: true,
          departureFrom: true,
          departureTo: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.trip.count({ where }),
    ]);

    return NextResponse.json({
      data: trips,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}