import jwt from 'jsonwebtoken';

export function signJWT(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '30d' });
}

export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}
