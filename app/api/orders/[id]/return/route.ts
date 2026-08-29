import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const { user } = auth;
  const { id } = await params;

  try {
    const body = await req.json();
    const { reason, comments } = body;

    if (!reason || typeof reason !== "string" || reason.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Return reason is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify order ownership
    if (String(order.user) !== String(user._id) && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    // Verify eligibility
    if (order.orderStatus !== "delivered") {
      return NextResponse.json(
        {
          success: false,
          error: `Only delivered orders are eligible for return. Current status: ${order.orderStatus}`,
        },
        { status: 400 }
      );
    }

    order.orderStatus = "return_requested";
    order.returnDetails = {
      reason: reason.trim(),
      comments: (comments || "").trim(),
      status: "pending",
      requestedAt: new Date(),
    };

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Return request submitted successfully",
      order,
    });
  } catch (error: any) {
    console.error("Order Return Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process return request" },
      { status: 500 }
    );
  }
}
