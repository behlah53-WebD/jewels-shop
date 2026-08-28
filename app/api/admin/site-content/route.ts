import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { connectDB } from "@/lib/db/connect";
import { SiteContent } from "@/lib/models/SiteContent";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    await connectDB();
    let content = await SiteContent.findOne();
    if (!content) {
      content = await SiteContent.create({});
    }
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) return auth.errorResponse;

  try {
    const body = await req.json();
    await connectDB();

    let content = await SiteContent.findOne();
    if (!content) {
      content = await SiteContent.create(body);
    } else {
      Object.assign(content, body);
      await content.save();
    }

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error("Update Site Content Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update site content" },
      { status: 500 }
    );
  }
}
