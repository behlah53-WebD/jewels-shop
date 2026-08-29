import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import { imgs } from "@/lib/data";

const fallbackCategories = [
  { name: "Rings", slug: "rings", image: imgs.ring, description: "Solitary emerald cut and diamond bands." },
  { name: "Earrings", slug: "earrings", image: imgs.emerald, description: "Vibrant emerald teardrops and diamond studs." },
  { name: "Bracelets", slug: "bracelets", image: imgs.gold, description: "Tennis bracelets and gold cuffs." },
  { name: "Pendants & Necklaces", slug: "necklaces", image: imgs.hero, description: "Statement diamond & gemstone pendants." },
];

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ success: true, categories: fallbackCategories, isFallback: true });
    }

    const categories = await Category.find({ active: { $ne: false } }).sort({ name: 1 }).lean();
    if (categories.length === 0) {
      return NextResponse.json({ success: true, categories: fallbackCategories, isFallback: true });
    }

    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: true, categories: fallbackCategories, isFallback: true });
  }
}
