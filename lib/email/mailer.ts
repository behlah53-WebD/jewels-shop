import nodemailer from "nodemailer";

export interface SmtpConfig {
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom: string;
  isConfigured: boolean;
}

export function getSmtpConfig(): SmtpConfig {
  const smtpUser = process.env.SMTP_USER?.trim();
  // Strip all spaces from Gmail App Password if user copy-pasted with spaces
  const smtpPass = process.env.SMTP_PASS?.trim()?.replace(/\s+/g, "");
  const smtpFrom =
    process.env.SMTP_FROM?.trim() ||
    `"Aurelia Fine Jewellery" <${smtpUser || "noreply@aureliajewels.com"}>`;

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
 * Serverless-optimized mail delivery with automatic fallback:
 * Strategy 1: Direct SSL/TLS on port 465 (Allowed through Vercel/AWS Lambda firewalls)
 * Strategy 2: Standard TLS/STARTTLS fallback
 */
export async function sendMailWithFallback(
  mailOptions: nodemailer.SendMailOptions
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const config = getSmtpConfig();

  if (!config.isConfigured || !config.smtpUser || !config.smtpPass) {
    console.log("ℹ [SMTP Mailer] SMTP credentials not set or using placeholders. Skipping email dispatch.");
    return { success: true, messageId: "simulated_id" };
  }

  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const rawPort = process.env.SMTP_PORT?.trim();
  const customPort = rawPort ? parseInt(rawPort, 10) : undefined;
  const isGmail = smtpHost.toLowerCase().includes("gmail.com");

  // Options for Strategy 1: Direct SSL on port 465 (Vercel Serverless Recommended)
  const strategy1Options: any = {
    host: smtpHost,
    port: customPort || 465,
    secure: true,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    connectionTimeout: 8000, // 8s connection timeout
    greetingTimeout: 4000,   // 4s greeting timeout
    socketTimeout: 12000,    // 12s socket timeout
    tls: {
      rejectUnauthorized: false,
    },
  };

  try {
    const transporter1 = nodemailer.createTransport(strategy1Options);
    const info = await transporter1.sendMail({
      from: config.smtpFrom,
      ...mailOptions,
    });
    console.log("✅ [SMTP Mailer] Email sent successfully via SSL (port 465) to:", mailOptions.to);
    return { success: true, messageId: info.messageId };
  } catch (primaryError: any) {
    console.warn("⚠️ [SMTP Mailer] Primary SSL port 465 delivery attempt failed:", primaryError?.message || primaryError);

    // Strategy 2: Fallback to Service / STARTTLS
    const strategy2Options: any = {
      service: isGmail ? "gmail" : undefined,
      host: !isGmail ? smtpHost : undefined,
      port: 587,
      secure: false,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 4000,
      socketTimeout: 12000,
      tls: {
        rejectUnauthorized: false,
      },
    };

    try {
      const transporter2 = nodemailer.createTransport(strategy2Options);
      const info = await transporter2.sendMail({
        from: config.smtpFrom,
        ...mailOptions,
      });
      console.log("✅ [SMTP Mailer] Email sent successfully via Fallback transport to:", mailOptions.to);
      return { success: true, messageId: info.messageId };
    } catch (fallbackError: any) {
      console.error("❌ [SMTP Mailer Error] All SMTP delivery attempts failed for recipient:", mailOptions.to, "Error:", fallbackError?.message || fallbackError);
      return {
        success: false,
        error: fallbackError?.message || primaryError?.message || "Failed to deliver email through SMTP",
      };
    }
  }
}

// Backward compatibility helper
export function getSmtpTransporter() {
  const config = getSmtpConfig();
  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const rawPort = process.env.SMTP_PORT?.trim();
  const port = rawPort ? parseInt(rawPort, 10) : 465;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: port,
    secure: port === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 15000,
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
