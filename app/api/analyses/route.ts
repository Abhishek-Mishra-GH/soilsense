import { getUserSession } from "@/auth/session";
import { getUserSoilAnalyses } from "@/lib/soil-analysis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = (await getUserSession()) as { id: string } | null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analyses = await getUserSoilAnalyses(user.id);
    return NextResponse.json(analyses);
  } catch (error) {
    console.error("Failed to fetch analyses:", error);
    return NextResponse.json(
      { error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
