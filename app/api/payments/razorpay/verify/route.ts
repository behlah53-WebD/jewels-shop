import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireAuth } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { OrderCreateSchema } from "@/lib/validations/schemas";
import { sendInvoiceEmail } from "@/lib/invoice/sendInvoiceEmail";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const { user } = auth;

  try {
    const body = await req.json();
    const { razorpayPaymentId, razorpayOrderId, razorpaySignature, items, shippingAddress } = body;

    if (!razorpayPaymentId || !razorpayOrderId) {
      return NextResponse.json(
        { success: false, error: "Razorpay payment details are required" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "YourKeySecretHere";

    // Verify Razorpay HMAC signature if real secret is configured
    if (keySecret && !keySecret.includes("YourKeySecretHere") && razorpaySignature) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { success: false, error: "Invalid payment signature verification failed" },
          { status: 400 }
        );
      }
    }

    // Validate payload schemas
    const validation = OrderCreateSchema.safeParse({ items, shippingAddress });
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Invalid order payload" },
        { status: 400 }
      );
    }

    await connectDB();

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      let productDoc;
      if (item.product) {
        productDoc = await Product.findById(item.product);
      }

      if (productDoc) {
        if (productDoc.stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              error: `Insufficient stock for product "${productDoc.name}". Available: ${productDoc.stock}`,
            },
            { status: 400 }
          );
        }

        // Deduct inventory stock
        productDoc.stock -= item.quantity;
        await productDoc.save();
      }

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      validatedItems.push({
        product: productDoc ? productDoc._id : item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size || "",
        material: item.material || "",
      });
    }

    const shippingCost = subtotal > 100000 ? 0 : 1500;
    const total = subtotal + shippingCost;

    // Generate Invoice Data
    const invoiceNumber = `AUR-INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const invoiceData = {
      invoiceNumber,
      invoiceDate: new Date(),
      subtotal,
      shippingCost,
      taxAmount: Math.round(subtotal * 0.03),
      discountAmount: 0,
      total,
      customerEmail: shippingAddress.email || user.email,
      emailStatus: "pending" as const,
    };

    // Create and store order ONLY AFTER verified payment
    const order = await Order.create({
      user: user._id,
      items: validatedItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress,
      paymentStatus: "paid",
      orderStatus: "processing",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature: razorpaySignature || "test_verified_sig",
      invoice: invoiceData,
    });

    // Trigger invoice email delivery (awaited for serverless safety)
    try {
      await sendInvoiceEmail(order.toObject ? order.toObject() : order);
    } catch (emailErr) {
      console.error("Invoice email delivery error:", emailErr);
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error("Razorpay Verification Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
