import {
  Camera,
  MapPin,
  Shield,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">
            Features
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-green-900 mb-4">
            Everything You Need for Smart Farming
          </h2>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Our AI-powered platform provides comprehensive soil analysis and
            personalized recommendations to help you grow better crops
            sustainably.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-green-900">
                AI Soil Detection
              </CardTitle>
              <CardDescription className="text-green-600">
                Advanced computer vision analyzes your soil photos to identify
                type, composition, and health indicators instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <Sprout className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle className="text-green-900">
                Smart Crop Recommendations
              </CardTitle>
              <CardDescription className="text-green-600">
                Get personalized crop suggestions based on your soil type, local
                climate, and seasonal conditions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-green-900">
                Eco-Friendly Guidance
              </CardTitle>
              <CardDescription className="text-green-600">
                Sustainable farming practices and organic solutions to improve
                soil health while protecting the environment.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-green-900">
                Location-Based Insights
              </CardTitle>
              <CardDescription className="text-green-600">
                Localized recommendations considering your specific geographic
                region, weather patterns, and growing conditions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-green-900">
                Progress Tracking
              </CardTitle>
              <CardDescription className="text-green-600">
                Monitor your soil health improvements over time with detailed
                analytics and personalized farming tips.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-green-100 hover:border-green-200">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <Users className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-green-900">
                Community Support
              </CardTitle>
              <CardDescription className="text-green-600">
                Connect with fellow farmers, share experiences, and learn from a
                community of sustainable agriculture enthusiasts.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
