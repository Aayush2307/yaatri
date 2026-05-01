type SendOtpResult = {
  success: boolean;
  provider: "mock" | "twilio";
};

export async function sendOtpMessage(
  phone: string,
  otp: string
): Promise<SendOtpResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

  // Twilio is not configured yet, so use mock mode
  if (!accountSid || !authToken || !fromNumber) {
    console.log(`[MOCK OTP] Phone: ${phone}, OTP: ${otp}`);

    return {
      success: true,
      provider: "mock",
    };
  }

  // Later we will integrate real Twilio here
  console.log(`[TWILIO PLACEHOLDER] Phone: ${phone}, OTP: ${otp}`);

  return {
    success: true,
    provider: "twilio",
  };
}