"use client";

import { ImageUpload } from "@/components/shared/image-upload";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import {
  Camera,
  Clock,
  ArrowRight,
  Leaf,
  Droplet,
  ThermometerSun,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Analysis {
  id: string;
  imageUrl: string;
  soilType: string;
  healthScore: number;
  createdAt: string;
}

export default function ScanPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        const authRes = await fetch("/api/auth/check");
        const authData = await authRes.json();
        setIsAuthenticated(authData.authenticated);

        if (authData.authenticated) {
          const analysesRes = await fetch("/api/analyses");
          const analysesData = await analysesRes.json();
          setAnalyses(analysesData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="bg-white/10 text-white hover:bg-white/20 mb-4">
              <Camera className="w-4 h-4 mr-1 inline-block" />
              Soil Analysis
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Analyze Your Soil Health
            </h1>
            <p className="text-green-100 max-w-xl mx-auto text-lg">
              Get instant insights about your soil composition, health, and
              recommendations for optimal crop growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-center">
            <div className="bg-white/10 rounded-lg p-4">
              <Leaf className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <h3 className="font-medium mb-1">Soil Type Analysis</h3>
              <p className="text-sm text-green-100">
                Identify your soil composition
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Droplet className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <h3 className="font-medium mb-1">Moisture Levels</h3>
              <p className="text-sm text-green-100">
                Monitor soil moisture content
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <ThermometerSun className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <h3 className="font-medium mb-1">Health Score</h3>
              <p className="text-sm text-green-100">
                Get detailed health metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <h2 className="text-xl font-semibold text-green-900 mb-4">
              Upload Soil Image
            </h2>
            <ImageUpload
              isAuthenticated={isAuthenticated}
              onUpload={(imageUrl, analysisId) => {
                console.log("Image uploaded:", imageUrl, analysisId);
                // Refresh analyses after new upload
                fetch("/api/analyses")
                  .then((res) => res.json())
                  .then((data) => setAnalyses(data))
                  .catch((error) =>
                    console.error("Failed to fetch analyses:", error)
                  );
              }}
              onError={(error) => {
                console.error("Upload error:", error);
              }}
            />
          </div>

          {/* History Section */}
          {isAuthenticated && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-green-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Analyses
                </h2>
                <Link href="/analyses">
                  <Button
                    variant="ghost"
                    className="text-green-700 hover:text-green-800"
                  >
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  // Loading skeletons
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="w-16 h-16 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                            <Skeleton className="h-3 w-1/5" />
                          </div>
                        </div>
                      </div>
                    ))
                ) : analyses.length > 0 ? (
                  analyses.slice(0, 3).map((analysis) => (
                    <Link
                      key={analysis.id}
                      href={`/analysis/${analysis.id}`}
                      className="block"
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer border-green-100 group">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-green-50">
                            <img
                              src={analysis.imageUrl}
                              alt="Soil sample"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-green-900">
                              {analysis.soilType} Soil
                            </h3>
                            <p className="text-sm text-green-600">
                              Health Score: {analysis.healthScore}/100
                            </p>
                            <p className="text-xs text-green-500">
                              {new Date(
                                analysis.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12 bg-green-50/50 rounded-xl border-2 border-dashed border-green-100">
                    <Camera className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-green-800 font-medium">
                      No analyses yet
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Upload your first soil image to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
