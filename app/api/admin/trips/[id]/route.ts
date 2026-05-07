import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

import { logAdminAction } from '@/lib/logger';

// PATCH /api/admin/trips/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid trip id' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status } = body;

    if (!status || typeof status !== 'string') {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const allowedStatus = ['PENDING', 'CONFIRMED', 'CANCELLED'];
    if (!allowedStatus.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        userId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log admin action after successful status update
    await logAdminAction({
      adminId: admin.id,
      action: 'UPDATE_TRIP_STATUS',
      entity: 'trip',
      entityId: id,
      metadata: { status },
    });

    return NextResponse.json({ data: trip });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    if (err.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/trips/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid trip id' },
        { status: 400 }
      );
    }

    await prisma.trip.delete({
      where: { id },
    });

    // Log admin action after successful trip delete
    await logAdminAction({
      adminId: admin.id,
      action: 'DELETE_TRIP',
      entity: 'trip',
      entityId: id,
      metadata: {},
    });

    return NextResponse.json({
      message: 'Trip deleted successfully',
    });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }

    if (err.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}