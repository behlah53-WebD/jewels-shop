import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/guards";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ success: true, user: null });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        addresses: user.addresses,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: true, user: null });
  }
}
