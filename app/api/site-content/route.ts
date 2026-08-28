import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { SiteContent } from "@/lib/models/SiteContent";
import { defaultSiteContent } from "@/lib/defaults";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      return NextResponse.json({ success: true, content: defaultSiteContent, isFallback: true });
    }

    let content = await SiteContent.findOne();
    if (!content) {
      return NextResponse.json({ success: true, content: defaultSiteContent, isFallback: true });
    }

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json({ success: true, content: defaultSiteContent, isFallback: true });
  }
}
