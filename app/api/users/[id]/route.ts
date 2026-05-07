import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/middleware';

const ALLOWED_ROLES = ['USER', 'ADMIN'];

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Protect route
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract and validate user ID
    const { id } = params;
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Fetch user
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (err: any) {
    console.error('Admin fetch user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Protect route
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Extract and validate user ID
    const { id } = params;
    if (!id || typeof id !== 'string' || id.trim() === '') {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    // Parse and validate body
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    const updateData: any = {};

    if ('name' in body) {
      if (typeof body.name !== 'string' || body.name.trim() === '') {
        return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
      }
      updateData.name = body.name.trim();
    }

    if ('role' in body) {
      if (!ALLOWED_ROLES.includes(body.role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
      updateData.role = body.role;
    }

    if ('isActive' in body) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json({ error: 'Invalid isActive value' }, { status: 400 });
      }
      updateData.isActive = body.isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Update user
    let user = null;
    try {
      user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        // Not found
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      throw err;
    }

    return NextResponse.json({ data: user });
  } catch (err: any) {
    console.error('Admin update user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
