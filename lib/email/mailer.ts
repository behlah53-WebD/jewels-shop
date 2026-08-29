import nodemailer from "nodemailer";

export interface SmtpConfig {
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom: string;
  isConfigured: boolean;
}

export function getSmtpConfig(): SmtpConfig {
  const smtpUser = (
    process.env.SMTP_USER ||
    "behlah026@gmail.com"
  ).trim();

  // Strip all whitespace from App Password in case user copy-pasted with spaces
  const smtpPass = (
    process.env.SMTP_PASS ||
    "noqpmkzvienqvwev"
  ).trim().replace(/\s+/g, "");

  const smtpFrom =
    process.env.SMTP_FROM?.trim() ||
    `"Aurelia Fine Jewellery" <${smtpUser}>`;

  const isConfigured = Boolean(
    smtpUser &&
      smtpPass &&
      !smtpUser.includes("your-email") &&
      !smtpPass.includes("your-app-password")
  );

  return {
    smtpUser,
    smtpPass,
    smtpFrom,
    isConfigured,
  };
}

/**
 * Serverless-optimized mail delivery with 3-tier fallback for Vercel/Cloud functions:
 * Tier 1: Direct SSL/TLS on port 465 (Fastest & most reliable on AWS Lambda / Vercel)
 * Tier 2: Nodemailer well-known service ("gmail")
 * Tier 3: Port 587 STARTTLS
 */
export async function sendMailWithFallback(
  mailOptions: nodemailer.SendMailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();

  if (!config.isConfigured || !config.smtpUser || !config.smtpPass) {
    console.log("ℹ [SMTP Mailer] SMTP credentials not set or using placeholders. Simulated email dispatch to:", mailOptions.to);
    return { success: true, messageId: "simulated_id" };
  }

  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();

  // Strategy 1: Direct SSL on port 465 (Vercel Serverless standard)
  try {
    const transporter1 = nodemailer.createTransport({
      host: smtpHost,
      port: 465,
      secure: true,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 4000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter1.sendMail({
      from: config.smtpFrom,
      ...mailOptions,
    });
    console.log("✅ [SMTP Mailer] Email sent successfully via Port 465 SSL to:", mailOptions.to);
    return { success: true, messageId: info.messageId };
  } catch (err1: any) {
    console.warn("⚠️ [SMTP Mailer] Strategy 1 (Port 465 SSL) failed:", err1?.message || err1);
  }

  // Strategy 2: Nodemailer built-in "gmail" service
  try {
    const transporter2 = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 4000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter2.sendMail({
      from: config.smtpFrom,
      ...mailOptions,
    });
    console.log("✅ [SMTP Mailer] Email sent successfully via Gmail Service to:", mailOptions.to);
    return { success: true, messageId: info.messageId };
  } catch (err2: any) {
    console.warn("⚠️ [SMTP Mailer] Strategy 2 (Gmail Service) failed:", err2?.message || err2);
  }

  // Strategy 3: Port 587 STARTTLS
  try {
    const transporter3 = nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 4000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter3.sendMail({
      from: config.smtpFrom,
      ...mailOptions,
    });
    console.log("✅ [SMTP Mailer] Email sent successfully via Port 587 STARTTLS to:", mailOptions.to);
    return { success: true, messageId: info.messageId };
  } catch (err3: any) {
    console.error("❌ [SMTP Mailer Error] All 3 delivery strategies failed for recipient:", mailOptions.to, "Error:", err3?.message || err3);
    return {
      success: false,
      error: err3?.message || "Failed to deliver email through SMTP gateway",
    };
  }
}

// Backward compatibility helper
export function getSmtpTransporter() {
  const config = getSmtpConfig();
  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 465,
    secure: true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    connectionTimeout: 8000,
    greetingTimeout: 4000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false,
    },
  });

  return {
    transporter,
    smtpUser: config.smtpUser,
    smtpPass: config.smtpPass,
    smtpFrom: config.smtpFrom,
    isConfigured: config.isConfigured,
  };
}
