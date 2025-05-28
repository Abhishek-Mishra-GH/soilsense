import { getUserSession } from "@/auth/session";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json(null);
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(null);
  }
}
