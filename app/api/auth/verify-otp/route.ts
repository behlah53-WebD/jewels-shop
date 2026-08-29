import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/auth/otpService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, purpose } = body;

    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { success: false, error: "Email, OTP, and purpose are required." },
        { status: 400 }
      );
    }

    const result = await verifyOtp(email, otp, purpose);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "OTP code verified successfully.",
    });
  } catch (error: any) {
    console.error("Verify OTP Endpoint Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to verify OTP code." },
      { status: 500 }
    );
  }
}
