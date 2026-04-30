import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Missing required env var: JWT_SECRET');
  }
  return secret;
}

function getJwtExpiry(): jwt.SignOptions['expiresIn'] {
  const expiry = process.env.JWT_EXPIRY;
  if (!expiry) return '30d';

  // `@types/jsonwebtoken` uses a stricter string type (from `ms`) for `expiresIn`.
  // We accept a string from env and let jsonwebtoken validate it at runtime.
  return expiry as unknown as jwt.SignOptions['expiresIn'];
}

export function signJWT(payload: object): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiry() });
}

export function verifyJWT(token: string): jwt.JwtPayload | string | null {
  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}
