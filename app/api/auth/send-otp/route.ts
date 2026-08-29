import { NextRequest, NextResponse } from "next/server";
import { requestOtp } from "@/lib/auth/otpService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, purpose } = body;

    if (!email || !purpose) {
      return NextResponse.json(
        { success: false, error: "Email and purpose are required." },
        { status: 400 }
      );
    }

    if (purpose !== "registration" && purpose !== "forgot_password") {
      return NextResponse.json(
        { success: false, error: "Invalid purpose parameter." },
        { status: 400 }
      );
    }

    const result = await requestOtp(email, purpose);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${email}`,
    });
  } catch (error: any) {
    console.error("Send OTP Endpoint Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send verification code." },
      { status: 500 }
    );
  }
}
