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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const product = await Product.findById(id).populate("category", "name slug");
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    const body = await req.json();
    const validation = ProductSchemaValidation.partial().safeParse(body);

    if (!validation.success) {
      const errMsg = validation.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return NextResponse.json(
        { success: false, error: errMsg || "Invalid input" },
        { status: 400 }
      );
    }

    const data = validation.data;
    await connectDB();

    if (data.slug) {
      data.slug = slugify(data.slug);
      const existing = await Product.findOne({ slug: data.slug, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "Slug already in use by another product" },
          { status: 400 }
        );
      }
    }

    if (data.SKU) {
      const existing = await Product.findOne({ SKU: data.SKU, _id: { $ne: id } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "SKU already in use by another product" },
          { status: 400 }
        );
      }
    }

    const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  const { id } = await params;

  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Clean up associated Cloudinary images asynchronously
    const imagesToDelete = [
      product.featuredImage,
      ...(Array.isArray(product.images) ? product.images : []),
    ].filter((x): x is string => typeof x === "string" && x.includes("cloudinary.com"));

    for (const imgUrl of imagesToDelete) {
      deleteFromCloudinary(imgUrl).catch((err) =>
        console.warn("Cloudinary Image Cleanup Error:", err)
      );
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
