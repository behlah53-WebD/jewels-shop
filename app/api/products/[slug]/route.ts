import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { products as fallbackProducts } from "@/lib/data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = await connectDB();

    if (!db) {
      const fallback = fallbackProducts.find((p) => p.id === slug) || fallbackProducts[0];
      return NextResponse.json({ success: true, product: fallback, isFallback: true });
    }

    const product = await Product.findOne({
      $or: [{ slug: slug.toLowerCase() }, { SKU: slug }],
      active: true,
    }).populate("category", "name slug").lean();

    if (!product) {
      // Try fallback if not found in DB
      const fallback = fallbackProducts.find((p) => p.id === slug);
      if (fallback) {
        return NextResponse.json({ success: true, product: fallback, isFallback: true });
      }

      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Get Product by Slug Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}
