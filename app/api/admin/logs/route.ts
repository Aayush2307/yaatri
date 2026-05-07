import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

// GET /api/admin/logs
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    let page = parseInt(searchParams.get('page') || '1', 10);
    let limit = parseInt(searchParams.get('limit') || '10', 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    if (limit > 50) limit = 50;
    const skip = (page - 1) * limit;

    // Filters
    const action = searchParams.get('action') || undefined;
    const entity = searchParams.get('entity') || undefined;
    const adminId = searchParams.get('adminId') || undefined;

    const where: any = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;
    if (adminId) where.adminId = adminId;

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          adminId: true,
          action: true,
          entity: true,
          entityId: true,
          metadata: true,
          createdAt: true,
        },
      }),
      prisma.adminLog.count({ where }),
    ]);

    return NextResponse.json({
      data: logs,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
