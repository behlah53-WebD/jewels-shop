import nodemailer from "nodemailer";
import { generateInvoiceHTML, generateEmailBodyHTML } from "./invoiceGenerator";
import { Order } from "@/lib/models/Order";
import { connectDB } from "@/lib/db/connect";

export async function sendInvoiceEmail(order: any): Promise<boolean> {
  try {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || `"Aurelia Fine Jewellery" <${smtpUser || "noreply@aureliajewels.com"}>`;

    // Check if valid credentials exist
    if (!smtpUser || !smtpPass || smtpUser.includes("your-email") || smtpPass.includes("your-app-password")) {
      console.log("ℹ [Invoice Email] SMTP credentials not set or using placeholders. Email skipped for order:", order._id);
      return false;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const invoiceNum = order.invoice?.invoiceNumber || `AUR-INV-${order._id.toString().substring(0, 8).toUpperCase()}`;
    const recipientEmail = order.shippingAddress?.email || order.invoice?.customerEmail;

    if (!recipientEmail) {
      console.warn("⚠️ [Invoice Email] No recipient email found for order:", order._id);
      return false;
    }

    // 1. Email Body formatted specifically for Gmail & Mail clients
    const emailBody = generateEmailBodyHTML(order);

    // 2. Original Printable/PDF Invoice Document attached to the email
    const invoiceDocument = generateInvoiceHTML(order, true);

    const mailOptions = {
      from: smtpFrom,
      to: recipientEmail,
      subject: `Tax Invoice #${invoiceNum} - Aurelia Fine Jewellery Order Confirmation`,
      html: emailBody,
      attachments: [
        {
          filename: `Invoice_${invoiceNum}.html`,
          content: invoiceDocument,
          contentType: "text/html",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ [Invoice Email] Invoice email successfully sent with attachment to:", recipientEmail, "MessageID:", info.messageId);

    // Update email status in DB
    try {
      await connectDB();
      await Order.findByIdAndUpdate(order._id, {
        "invoice.emailStatus": "sent",
      });
    } catch (dbErr) {
      console.error("Error updating invoice emailStatus in DB:", dbErr);
    }

    return true;
  } catch (error: any) {
    console.error("❌ [Invoice Email Error]:", error?.message || error);

    try {
      await connectDB();
      await Order.findByIdAndUpdate(order._id, {
        "invoice.emailStatus": "failed",
      });
    } catch (dbErr) {
      console.error("Error updating invoice emailStatus in DB:", dbErr);
    }

    return false;
  }
}
