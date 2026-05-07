import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

import { logAdminAction } from '@/lib/logger';

// GET /api/admin/users/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid user id' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (err: any) {
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

// PATCH /api/admin/users/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid user id' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, role, isActive } = body;

    if (
      (!name || name.trim() === '') &&
      !role &&
      typeof isActive !== 'boolean'
    ) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    const data: any = {};

    if (name && name.trim() !== '') {
      data.name = name.trim();
    }

    if (role) {
      const allowedRoles = ['USER', 'ADMIN'];
      if (!allowedRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        );
      }
      data.role = role;
    }

    if (typeof isActive === 'boolean') {
      data.isActive = isActive;
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Log admin action after successful update
    await logAdminAction({
      adminId: admin.id,
      action: 'UPDATE_USER',
      entity: 'user',
      entityId: id,
      metadata: { updatedFields: Object.keys(data) },
    });

    return NextResponse.json({ data: user });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
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

// DELETE /api/admin/users/[id] (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid user id' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Log admin action after successful soft delete
    await logAdminAction({
      adminId: admin.id,
      action: 'DELETE_USER',
      entity: 'user',
      entityId: id,
      metadata: {},
    });

    return NextResponse.json({ data: user });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
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