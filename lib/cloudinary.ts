import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

/**
 * Check if Cloudinary credentials are fully configured in process.env
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME.trim() !== "" &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY.trim() !== "" &&
      process.env.CLOUDINARY_API_SECRET &&
      process.env.CLOUDINARY_API_SECRET.trim() !== ""
  );
}

/**
 * Initialize Cloudinary config with server-side environment variables
 */
function initCloudinary() {
  if (isCloudinaryConfigured()) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

initCloudinary();

/**
 * Extract public_id from a Cloudinary image URL
 * Example: https://res.cloudinary.com/demo/image/upload/v12345678/aurelia_jewels/uploads/ring.webp -> "aurelia_jewels/uploads/ring"
 */
export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || typeof url !== "string" || !url.includes("cloudinary.com")) {
    return null;
  }

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    let pathAfterUpload = parts[1];
    // Strip version prefix if present (e.g. "v172491823/")
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, "");

    // Strip extension (.jpg, .png, .webp, etc.)
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    return pathAfterUpload;
  } catch {
    return null;
  }
}

interface UploadOptions {
  folder?: string;
  filename?: string;
}

/**
 * Server-side function to upload image buffer to Cloudinary
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: UploadOptions = {}
): Promise<{ success: boolean; url?: string; public_id?: string; error?: string }> {
  if (!isCloudinaryConfigured()) {
    return { success: false, error: "Cloudinary is not configured in environment variables" };
  }

  initCloudinary();

  const folder = options.folder || "aurelia_jewels/uploads";

  return new Promise((resolve) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        overwrite: true,
        use_filename: true,
        unique_filename: true,
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error("Cloudinary Upload Error:", error);
          resolve({ success: false, error: error?.message || "Failed to upload to Cloudinary" });
        } else {
          resolve({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Server-side function to delete an image asset from Cloudinary
 */
export async function deleteFromCloudinary(
  publicIdOrUrl: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  if (!isCloudinaryConfigured()) {
    return { success: false, error: "Cloudinary is not configured" };
  }

  initCloudinary();

  const publicId = publicIdOrUrl.includes("http")
    ? extractPublicIdFromUrl(publicIdOrUrl)
    : publicIdOrUrl;

  if (!publicId) {
    return { success: false, error: "Invalid Cloudinary URL or Public ID" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok" || result.result === "not found") {
      return { success: true, message: `Image ${publicId} deleted successfully` };
    }
    return { success: false, error: `Cloudinary delete response: ${result.result}` };
  } catch (error: any) {
    console.error("Cloudinary Delete Error:", error);
    return { success: false, error: error.message || "Failed to delete from Cloudinary" };
  }
}
