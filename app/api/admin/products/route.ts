import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Product } from "@/lib/models/Product";
import { ProductSchemaValidation } from "@/lib/validations/schemas";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  try {
    await connectDB();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("category", "name slug");

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  try {
    const body = await req.json();
    const validation = ProductSchemaValidation.safeParse(body);

    if (!validation.success) {
      const errMsg = validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return NextResponse.json(
        { success: false, error: errMsg || "Invalid input" },
        { status: 400 }
      );
    }

    const data = validation.data;
    const slug = data.slug ? slugify(data.slug) : slugify(data.name);

    await connectDB();

    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: `Product with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const existingSKU = await Product.findOne({ SKU: data.SKU });
    if (existingSKU) {
      return NextResponse.json(
        { success: false, error: `Product with SKU "${data.SKU}" already exists.` },
        { status: 400 }
      );
    }

    const product = await Product.create({
      ...data,
      slug,
      compareAtPrice: typeof data.compareAtPrice === "number" ? data.compareAtPrice : undefined,
      collectionName: data.collectionName || undefined,
      shortDescription: data.shortDescription || data.description.substring(0, 120),
      images: data.images.length > 0 ? data.images : [data.featuredImage],
      tags: data.tags || [],
      specifications: data.specifications || [],
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
