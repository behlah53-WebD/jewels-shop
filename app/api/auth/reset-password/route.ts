import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { Otp } from "@/lib/models/Otp";
import { verifyOtp } from "@/lib/auth/otpService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, verification code, and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Verify OTP
    const otpResult = await verifyOtp(email, otp, "forgot_password");
    if (!otpResult.success) {
      return NextResponse.json(
        { success: false, error: otpResult.error },
        { status: 400 }
      );
    }

    await connectDB();
    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Account not found." },
        { status: 404 }
      );
    }

    // Hash password and save
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.passwordHash = hashedPassword;
    await user.save();

    // Delete consumed OTP
    await Otp.deleteOne({ email: cleanEmail, purpose: "forgot_password" });

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully. You may now sign in.",
    });
  } catch (error: any) {
    console.error("Reset Password Endpoint Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}
