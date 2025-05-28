import { type NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createSoilAnalysis, analyzeSoilImage } from "@/lib/soil-analysis";
import { getUserSession } from "@/auth/session";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  try {
    const user = (await getUserSession()) as { id: string };
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate deterministic filename based on file content
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
    const filename = `soil-${hash}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(buffer, filename);

    // Get location data from form
    const latitude = parseFloat(formData.get("latitude") as string) || 0;
    const longitude = parseFloat(formData.get("longitude") as string) || 0;

    // Perform soil analysis
    const analysisData = await analyzeSoilImage(
      user.id,
      imageUrl,
      latitude,
      longitude
    );

    // Save to database
    const analysis = await createSoilAnalysis({
      imageUrl: analysisData.imageUrl,
      userId: analysisData.userId,
      soilType: analysisData.soilType,
      soilDescription: analysisData.soilDescription,
      healthScore: analysisData.healthScore,
      healthStatus: analysisData.healthStatus,
      phLevel: analysisData.phLevel,
      phStatus: analysisData.phStatus,
      recommendedCrops: analysisData.recommendedCrops,
      recommendations: analysisData.recommendations,
      nitrogen: analysisData.nitrogen,
      phosphorus: analysisData.phosphorus,
      potassium: analysisData.potassium,
      latitude: latitude,
      longitude: longitude,
      address: null,
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      analysisId: analysis.id,
      analysis: {
        soilType: analysis.soilType,
        soilDescription: analysis.soilDescription,
        healthScore: analysis.healthScore,
        healthStatus: analysis.healthStatus,
        phLevel: analysis.phLevel,
        phStatus: analysis.phStatus,
        recommendedCrops: analysis.recommendedCrops,
        recommendations: analysis.recommendations,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload and analyze image" },
      { status: 500 }
    );
  }
}
