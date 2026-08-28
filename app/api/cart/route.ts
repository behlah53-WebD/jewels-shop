import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Cart } from "@/lib/models/Cart";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: true, cart: null, items: [] });
    }

    await connectDB();
    let userCart = await Cart.findOne({ user: user._id });

    if (!userCart) {
      userCart = await Cart.create({ user: user._id, items: [] });
    }

    return NextResponse.json({
      success: true,
      cart: userCart,
      items: userCart.items || [],
    });
  } catch (error: any) {
    console.error("Fetch Cart Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, action, product, quantity, size, image, name, price } = body;

    await connectDB();
    let userCart = await Cart.findOne({ user: user._id });

    if (!userCart) {
      userCart = new Cart({ user: user._id, items: [] });
    }

    if (Array.isArray(items)) {
      // Replace or merge items array
      userCart.items = items;
    } else if (product && action === "add") {
      const existingIdx = userCart.items.findIndex(
        (item: any) => item.product?.toString() === product.toString() && item.size === (size || "")
      );
      if (existingIdx > -1) {
        userCart.items[existingIdx].quantity += quantity || 1;
      } else {
        userCart.items.push({
          product,
          quantity: quantity || 1,
          size: size || "",
          image: image || "",
          name: name || "",
          price: price || 0,
        });
      }
    } else if (product && action === "update") {
      const existingIdx = userCart.items.findIndex(
        (item: any) => item.product?.toString() === product.toString()
      );
      if (existingIdx > -1) {
        if ((quantity || 0) <= 0) {
          userCart.items.splice(existingIdx, 1);
        } else {
          userCart.items[existingIdx].quantity = quantity;
        }
      }
    } else if (product && action === "remove") {
      userCart.items = userCart.items.filter(
        (item: any) => item.product?.toString() !== product.toString()
      );
    }

    await userCart.save();

    return NextResponse.json({
      success: true,
      cart: userCart,
      items: userCart.items || [],
    });
  } catch (error: any) {
    console.error("Update Cart Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectDB();
    let userCart = await Cart.findOne({ user: user._id });
    if (userCart) {
      userCart.items = [];
      await userCart.save();
    }

    return NextResponse.json({
      success: true,
      message: "Cart cleared",
      items: [],
    });
  } catch (error: any) {
    console.error("Clear Cart Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear cart" },
      { status: 500 }
    );
  }
}
