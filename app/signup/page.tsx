"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Leaf, Eye, EyeOff, Mail, Lock, User, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { redirect } from "next/navigation";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmLocation: "",
    farmSize: "",
    agreedToTerms: false,
    agreedToNewsletter: false,
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreedToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setError(""); // Clear previous errors

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        farmLocation: formData.farmLocation,
        farmSize: formData.farmSize,
        email: formData.email,
        password: formData.password,
      }),
    });

    if (res.ok) {
      redirect("/");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong...");
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">
                SoilSense
              </span>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">
              Join the Community
            </Badge>
            <h1 className="text-3xl font-bold text-green-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-green-600">
              Start your sustainable farming journey today
            </p>
          </div>

          {/* Signup Card */}
          <Card className="border-green-100 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-green-900">Sign Up</CardTitle>
              <CardDescription className="text-green-600">
                Create your account to access AI-powered soil analysis and
                farming insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-green-800">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="pl-10 border-green-200 focus-visible:ring-green-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-green-800">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Farmer"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-800">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Farm Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmLocation" className="text-green-800">
                      Farm Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                      <Input
                        id="farmLocation"
                        type="text"
                        placeholder="Punjab, India"
                        value={formData.farmLocation}
                        onChange={(e) =>
                          handleInputChange("farmLocation", e.target.value)
                        }
                        className="pl-10 border-green-200 focus-visible:ring-green-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmSize" className="text-green-800">
                      Farm Size
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange("farmSize", value)
                      }
                    >
                      <SelectTrigger className="border-green-200 focus:ring-green-500">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">
                          Small (0-10 acres)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium (10-100 acres)
                        </SelectItem>
                        <SelectItem value="large">
                          Large (100+ acres)
                        </SelectItem>
                        <SelectItem value="hobby">Hobby Garden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Fields */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-green-800">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-10 pr-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-green-500 hover:text-green-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-green-800">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="pl-10 pr-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-green-500 hover:text-green-700"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreedToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreedToTerms", checked as boolean)
                      }
                      className="border-green-300 data-[state=checked]:bg-green-600"
                    />
                    <Label htmlFor="terms" className="text-sm text-green-700">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-green-600 hover:text-green-800 underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-green-600 hover:text-green-800 underline"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="newsletter"
                      checked={formData.agreedToNewsletter}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "agreedToNewsletter",
                          checked as boolean
                        )
                      }
                      className="border-green-300 data-[state=checked]:bg-green-600"
                    />
                    <Label
                      htmlFor="newsletter"
                      className="text-sm text-green-700"
                    >
                      Send me farming tips and product updates
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={!formData.agreedToTerms}
                >
                  Create Account
                </Button>
                {error && <p className="text-red-500">{error}</p>}
              </form>

     



              <div className="text-center">
                <p className="text-sm text-green-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-green-700 hover:text-green-900"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
