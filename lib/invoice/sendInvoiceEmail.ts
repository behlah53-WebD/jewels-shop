import { generateInvoiceHTML, generateEmailBodyHTML } from "./invoiceGenerator";
import { Order } from "@/lib/models/Order";
import { connectDB } from "@/lib/db/connect";
import { sendMailWithFallback, getSmtpConfig } from "@/lib/email/mailer";

export async function sendInvoiceEmail(order: any): Promise<boolean> {
  try {
    const { isConfigured } = getSmtpConfig();

    // Check if valid credentials exist
    if (!isConfigured) {
      console.log("ℹ [Invoice Email] SMTP credentials not set or using placeholders. Email skipped for order:", order._id);
      return false;
    }

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

    const result = await sendMailWithFallback(mailOptions);

    if (!result.success) {
      throw new Error(result.error || "Invoice email sending failed");
    }

    console.log("✅ [Invoice Email] Invoice email successfully sent with attachment to:", recipientEmail, "MessageID:", result.messageId);

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
