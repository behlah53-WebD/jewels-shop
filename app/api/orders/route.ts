import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Order } from "@/lib/models/Order";
import { Product } from "@/lib/models/Product";
import { OrderCreateSchema } from "@/lib/validations/schemas";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const { user } = auth;

  try {
    const body = await req.json();
    const validation = OrderCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { items, shippingAddress } = validation.data;

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

        // Deduct stock
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

    const shippingCost = subtotal > 100000 ? 0 : 1500; // Free shipping over ₹1,00,000
    const total = subtotal + shippingCost;

    const order = await Order.create({
      user: user._id,
      items: validatedItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  const { user } = auth;

  try {
    await connectDB();
    const orders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name slug images price");

    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Fetch User Orders Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
