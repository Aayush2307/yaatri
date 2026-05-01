import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";
import { signJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone and OTP are required",
        },
        { status: 400 }
      );
    }

    const isValidOtp = verifyOtp(phone, otp);

    if (!isValidOtp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired OTP",
        },
        { status: 401 }
      );
    }

    const token = signJWT({ phone });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify OTP",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to verify OTP",
  });
}