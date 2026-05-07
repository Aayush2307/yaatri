import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export type AdminLogAction =
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'UPDATE_TRIP_STATUS'
  | 'DELETE_TRIP'
  | 'SEND_NOTIFICATION'
  | 'DELETE_NOTIFICATION';

export interface LogAdminActionParams {
  adminId: string;
  action: AdminLogAction;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAdminAction({
  adminId,
  action,
  entity,
  entityId,
  metadata,
}: LogAdminActionParams): Promise<void> {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        metadata: metadata ? (metadata as Prisma.JsonObject) : undefined,
      },
    });
  } catch (err) {
    // Never crash API if logging fails
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Admin log failed:', err);
    }
  }
}import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export type AdminLogAction =
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'UPDATE_TRIP_STATUS'
  | 'DELETE_TRIP'
  | 'SEND_NOTIFICATION'
  | 'DELETE_NOTIFICATION';

export interface LogAdminActionParams {
  adminId: string;
  action: AdminLogAction;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAdminAction({
  adminId,
  action,
  entity,
  entityId,
  metadata,
}: LogAdminActionParams): Promise<void> {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        metadata: metadata ? (metadata as Prisma.JsonObject) : undefined,
      },
    });
  } catch (err) {
    // Never crash API if logging fails
    // Optionally log to console in dev
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('Admin log failed:', err);
    }
  }
}
