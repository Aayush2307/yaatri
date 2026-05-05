import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export type AuthResult = {
  ok: true;
  userId: string;
} | {
  ok: false;
  error: string;
};

export function requireAuth(request: NextRequest): AuthResult {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return { ok: false, error: 'Missing Authorization header.' };
  }

  const token = header.replace('Bearer ', '').trim();
  const payload = verifyJWT(token);
  if (!payload || typeof payload === 'string') {
    return { ok: false, error: 'Invalid or expired token.' };
  }

  const userId = payload.userId as string | undefined;
  if (!userId) {
    return { ok: false, error: 'Token missing userId.' };
  }

  return { ok: true, userId };
}
