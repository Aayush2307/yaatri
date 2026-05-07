import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";

export async function requireAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  const payload = verifyJWT(token);

  if (!payload || typeof payload === "string") {
    throw new Error("Unauthorized");
  }

  const userId = payload.userId; // IMPORTANT: must exist in JWT

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== "ADMIN" || !user.isActive) {
    throw new Error("Unauthorized");
  }

  return user;
}