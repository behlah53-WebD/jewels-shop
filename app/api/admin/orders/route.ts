import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get("status");

  try {
    await connectDB();
    const query: any = {};
    if (statusParam) {
      query.orderStatus = statusParam;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "name email phone");

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
