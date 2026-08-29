import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order items are required" },
        { status: 400 }
      );
    }

    await connectDB();

    let subtotal = 0;
    for (const item of items) {
      if (item.product) {
        const productDoc = await Product.findById(item.product);
        if (productDoc) {
          if (productDoc.stock < item.quantity) {
            return NextResponse.json(
              {
                success: false,
                error: `Insufficient stock for "${productDoc.name}". Available: ${productDoc.stock}`,
              },
              { status: 400 }
            );
          }
        }
      }
      subtotal += (item.price || 0) * (item.quantity || 1);
    }

    const shippingCost = subtotal > 100000 ? 0 : 1500;
    const totalAmount = subtotal + shippingCost;
    const amountInPaise = Math.round(totalAmount * 100);

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyIdHere";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "YourKeySecretHere";

    let razorpayOrderId = `order_test_${Date.now()}`;

    // If key is configured (not default placeholder), initialize Razorpay SDK
    if (keyId && keySecret && !keyId.includes("YourKeyIdHere")) {
      try {
        const instance = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const rzpOrder = await instance.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
          notes: {
            userId: String(auth.user._id),
          },
        });
        razorpayOrderId = rzpOrder.id;
      } catch (err: any) {
        console.warn("Razorpay API call warning (falling back to test order ID for simulation):", err?.message || err);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      key: keyId,
    });
  } catch (error: any) {
    console.error("Create Razorpay Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
