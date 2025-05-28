import axios from "axios";

const ROBOFLOW_API_KEY = "7RAwa08iZvlFyeWG0n9a";
const ROBOFLOW_MODEL_URL = "https://serverless.roboflow.com/soil-type-model/1";

export async function detectSoilType(file: File): Promise<string> {
  try {
    // Convert File to base64
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const response = await axios({
      method: "POST",
      url: ROBOFLOW_MODEL_URL,
      params: {
        api_key: ROBOFLOW_API_KEY,
      },
      data: base64Image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Extract soil type from response
    // Note: Adjust this based on the actual response structure
    const soilType = response.data.predictions[0]?.class || "Unknown";
    return soilType;
  } catch (error) {
    console.error("Soil type detection error:", error);
    return "Unknown";
  }
}
