import { getUserSession } from "@/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getUserSession();
    return NextResponse.json({ authenticated: !!session });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
