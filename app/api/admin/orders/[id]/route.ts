import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { OrderStatusUpdateSchema } from "@/lib/validations/schemas";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const order = await Order.findById(id).populate("user", "name email phone");
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const validation = OrderStatusUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { orderStatus, paymentStatus } = validation.data;
    const { returnStatus } = body;

    await connectDB();

    const orderDoc = await Order.findById(id);
    if (!orderDoc) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (orderStatus) orderDoc.orderStatus = orderStatus;
    if (paymentStatus) orderDoc.paymentStatus = paymentStatus;

    if (returnStatus && orderDoc.returnDetails) {
      orderDoc.returnDetails.status = returnStatus;
      orderDoc.returnDetails.processedAt = new Date();

      if (returnStatus === "approved") {
        orderDoc.orderStatus = "returned";
        orderDoc.paymentStatus = "refunded";
      }
    }

    await orderDoc.save();
    await orderDoc.populate("user", "name email phone");

    return NextResponse.json({ success: true, order: orderDoc });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
