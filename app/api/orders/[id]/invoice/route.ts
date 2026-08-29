import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { generateInvoiceHTML } from "@/lib/invoice/invoiceGenerator";

export async function GET(
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
    await connectDB();
    const order = await Order.findById(id).populate("items.product", "name SKU images price");

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Check authorization: user must own order or be admin
    const isOwner = String(order.user) === String(user._id);
    const isAdmin = user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: You do not have permission to view this invoice" },
        { status: 403 }
      );
    }

    // If order was placed before invoice schema update, generate missing invoice fields on-the-fly
    if (!order.invoice || !order.invoice.invoiceNumber) {
      const invoiceNumber = `AUR-INV-${order._id.toString().substring(0, 8).toUpperCase()}`;
      const subtotal = order.subtotal || 0;
      const shippingCost = order.shippingCost || 0;
      const total = order.total || subtotal + shippingCost;
      const customerEmail = order.shippingAddress?.email || user.email;

      order.invoice = {
        invoiceNumber,
        invoiceDate: order.createdAt || new Date(),
        subtotal,
        shippingCost,
        taxAmount: Math.round(subtotal * 0.03),
        discountAmount: 0,
        total,
        customerEmail,
        emailStatus: "pending",
      };

      await order.save();
    }

    const { searchParams } = new URL(req.url);
    const isDownload = searchParams.get("download") === "true";

    const htmlContent = generateInvoiceHTML(order.toObject ? order.toObject() : order, isDownload);

    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Fetch Invoice Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
