import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin';

import { logAdminAction } from '@/lib/logger';

// DELETE /api/admin/notifications/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    const { id } = params;
    await prisma.notification.delete({ where: { id } });
    // Log admin action after successful notification delete
    await logAdminAction({
      adminId: admin.id,
      action: 'DELETE_NOTIFICATION',
      entity: 'notification',
      entityId: id,
      metadata: {},
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }
    if (err.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
