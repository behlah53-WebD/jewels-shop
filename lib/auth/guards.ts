import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCookies, verifyToken, JWTPayload } from "./jwt";
import { connectDB } from "@/lib/db/connect";
import { User, IUser } from "@/lib/models/User";

export async function getAuthTokenPayload(req?: NextRequest): Promise<JWTPayload | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get("auth_token")?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  }

  if (!token) {
    token = await getTokenFromCookies();
  }

  if (!token) return null;
  return verifyToken(token);
}

export async function getAuthUser(req?: NextRequest): Promise<IUser | null> {
  const payload = await getAuthTokenPayload(req);
  if (!payload) return null;

  await connectDB();
  const user = await User.findById(payload.userId);
  return user;
}

export async function requireAuth(
  req: NextRequest
): Promise<{ user: IUser } | { errorResponse: NextResponse }> {
  const user = await getAuthUser(req);
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: "Unauthorized access. Please log in." },
        { status: 401 }
      ),
    };
  }
  return { user };
}

export async function requireAdmin(
  req: NextRequest
): Promise<{ user: IUser } | { errorResponse: NextResponse }> {
  const result = await requireAuth(req);
  if ("errorResponse" in result) {
    return result;
  }

  if (result.user.role !== "admin") {
    return {
      errorResponse: NextResponse.json(
        { success: false, error: "Forbidden. Admin privileges required." },
        { status: 403 }
      ),
    };
  }

  return { user: result.user };
}
