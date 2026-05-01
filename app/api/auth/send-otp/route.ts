import { NextRequest, NextResponse } from "next/server";
import { generateOtp, saveOtp } from "@/lib/otp";
import { sendOtpMessage } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone } = body;

    // validation
    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is required",
        },
        { status: 400 }
      );
    }

    // generate OTP
    const otp = generateOtp();

    // save OTP temporarily
    saveOtp(phone, otp);

    // send OTP (mock for now)
    const result = await sendOtpMessage(phone, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      provider: result.provider,
    });
  } catch (error) {
    console.error("Send OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send OTP",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to send OTP",
  });
}