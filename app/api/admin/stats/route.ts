import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalTrips,
      totalNotifications,
      recentUsers,
      recentTrips
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.trip.count(),
      prisma.notification.count(),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true, isActive: true, role: true },
      }),
      prisma.trip.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, userId: true, status: true, createdAt: true },
      })
    ]);
    return NextResponse.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalTrips,
      totalNotifications,
      recentUsers,
      recentTrips
    });
  } catch (err: any) {
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
