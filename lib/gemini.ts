import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GOOGLE_AI_API_KEY;

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

interface SoilAnalysisResponse {
  detailedAnalysis: {
    characteristics: string[];
    healthStatus: string;
    environmentalImpact: string;
  };
  seasonalAdvice: {
    recommendedCrops: string[];
    timing: string;
    challenges: string;
  };
  improvementStrategies: {
    immediateActions: string[];
    longTermPlan: string;
  };
  sustainablePractices: {
    waterManagement: string;
    soilConservation: string;
  };
  cropRecommendations: {
    recommended: string[];
    avoid: string[];
  };
}

export async function getEnhancedSoilAnalysis(
  soilType: string,
  healthScore: number,
  moisture: number,
  temperature: number,
  location: { lat: number; lon: number }
): Promise<SoilAnalysisResponse | null> {
  if (!API_KEY) {
    console.warn("Google AI API key not configured");
    return null;
  }

  const prompt = `Analyze the soil data and provide a JSON response with the following structure:
{
  "detailedAnalysis": {
    "characteristics": ["2-3 key characteristics of ${soilType}"],
    "healthStatus": "Brief health analysis (Score: ${healthScore}/100)",
    "environmentalImpact": "Impact of moisture (${moisture}) and temperature (${temperature}°C)"
  },
  "seasonalAdvice": {
    "recommendedCrops": ["2-3 best crops for current season"],
    "timing": "Brief timing recommendation",
    "challenges": "Key seasonal challenge to address"
  },
  "improvementStrategies": {
    "immediateActions": ["2-3 immediate actions needed"],
    "longTermPlan": "One key long-term improvement strategy"
  },
  "sustainablePractices": {
    "waterManagement": "One key water management tip",
    "soilConservation": "One key soil conservation method"
  },
  "cropRecommendations": {
    "recommended": ["3-4 best-suited crops"],
    "avoid": ["2-3 crops to avoid"]
  }
}

Keep each text item under 15 words. Ensure valid JSON format.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Invalid response format from Gemini API");
    }

    const text = result.candidates[0].content.parts[0].text;

    // Extract JSON from the response (in case there's any extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    try {
      const parsedResponse = JSON.parse(jsonMatch[0]) as SoilAnalysisResponse;
      return parsedResponse;
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Failed to parse JSON response");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return null;
  }
}
