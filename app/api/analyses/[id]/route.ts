import { getUserSession } from "@/auth/session";
import { getSoilAnalysis } from "@/lib/soil-analysis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const analysis = await getSoilAnalysis(params.id);

    if (!analysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Verify the analysis belongs to the user
    if (analysis.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure all required fields are present with default values
    const validatedAnalysis = {
      ...analysis,
      recommendations: analysis.recommendations || [],
      recommendedCrops: analysis.recommendedCrops || [],
      soilDescription: analysis.soilDescription || "No description available",
      healthStatus: analysis.healthStatus || "Unknown",
      phStatus: analysis.phStatus || "Unknown",
      nitrogen: analysis.nitrogen || 0,
      phosphorus: analysis.phosphorus || 0,
      potassium: analysis.potassium || 0,
      healthScore: analysis.healthScore || 0,
      phLevel: analysis.phLevel || 7.0,
    };

    return NextResponse.json(validatedAnalysis);
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return NextResponse.json(
      { error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}
