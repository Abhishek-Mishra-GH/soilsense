"use client";

import { getUserSession } from "@/auth/session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Camera,
  Download,
  Eye,
  Leaf,
  MapPin,
  Settings,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getUserSoilAnalyses, type SoilAnalysis } from "@/lib/soil-analysis";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  farmLocation?: string;
  farmSize?: string;
}

function formatDate(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userAnalyses, setUserAnalyses] = useState<SoilAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const userResponse = await fetch("/api/auth/session");
        const userData = await userResponse.json();

        if (!userData) {
          router.push("/login");
          return;
        }

        setUser(userData);

        const analysesResponse = await fetch("/api/analyses");
        const analysesData = await analysesResponse.json();
        setUserAnalyses(analysesData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-green-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-600";
    return "text-red-500";
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 80) return "bg-green-50";
    if (score >= 70) return "bg-yellow-50";
    return "bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      {/* Page Header */}
      <div className="bg-green-600 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.firstName}
                />
                <AvatarFallback className="bg-white text-green-600 text-xl">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user.firstName}!
                </h1>
                <p className="text-green-100">
                  {user.farmLocation && (
                    <>
                      <MapPin className="inline h-4 w-4 mr-1" />
                      {user.farmLocation}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="overview" className="text-base">
                <BarChart3 className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-base">
                <TrendingUp className="mr-2 h-4 w-4" />
                My Analysis
              </TabsTrigger>
              <TabsTrigger value="profile" className="text-base">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-base">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700">
                      Total Scans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">
                      {userAnalyses.length}
                    </div>
                    <p className="text-xs text-green-600">+2 from last month</p>
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700">
                      Avg Health Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">
                      {userAnalyses.length > 0
                        ? Math.round(
                            userAnalyses.reduce(
                              (acc, a) => acc + a.healthScore,
                              0
                            ) / userAnalyses.length
                          )
                        : 0}
                    </div>
                    <p className="text-xs text-green-600">+5 improvement</p>
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700">
                      Crops Grown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">12</div>
                    <p className="text-xs text-green-600">
                      Different varieties
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-green-700">
                      Community Rank
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-900">#47</div>
                    <p className="text-xs text-green-600">Top 15% farmers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-green-100">
                  <CardHeader>
                    <CardTitle className="text-green-900">
                      Recent Soil Scans
                    </CardTitle>
                    <CardDescription>
                      Your latest soil analysis results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userAnalyses.length > 0 ? (
                      <div className="space-y-4">
                        {userAnalyses.slice(0, 3).map((analysis) => (
                          <div
                            key={analysis.id}
                            className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg"
                          >
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                              <Leaf className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-green-900">
                                {analysis.soilType} Soil
                              </p>
                              <p className="text-sm text-green-600">
                                Health Score: {analysis.healthScore}/100
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-200"
                            >
                              {analysis.healthStatus}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Camera className="h-12 w-12 text-green-400 mx-auto mb-4" />
                        <p className="text-green-600">No soil scans yet</p>
                        <Link href="/scan">
                          <Button className="mt-4 bg-green-600 hover:bg-green-700">
                            Start Your First Scan
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-green-100">
                  <CardHeader>
                    <CardTitle className="text-green-900">
                      Recommended Actions
                    </CardTitle>
                    <CardDescription>
                      Based on your recent soil analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                        <div>
                          <p className="font-medium text-green-900">
                            Add Organic Compost
                          </p>
                          <p className="text-sm text-green-600">
                            Improve soil structure and nutrient content
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-2"></div>
                        <div>
                          <p className="font-medium text-green-900">
                            Test pH Levels
                          </p>
                          <p className="text-sm text-green-600">
                            Monitor acidity for optimal crop growth
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                        <div>
                          <p className="font-medium text-green-900">
                            Plant Cover Crops
                          </p>
                          <p className="text-sm text-green-600">
                            Protect soil during off-season
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/scan">
                      <Button className="w-full bg-green-600 hover:bg-green-700 h-16">
                        <Camera className="mr-2 h-5 w-5" />
                        New Soil Scan
                      </Button>
                    </Link>
                    <Link href="/community">
                      <Button
                        variant="outline"
                        className="w-full border-green-200 text-green-700 h-16"
                      >
                        <Users className="mr-2 h-5 w-5" />
                        Join Community
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full border-green-200 text-green-700 h-16"
                    >
                      <Download className="mr-2 h-5 w-5" />
                      Export Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-8">
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900">
                    Soil Analysis History
                  </CardTitle>
                  <CardDescription>
                    All your soil scans and their results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userAnalyses.length > 0 ? (
                    <div className="space-y-4">
                      {userAnalyses.map((analysis) => (
                        <Card key={analysis.id} className="border-green-50">
                          <CardContent className="p-6">
                            <div className="grid lg:grid-cols-4 gap-6">
                              <div className="lg:col-span-1">
                                <img
                                  src={analysis.imageUrl || "/placeholder.svg"}
                                  alt="Soil analysis"
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                              </div>
                              <div className="lg:col-span-3 space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-green-900">
                                      {analysis.soilType} Soil Analysis
                                    </h3>
                                    <p className="text-sm text-green-600">
                                      {formatDate(analysis.createdAt)}
                                    </p>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 border-green-200"
                                    >
                                      <Eye className="mr-1 h-4 w-4" />
                                      View
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 border-green-200"
                                    >
                                      <Download className="mr-1 h-4 w-4" />
                                      Export
                                    </Button>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div
                                    className={`p-3 rounded-lg ${getHealthScoreBg(
                                      analysis.healthScore
                                    )}`}
                                  >
                                    <p className="text-sm font-medium text-green-800">
                                      Health Score
                                    </p>
                                    <p
                                      className={`text-xl font-bold ${getHealthScoreColor(
                                        analysis.healthScore
                                      )}`}
                                    >
                                      {analysis.healthScore}/100
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-blue-50">
                                    <p className="text-sm font-medium text-blue-800">
                                      pH Level
                                    </p>
                                    <p className="text-xl font-bold text-blue-600">
                                      {analysis.phLevel}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-lg bg-amber-50">
                                    <p className="text-sm font-medium text-amber-800">
                                      Status
                                    </p>
                                    <p className="text-xl font-bold text-amber-600">
                                      {analysis.healthStatus}
                                    </p>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-sm font-medium text-green-800 mb-2">
                                    Recommended Crops:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {(analysis.recommendedCrops || []).map(
                                      (crop, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-green-600 border-green-200"
                                        >
                                          {crop}
                                        </Badge>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-green-900 mb-2">
                        No Analysis Data Yet
                      </h3>
                      <p className="text-green-600 mb-6">
                        Start by scanning your soil to see detailed analytics
                        here.
                      </p>
                      <Link href="/scan">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Camera className="mr-2 h-4 w-4" />
                          Scan Your First Soil Sample
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              <Card className="border-green-100">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-green-900">
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Manage your account details and farm information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={user?.avatar || "/placeholder.svg"}
                        alt={user?.firstName || ""}
                      />
                      <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
                        {user?.firstName?.charAt(0) || ""}
                        {user?.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-green-800">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={user.firstName}
                        disabled
                        className="border-green-200 focus-visible:ring-green-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-green-800">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={user.lastName}
                        disabled
                        className="border-green-200 focus-visible:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-green-800">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="border-green-200 focus-visible:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="farmLocation" className="text-green-800">
                        Farm Location
                      </Label>
                      <Input
                        id="farmLocation"
                        value={user.farmLocation || ""}
                        disabled
                        className="border-green-200 focus-visible:ring-green-500"
                        placeholder="e.g., California, USA"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmSize" className="text-green-800">
                        Farm Size
                      </Label>
                      <Input
                        id="farmSize"
                        value={user.farmSize || ""}
                        disabled
                        className="border-green-200 focus-visible:ring-green-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8">
              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900">
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">
                        Email Notifications
                      </p>
                      <p className="text-sm text-green-600">
                        Receive analysis results and tips via email
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">
                        Community Updates
                      </p>
                      <p className="text-sm text-green-600">
                        Get notified about new community posts and events
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">
                        Weekly Reports
                      </p>
                      <p className="text-sm text-green-600">
                        Receive weekly soil health summaries
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-100">
                <CardHeader>
                  <CardTitle className="text-green-900">
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your data and privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">
                        Public Profile
                      </p>
                      <p className="text-sm text-green-600">
                        Allow others to see your farming achievements
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">
                        Share Analysis Data
                      </p>
                      <p className="text-sm text-green-600">
                        Help improve our AI with anonymized data
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-100">
                <CardHeader>
                  <CardTitle className="text-red-900">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Delete All Analysis Data
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
