import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { Category } from "@/lib/models/Category";
import { products as fallbackProducts } from "@/lib/data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryParam = searchParams.get("category");
    const materialParam = searchParams.get("material");
    const collectionParam = searchParams.get("collection");
    const searchParam = searchParams.get("search");
    const featuredParam = searchParams.get("featured");
    const sortParam = searchParams.get("sort") || "newest";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    const db = await connectDB();

    if (!db) {
      // Fallback mode when MongoDB is not connected
      let result = [...fallbackProducts];
      if (categoryParam) {
        result = result.filter(
          (p) => p.kind.toLowerCase() === categoryParam.toLowerCase()
        );
      }
      if (searchParam) {
        const q = searchParam.toLowerCase();
        result = result.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.kind.toLowerCase().includes(q)
        );
      }
      return NextResponse.json({
        success: true,
        products: result,
        total: result.length,
        page: 1,
        pages: 1,
        isFallback: true,
      });
    }

    const query: any = { active: true };

    if (categoryParam) {
      const categoryObj = await Category.findOne({
        $or: [
          { slug: categoryParam.toLowerCase() },
          { name: { $regex: new RegExp(`^${categoryParam}$`, "i") } },
        ],
      });
      if (categoryObj) {
        query.category = categoryObj._id;
      } else {
        query.category = categoryParam;
      }
    }

    if (materialParam) {
      query.material = { $regex: new RegExp(materialParam, "i") };
    }

    if (collectionParam) {
      query.collectionName = { $regex: new RegExp(collectionParam, "i") };
    }

    if (featuredParam === "true") {
      query.featured = true;
    }

    if (searchParam) {
      query.$or = [
        { name: { $regex: searchParam, $options: "i" } },
        { description: { $regex: searchParam, $options: "i" } },
        { material: { $regex: searchParam, $options: "i" } },
        { tags: { $in: [new RegExp(searchParam, "i")] } },
      ];
    }

    let sort: any = { createdAt: -1 };
    if (sortParam === "price-asc") sort = { price: 1 };
    if (sortParam === "price-desc") sort = { price: -1 };
    if (sortParam === "name-asc") sort = { name: 1 };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).populate("category", "name slug"),
      Product.countDocuments(query),
    ]);

    // If database is connected but has 0 products yet, return fallback products
    if (total === 0 && !categoryParam && !searchParam) {
      return NextResponse.json({
        success: true,
        products: fallbackProducts,
        total: fallbackProducts.length,
        page: 1,
        pages: 1,
        isFallback: true,
      });
    }

    return NextResponse.json({
      success: true,
      products,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (error: any) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
