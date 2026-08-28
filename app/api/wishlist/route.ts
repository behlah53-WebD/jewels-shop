import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Wishlist } from "@/lib/models/Wishlist";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: true, wishlist: null, products: [] });
    }

    await connectDB();
    let userWishlist = await Wishlist.findOne({ user: user._id });

    if (!userWishlist) {
      userWishlist = await Wishlist.create({ user: user._id, products: [] });
    }

    return NextResponse.json({
      success: true,
      wishlist: userWishlist,
      products: userWishlist.products || [],
    });
  } catch (error: any) {
    console.error("Fetch Wishlist Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch wishlist" },
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
    const { productId, products, action } = body;

    await connectDB();
    let userWishlist = await Wishlist.findOne({ user: user._id });

    if (!userWishlist) {
      userWishlist = new Wishlist({ user: user._id, products: [] });
    }

    if (Array.isArray(products)) {
      userWishlist.products = products;
    } else if (productId) {
      const pidStr = productId.toString();
      const exists = userWishlist.products.includes(pidStr);

      if (action === "add" && !exists) {
        userWishlist.products.push(pidStr);
      } else if (action === "remove" && exists) {
        userWishlist.products = userWishlist.products.filter((p) => p !== pidStr);
      } else if (!action) {
        // Toggle
        if (exists) {
          userWishlist.products = userWishlist.products.filter((p) => p !== pidStr);
        } else {
          userWishlist.products.push(pidStr);
        }
      }
    }

    await userWishlist.save();

    return NextResponse.json({
      success: true,
      wishlist: userWishlist,
      products: userWishlist.products || [],
    });
  } catch (error: any) {
    console.error("Update Wishlist Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update wishlist" },
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
    let userWishlist = await Wishlist.findOne({ user: user._id });
    if (userWishlist) {
      userWishlist.products = [];
      await userWishlist.save();
    }

    return NextResponse.json({
      success: true,
      message: "Wishlist cleared",
      products: [],
    });
  } catch (error: any) {
    console.error("Clear Wishlist Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to clear wishlist" },
      { status: 500 }
    );
  }
}
