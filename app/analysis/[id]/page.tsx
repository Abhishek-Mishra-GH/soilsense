"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import type { Analysis } from "@/lib/soil-analysis";

export default function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    if (!resolvedParams?.id) {
      router.push("/scan");
      return;
    }

    async function fetchAnalysis() {
      try {
        const response = await fetch(`/api/analyses/${resolvedParams.id}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          if (response.status === 404) {
            router.push("/scan");
            return;
          }
          throw new Error("Failed to fetch analysis");
        }
        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error("Error fetching analysis:", error);
        router.push("/scan");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [resolvedParams?.id, router]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Soil Analysis Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detailed Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Soil Type</h3>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                  {analysis.soilType}
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Key Characteristics</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.soilDescription.split("\n").map((char, i) => (
                  <li key={i} className="text-sm">
                    {char}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {/* <div className="flex items-center space-x-2">
              <h3 className="font-semibold mb-2">Health Status</h3>
                <div className="text-2xl font-bold">{analysis.healthScore}</div>
                <div className="text-sm text-gray-600">/ 100</div>
                <div
                  className={`px-2 py-1 rounded text-sm ${
                    analysis.healthStatus === "Excellent"
                      ? "bg-green-100 text-green-800"
                      : analysis.healthStatus === "Good"
                      ? "bg-blue-100 text-blue-800"
                      : analysis.healthStatus === "Fair"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {analysis.healthStatus}
                </div>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Environmental Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Moisture & Temperature</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      💧 {(analysis.moisture * 100).toFixed(1)}% Moisture
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded">
                      🌡️ {analysis.temperature.toFixed(1)}°C
                    </span>
                  </div>
                </div>
              </div>
              {/* <div>
                <h3 className="font-semibold mb-2">pH Level</h3>
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold">{analysis.phLevel}</div>
                  <div
                    className={`px-2 py-1 rounded text-sm ${
                      analysis.phStatus === "Neutral"
                        ? "bg-green-100 text-green-800"
                        : analysis.phStatus === "Acidic"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {analysis.phStatus}
                  </div>
                </div>
              </div> */}
            </div>

            {/* <div>
              <h3 className="font-semibold mb-2">Nutrients</h3>
              <div className="space-y-2 text-sm">
                <div>Nitrogen: {analysis.nitrogen}%</div>
                <div>Phosphorus: {analysis.phosphorus}%</div>
                <div>Potassium: {analysis.potassium}%</div>
              </div>
            </div> */}

            {analysis.latitude && analysis.longitude && (
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <div className="text-sm bg-gray-50 p-2 rounded flex items-center space-x-2">
                  <span>📍</span>
                  <span>
                    {analysis.latitude.toFixed(4)}°,{" "}
                    {analysis.longitude.toFixed(4)}°
                    {analysis.address && (
                      <span className="block text-gray-600 mt-1">
                        {analysis.address}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Recommended Crops</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.recommendedCrops.map((crop, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Improvement Steps</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
