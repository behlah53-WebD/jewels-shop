import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("errorResponse" in auth) {
    return auth.errorResponse;
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. If Cloudinary credentials are configured, upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const result = await uploadToCloudinary(buffer, {
        folder: "aurelia_jewels/uploads",
      });

      if (result.success && result.url) {
        return NextResponse.json({
          success: true,
          url: result.url,
          public_id: result.public_id,
          provider: "cloudinary",
        });
      }

      console.warn("Cloudinary upload failed, using local filesystem fallback:", result.error);
    }

    // 2. Fallback mode: Save to local filesystem or Base64 data URI
    const ext = path.extname(file.name) || ".png";
    const cleanName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    const filename = `${cleanName}-${Date.now()}${ext}`;

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.promises.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({ success: true, url: fileUrl, provider: "local" });
    } catch (fsErr) {
      console.warn("FileSystem write failed, converting to Base64 data URI fallback:", fsErr);
      const mimeType = file.type || "image/png";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl, provider: "base64" });
    }
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
