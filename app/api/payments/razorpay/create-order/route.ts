import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import Razorpay from "razorpay";

import mongoose from "mongoose";

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
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
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
      const price = typeof item.price === "number" ? item.price : parseFloat(String(item.price || 0)) || 0;
      const qty = typeof item.quantity === "number" ? item.quantity : parseInt(String(item.quantity || 1), 10) || 1;
      subtotal += price * qty;
    }

    const shippingCost = subtotal > 100000 ? 0 : 1500;
    const totalAmount = Math.max(subtotal + shippingCost, 1);
    const amountInPaise = Math.round(totalAmount * 100);

    const keyId = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "").trim();
    const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    let razorpayOrderId = `order_test_${Date.now()}`;
    let isSimulated = true;

    // Initialize Razorpay if real valid keys are configured
    const isRealKey =
      keyId &&
      keySecret &&
      !keyId.includes("YourKeyId") &&
      !keySecret.includes("YourKeySecret") &&
      (keyId.startsWith("rzp_test_") || keyId.startsWith("rzp_live_"));

    if (isRealKey) {
      try {
        const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
              userId: String(auth.user._id),
            },
          }),
        });

        const rzpData = await rzpRes.json();
        if (rzpRes.ok && rzpData && rzpData.id) {
          razorpayOrderId = rzpData.id;
          isSimulated = false;
        } else {
          console.error("Razorpay Order API response error:", rzpData);
          isSimulated = true;
        }
      } catch (err: any) {
        console.error("Razorpay API call exception:", err?.message || err);
        isSimulated = true;
      }
    }

    return NextResponse.json({
      success: true,
      orderId: razorpayOrderId,
      amount: amountInPaise,
      currency: "INR",
      key: keyId,
      isSimulated,
    });
  } catch (error: any) {
    console.error("Create Razorpay Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create payment order" },
      { status: 500 }
    );
  }
}
