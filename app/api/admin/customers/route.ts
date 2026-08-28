import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import { Order } from "@/lib/models/Order";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const customers = await User.find({ role: "buyer" }).sort({ createdAt: -1 });

    const customersWithOrders = await Promise.all(
      customers.map(async (c) => {
        const orderCount = await Order.countDocuments({ user: c._id });
        return {
          id: c._id.toString(),
          name: c.name,
          email: c.email,
          phone: c.phone || "N/A",
          addressesCount: c.addresses.length,
          orderCount,
          createdAt: c.createdAt,
        };
      })
    );

    return NextResponse.json({ success: true, customers: customersWithOrders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
