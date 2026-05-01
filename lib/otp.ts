type OtpRecord = {
  otp: string;
  expiresAt: number;
};

// Temporary in-memory OTP store
// Later we can replace this with Redis/Upstash
const otpStore = new Map<string, OtpRecord>();

const OTP_EXPIRY_MINUTES = 5;

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOtp(phone: string, otp: string): void {
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

  otpStore.set(phone, {
    otp,
    expiresAt,
  });
}

export function verifyOtp(phone: string, otp: string): boolean {
  const record = otpStore.get(phone);

  if (!record) {
    return false;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return false;
  }

  if (record.otp !== otp) {
    return false;
  }

  otpStore.delete(phone);
  return true;
}