import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import { CategorySchemaValidation } from "@/lib/validations/schemas";

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
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    const validation = CategorySchemaValidation.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { name, slug: inputSlug, description, image, active } = validation.data;
    const slug = inputSlug ? slugify(inputSlug) : slugify(name);

    await connectDB();

    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Category with slug "${slug}" already exists.` },
        { status: 400 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description: description || "",
      image: image || "",
      active: active !== undefined ? active : true,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
