import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { User } from "@/lib/models/User";
import { Category } from "@/lib/models/Category";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  try {
    await connectDB();

    const [totalOrders, totalProducts, totalCustomers, lowStockProducts, recentOrders, categories] =
      await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({ role: "buyer" }),
        Product.find({ stock: { $lte: 5 } }).select("name SKU stock price images featuredImage"),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(6)
          .populate("user", "name email"),
        Category.find().select("name slug"),
      ]);

    // Calculate total revenue from non-cancelled orders
    const salesResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);

    const totalRevenue = salesResult[0]?.totalRevenue || 0;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Status breakdown
    const statusCounts = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);
    const statusMap: Record<string, number> = {
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    statusCounts.forEach((s) => {
      if (s._id) statusMap[s._id] = s.count;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCustomers,
        avgOrderValue,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
        statusMap,
        categoriesCount: categories.length,
      },
    });
  } catch (error: any) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
