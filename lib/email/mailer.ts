import nodemailer from "nodemailer";

export interface SmtpConfig {
  transporter: nodemailer.Transporter;
  smtpUser?: string;
  smtpPass?: string;
  smtpFrom: string;
  isConfigured: boolean;
}

export function getSmtpTransporter(): SmtpConfig {
  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const rawPort = process.env.SMTP_PORT?.trim();
  const rawSecure = process.env.SMTP_SECURE?.trim()?.toLowerCase();

  // Smart Port & SSL/TLS Resolution for Vercel / Cloud Serverless Environments
  let port = rawPort ? parseInt(rawPort, 10) : 465;
  let secure = true;

  if (rawSecure === "false") {
    secure = false;
    port = rawPort ? parseInt(rawPort, 10) : 587;
  } else if (rawSecure === "true") {
    secure = true;
    port = rawPort ? parseInt(rawPort, 10) : 465;
  } else {
    // If not explicitly set, auto-infer from port or host
    if (port === 587) {
      secure = false;
    } else {
      secure = true;
      port = 465;
    }
  }

  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpFrom =
    process.env.SMTP_FROM?.trim() ||
    `"Aurelia Fine Jewellery" <${smtpUser || "noreply@aureliajewels.com"}>`;

  const isConfigured = Boolean(
    smtpUser &&
      smtpPass &&
      !smtpUser.includes("your-email") &&
      !smtpPass.includes("your-app-password")
  );

  const transportOpts: any = {
    host: smtpHost,
    port: port,
    secure: secure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    // Vercel Serverless Function Socket Timeouts (prevents functions from hanging)
    connectionTimeout: 10000, // 10s TCP connection timeout
    greetingTimeout: 5000,    // 5s SMTP greeting timeout
    socketTimeout: 15000,      // 15s data socket timeout
    tls: {
      rejectUnauthorized: false,
    },
  };

  // If using Gmail, set service to "gmail" for optimal Vercel serverless routing when on port 465
  if (smtpHost.toLowerCase().includes("gmail.com") && secure) {
    transportOpts.service = "gmail";
  }

  const transporter = nodemailer.createTransport(transportOpts);

  return {
    transporter,
    smtpUser,
    smtpPass,
    smtpFrom,
    isConfigured,
  };
}
