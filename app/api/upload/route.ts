import { NextResponse } from "next/server";
import { getUserSession } from "@/auth/session";
import { analyzeSoilImage } from "@/lib/soil-analysis";
import { uploadToStorage } from "@/lib/storage";
import { detectSoilType } from "@/lib/roboflow";

export async function POST(request: Request) {
  try {
    const user = (await getUserSession()) as { id: string } | null;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const latitude = parseFloat(formData.get("latitude") as string);
    const longitude = parseFloat(formData.get("longitude") as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: "Invalid location data" },
        { status: 400 }
      );
    }

    // Detect soil type using Roboflow
    const detectedSoilType = await detectSoilType(file);

    // Upload image to storage
    const imageUrl = await uploadToStorage(file);
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // Analyze soil using image and location data, including detected soil type
    const analysis = await analyzeSoilImage(
      user.id,
      imageUrl,
      latitude,
      longitude,
      detectedSoilType // Pass the detected soil type to the analysis function
    );

    if (!analysis || !analysis.id) {
      return NextResponse.json(
        { error: "Failed to analyze soil" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        imageUrl,
        analysisId: analysis.id,
        soilType: detectedSoilType,
        message: "Upload successful",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
