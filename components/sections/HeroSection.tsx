import {
  MapPin,
  Leaf,
  Sprout,
  TrendingUp,
  Camera,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:pt-30 lg:pb-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-amber-600/10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                🌱 AI-Powered Soil Analysis
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-green-900 leading-tight">
                Know Better,
                <span className="text-green-600"> Grow Better</span>
              </h1>
              <p className="text-lg text-green-700 max-w-lg">
                Upload a photo of your soil and get instant AI-powered analysis
                with personalized crop recommendations for sustainable farming.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/scan">
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Scan Your Soil
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 flex items-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Use My Location
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-green-100">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    Quick Soil Analysis
                  </h3>
                  <p className="text-green-600 mb-6">
                    Get instant insights about your soil
                  </p>
                </div>

                <Link href="/scan" className="block">
                  <div className="group cursor-pointer bg-green-50 rounded-xl p-8 text-center transition-all hover:bg-green-100">
                    <div className="mx-auto w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                      <Camera className="h-10 w-10 text-green-600" />
                    </div>
                    <p className="text-green-800 font-medium mb-2">
                      Upload Your Soil Photo
                    </p>
                    <p className="text-green-600 text-sm mb-4">
                      Takes less than a minute
                    </p>
                    <Button
                      variant="ghost"
                      className="text-green-700 group-hover:text-green-800"
                    >
                      Get Started <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Link>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-xs text-green-700">Soil Type</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="text-xs text-green-700">Health Score</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <Sprout className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-green-700">Crop Tips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
