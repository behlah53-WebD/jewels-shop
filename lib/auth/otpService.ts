import { connectDB } from "@/lib/db/connect";
import { Otp } from "@/lib/models/Otp";
import { User } from "@/lib/models/User";
import { getSmtpTransporter } from "@/lib/email/mailer";

export function generate6DigitOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtpEmail(email: string, otp: string, purpose: "registration" | "forgot_password"): Promise<boolean> {
  try {
    const { transporter, smtpFrom, isConfigured } = getSmtpTransporter();

    // Logging for development fallback when SMTP credentials are placeholders
    if (!isConfigured) {
      console.log(`ℹ [OTP Service] SMTP credentials not configured or using placeholders. Simulated OTP dispatch for ${email} (${purpose})`);
      return true;
    }

    const isReg = purpose === "registration";
    const title = isReg ? "Verify Your Patron Account" : "Reset Your Aurelia Account Password";
    const subtitle = isReg
      ? "Thank you for joining Aurelia. Please use the verification code below to complete your registration."
      : "We received a request to reset your password. Use the security code below to proceed.";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Playfair Display', Georgia, serif; background-color: #f7f3eb; margin: 0; padding: 40px 10px; color: #143025; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2d7c5; border-radius: 8px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background: #0d251d; padding: 32px 20px; text-align: center; border-bottom: 2px solid #d5ad67; }
        .logo { font-size: 22px; font-weight: 700; color: #fbf7ee; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; }
        .tagline { color: #d5ad67; font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 6px; }
        .content { padding: 36px 32px; text-align: center; }
        .title { font-size: 22px; font-weight: 500; color: #0d251d; margin-top: 0; margin-bottom: 12px; }
        .subtitle { font-family: sans-serif; font-size: 13px; color: #5a6e63; line-height: 1.6; margin-bottom: 28px; }
        .otp-box { background: #fbf7ee; border: 1px dashed #d5ad67; border-radius: 8px; padding: 20px; margin: 24px 0; display: inline-block; width: 80%; }
        .otp-code { font-family: 'Courier New', monospace; font-size: 36px; font-weight: 700; color: #0d251d; letter-spacing: 12px; margin: 0; }
        .expiry-note { font-family: sans-serif; font-size: 11px; color: #8c734b; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 10px; }
        .footer { background: #faf8f5; padding: 20px; text-align: center; border-top: 1px solid #eee6d8; font-family: sans-serif; font-size: 11px; color: #88998f; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="logo">Aurelia</div>
          <div class="tagline">Contemporary Heirlooms</div>
        </div>
        <div class="content">
          <h2 class="title">${title}</h2>
          <p class="subtitle">${subtitle}</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p class="expiry-note">✦ Code valid for 10 minutes &middot; Do not share ✦</p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Aurelia Fine Jewellery. All rights reserved.<br>
          If you did not request this code, please ignore this email.
        </div>
      </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: smtpFrom,
      to: email,
      subject: isReg ? "Your Aurelia Verification Code" : "Your Password Reset Code — Aurelia",
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    return false;
  }
}

export async function requestOtp(email: string, purpose: "registration" | "forgot_password"): Promise<{ success: boolean; error?: string }> {
  await connectDB();
  const cleanEmail = email.trim().toLowerCase();

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  // Check user existence constraint based on purpose
  const existingUser = await User.findOne({ email: cleanEmail }).lean();

  if (purpose === "registration" && existingUser) {
    return { success: false, error: "An account with this email address already exists. Please sign in instead." };
  }

  if (purpose === "forgot_password" && !existingUser) {
    return { success: false, error: "No account found associated with this email address." };
  }

  // Check resend rate limit (must wait 60s between sends)
  const existingOtp = await Otp.findOne({ email: cleanEmail, purpose });
  if (existingOtp) {
    const elapsedSeconds = (Date.now() - new Date(existingOtp.updatedAt).getTime()) / 1000;
    if (elapsedSeconds < 60) {
      const waitTime = Math.ceil(60 - elapsedSeconds);
      return { success: false, error: `Please wait ${waitTime} seconds before requesting a new code.` };
    }
  }

  const otpCode = generate6DigitOtp();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await Otp.findOneAndUpdate(
    { email: cleanEmail, purpose },
    { otp: otpCode, attempts: 0, expiresAt },
    { upsert: true, new: true }
  );

  const sent = await sendOtpEmail(cleanEmail, otpCode, purpose);

  if (!sent) {
    return { success: false, error: "Failed to dispatch verification email. Please try again." };
  }

  return { success: true };
}

export async function verifyOtp(email: string, otp: string, purpose: "registration" | "forgot_password"): Promise<{ success: boolean; error?: string }> {
  await connectDB();
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  if (!cleanOtp || cleanOtp.length !== 6) {
    return { success: false, error: "Please enter the complete 6-digit verification code." };
  }

  const otpDoc = await Otp.findOne({ email: cleanEmail, purpose });

  if (!otpDoc) {
    return { success: false, error: "Verification code expired or not found. Please request a new code." };
  }

  if (new Date() > new Date(otpDoc.expiresAt)) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return { success: false, error: "Verification code has expired. Please request a new code." };
  }

  if (otpDoc.attempts >= 5) {
    await Otp.deleteOne({ _id: otpDoc._id });
    return { success: false, error: "Maximum verification attempts exceeded. Please request a new code." };
  }

  if (otpDoc.otp !== cleanOtp) {
    otpDoc.attempts += 1;
    await otpDoc.save();
    const remaining = 5 - otpDoc.attempts;
    return { success: false, error: `Incorrect verification code. ${remaining} attempts remaining.` };
  }

  return { success: true };
}
