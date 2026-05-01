import { NextRequest, NextResponse } from "next/server";
import { extractToken, getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Token missing",
        },
        { status: 401 }
      );
    }

    const user = getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid token",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Validate token error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json({
    message: "Use GET method",
  });
}