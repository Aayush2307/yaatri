import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';
import { Prisma } from '@prisma/client';

import { logAdminAction } from '@/lib/logger';

// Select only required fields
const notificationSelect = {
  id: true,
  title: true,
  body: true,
  type: true,
  userId: true,
  createdAt: true,
};

// GET /api/admin/notifications
export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);

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
            { title: { contains: search, mode: 'insensitive' } },
            { body: { contains: search, mode: 'insensitive' } },
            { type: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: notificationSelect,
      }),
      prisma.notification.count({ where }),
    ]);

    return NextResponse.json({
      data: notifications,
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

// POST /api/admin/notifications
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);

    const body = await req.json();
    const { title, message, type, userIds } = body;

    
    if (
      !title || title.trim() === '' ||
      !message || message.trim() === '' ||
      !type || type.trim() === ''
    ) {
      return NextResponse.json(
        { error: 'Title, message and type are required' },
        { status: 400 }
      );
    }

    if (userIds && !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: 'userIds must be an array' },
        { status: 400 }
      );
    }

    let data: Prisma.NotificationCreateManyInput[] = [];

   
    if (Array.isArray(userIds) && userIds.length > 0) {
      data = userIds.map((userId: string) => ({
        title: title.trim(),
        body: message.trim(), 
        type: type.trim(),    
        userId,
      }));
    } else {
      
      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: { id: true },
      });

      data = users.map((user) => ({
        title: title.trim(),
        body: message.trim(), 
        type: type.trim(),    
        userId: user.id,
      }));
    }

   
    await prisma.notification.createMany({
      data,
    });

    // Log admin action after successful notification send
    await logAdminAction({
      adminId: admin.id,
      action: 'SEND_NOTIFICATION',
      entity: 'notification',
      metadata: { count: data.length, type, userIds: userIds ?? 'all' },
    });

    return NextResponse.json({
      message: 'Notifications sent successfully',
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