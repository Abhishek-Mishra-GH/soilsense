import { PrismaClient } from "@/app/generated/prisma";
import { createHash } from "crypto";
import { getEnhancedSoilAnalysis } from "./gemini";

const prisma = new PrismaClient();

export interface Analysis {
  id: string;
  imageUrl: string;
  soilType: string;
  soilDescription: string;
  healthScore: number;
  healthStatus: string;
  phLevel: number;
  phStatus: string;
  recommendedCrops: string[];
  recommendations: string[];
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  createdAt: Date;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  userId: string;
  moisture: number;
  temperature: number;
}

export interface SoilAnalysis {
  id: string;
  imageUrl: string;
  soilType: string;
  soilDescription: string;
  healthScore: number;
  healthStatus: string;
  phLevel: number;
  phStatus: string;
  recommendedCrops: string[];
  recommendations: string[];
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  createdAt: Date;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  userId: string;
}

export async function createSoilAnalysis(
  data: Omit<SoilAnalysis, "id" | "createdAt">
): Promise<SoilAnalysis> {
  return await prisma.soilAnalysis.create({
    data: {
      ...data,
      createdAt: new Date(),
    },
  });
}

export async function getSoilAnalysis(
  id: string
): Promise<SoilAnalysis | null> {
  return await prisma.soilAnalysis.findUnique({
    where: { id },
  });
}

export async function getUserSoilAnalyses(
  userId: string
): Promise<SoilAnalysis[]> {
  return await prisma.soilAnalysis.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllSoilAnalyses(): Promise<SoilAnalysis[]> {
  return await prisma.soilAnalysis.findMany({
    orderBy: { createdAt: "desc" },
  });
}

interface SoilData {
  moisture: number;
  temperature: number;
}

export async function getSoilData(lat: number, lon: number): Promise<SoilData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    throw new Error("OpenWeatherMap API key not configured");
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      moisture: (data.main.humidity / 100) * 0.8,
      temperature: data.main.temp,
    };
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return {
      moisture: 0.5,
      temperature: 20,
    };
  }
}

export async function analyzeSoilImage(
  userId: string,
  imageUrl: string,
  latitude: number,
  longitude: number,
  detectedSoilType: string = "Unknown"
): Promise<SoilAnalysis> {
  try {
    // Get soil data from weather API for environmental context
    const soilData = await getSoilData(latitude, longitude);

    // Calculate initial health score based on moisture and temperature
    const healthScore = calculateHealthScore(
      soilData.moisture,
      soilData.temperature
    );

    // Get enhanced analysis from Gemini AI
    const enhancedAnalysis = await getEnhancedSoilAnalysis(
      detectedSoilType,
      healthScore,
      soilData.moisture,
      soilData.temperature,
      { lat: latitude, lon: longitude }
    );

    // Calculate nutrient levels based on soil type and conditions
    const nutrients = calculateNutrientLevels(
      detectedSoilType,
      soilData.moisture
    );

    // Determine pH level and status based on soil type
    const { phLevel, phStatus } = determinePHLevels(detectedSoilType);

    // Create the analysis record with all the calculated data
    const analysis = await prisma.soilAnalysis.create({
      data: {
        userId,
        imageUrl,
        latitude,
        longitude,
        soilType: detectedSoilType,
        soilDescription:
          enhancedAnalysis?.detailedAnalysis?.characteristics?.join("\n") ||
          `This appears to be ${detectedSoilType} soil with ${
            soilData.moisture * 100
          }% moisture content at ${soilData.temperature}°C.`,
        healthScore,
        healthStatus: getHealthStatus(healthScore),
        phLevel,
        phStatus,
        recommendedCrops:
          enhancedAnalysis?.cropRecommendations?.recommended ||
          getRecommendedCrops(detectedSoilType),
        recommendations: enhancedAnalysis
          ? [
              enhancedAnalysis.seasonalAdvice.timing,
              enhancedAnalysis.seasonalAdvice.challenges,
              ...(enhancedAnalysis.improvementStrategies.immediateActions ||
                []),
              enhancedAnalysis.improvementStrategies.longTermPlan,
              enhancedAnalysis.sustainablePractices.waterManagement,
              enhancedAnalysis.sustainablePractices.soilConservation,
            ].filter((item): item is string => typeof item === "string")
          : generateRecommendations(detectedSoilType, healthScore),
        ...nutrients,
        address: null,
        moisture: soilData.moisture,
        temperature: soilData.temperature,
      },
    });

    return analysis;
  } catch (error) {
    console.error("Soil analysis error:", error);
    throw error;
  }
}

function calculateHealthScore(moisture: number, temperature: number): number {
  // Ideal moisture is between 0.4 and 0.6 (40-60%)
  const moistureScore = 100 - Math.abs((moisture - 0.5) * 200);

  // Ideal temperature is between 15-25°C
  const tempScore = 100 - Math.abs((temperature - 20) * 5);

  // Combined score weighted 60% moisture, 40% temperature
  return Math.round(moistureScore * 0.6 + tempScore * 0.4);
}

function calculateNutrientLevels(soilType: string, moisture: number) {
  // Base nutrient levels by soil type
  const baseNutrients = {
    Clay: { nitrogen: 40, phosphorus: 30, potassium: 45 },
    Sandy: { nitrogen: 20, phosphorus: 15, potassium: 25 },
    Loamy: { nitrogen: 45, phosphorus: 40, potassium: 50 },
    Silty: { nitrogen: 35, phosphorus: 35, potassium: 40 },
    Peaty: { nitrogen: 50, phosphorus: 25, potassium: 30 },
  };

  // Get base nutrients for the soil type or use default values
  const base = baseNutrients[soilType as keyof typeof baseNutrients] || {
    nitrogen: 30,
    phosphorus: 25,
    potassium: 35,
  };

  // Adjust based on moisture (nutrients are more available in properly moisturized soil)
  const moistureFactor = 1 + (moisture - 0.5);

  return {
    nitrogen: Math.round(base.nitrogen * moistureFactor),
    phosphorus: Math.round(base.phosphorus * moistureFactor),
    potassium: Math.round(base.potassium * moistureFactor),
  };
}

function determinePHLevels(soilType: string): {
  phLevel: number;
  phStatus: string;
} {
  // Typical pH ranges for different soil types
  const phRanges = {
    Clay: { min: 6.0, max: 7.0 },
    Sandy: { min: 5.5, max: 6.5 },
    Loamy: { min: 6.0, max: 7.0 },
    Silty: { min: 6.0, max: 7.0 },
    Peaty: { min: 4.5, max: 5.5 },
  };

  const range = phRanges[soilType as keyof typeof phRanges] || {
    min: 6.0,
    max: 7.0,
  };
  const phLevel = Number(
    (range.min + Math.random() * (range.max - range.min)).toFixed(1)
  );

  let phStatus = "Neutral";
  if (phLevel < 6.0) phStatus = "Acidic";
  else if (phLevel > 7.0) phStatus = "Alkaline";

  return { phLevel, phStatus };
}

function getSoilDescription(soilType: string): string {
  const descriptions: Record<string, string> = {
    Clay: "Dense and nutrient-rich soil that retains water well but can be heavy and difficult to work with.",
    Sandy:
      "Light and well-draining soil that warms up quickly in spring but may not retain nutrients well.",
    Loamy:
      "Ideal soil type with a good balance of sand, silt, and clay. Excellent for most plants.",
    Silty:
      "Fertile soil with good water retention and easy to work with. Rich in nutrients.",
    Peaty:
      "Acidic soil high in organic matter, excellent for specific acid-loving plants.",
  };
  return descriptions[soilType] || "Unknown soil type";
}

function getHealthStatus(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}

function getRecommendedCrops(soilType: string): string[] {
  const cropsByType: Record<string, string[]> = {
    Clay: ["Cabbage", "Broccoli", "Brussels Sprouts", "Beans"],
    Sandy: ["Carrots", "Potatoes", "Lettuce", "Strawberries"],
    Loamy: ["Tomatoes", "Corn", "Peppers", "Squash"],
    Silty: ["Roses", "Grass", "Most Vegetables", "Berry Plants"],
    Peaty: ["Blueberries", "Rhododendrons", "Azaleas", "Heathers"],
  };
  return cropsByType[soilType] || ["Grass", "Basic Vegetables"];
}

function generateRecommendations(
  soilType: string,
  healthScore: number
): string[] {
  const recommendations: string[] = [];

  if (healthScore < 60) {
    recommendations.push("Add organic matter to improve soil structure");
    recommendations.push("Consider using a balanced fertilizer");
  }

  switch (soilType) {
    case "Clay":
      recommendations.push("Add gypsum to improve drainage");
      recommendations.push("Avoid working soil when wet");
      break;
    case "Sandy":
      recommendations.push("Add compost to improve water retention");
      recommendations.push("Use mulch to prevent moisture loss");
      break;
    case "Loamy":
      recommendations.push("Maintain organic matter levels");
      recommendations.push("Regular crop rotation recommended");
      break;
    case "Silty":
      recommendations.push("Improve drainage if needed");
      recommendations.push("Add organic matter to maintain structure");
      break;
    case "Peaty":
      recommendations.push("Monitor pH levels regularly");
      recommendations.push("Add lime if soil is too acidic");
      break;
  }

  return recommendations;
}
