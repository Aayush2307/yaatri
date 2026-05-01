import { verifyJWT } from "./jwt";

export type AuthUser = {
  phone: string;
};

export function extractToken(authHeader: string | null): string | null {
  if (!authHeader) return null;

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
}

export function getUserFromToken(token: string): AuthUser | null {
  const payload = verifyJWT(token);

  if (!payload || typeof payload === "string") {
    return null;
  }

  if (!payload.phone) {
    return null;
  }

  return {
    phone: payload.phone as string,
  };
}