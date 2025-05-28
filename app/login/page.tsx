"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Leaf, Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("") // Clear previous errors

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (res.ok) {
        window.location.href = "/" // Redirect to home page
      } else {
        const data = await res.json()
        setError(data.message || "Invalid email or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">SoilSense</span>
            </div>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">Welcome Back</Badge>
            <h1 className="text-3xl font-bold text-green-900 mb-2">Sign In to Your Account</h1>
            <p className="text-green-600">Continue your sustainable farming journey</p>
          </div>

          {/* Login Card */}
          <Card className="border-green-100 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-green-900">Sign In</CardTitle>
              <CardDescription className="text-green-600">
                Enter your credentials to access your farming dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-green-800">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-green-200 focus-visible:ring-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-green-800">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-green-300 text-green-600 focus:ring-green-500"
                    />
                    <Label htmlFor="remember" className="text-sm text-green-700">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-800">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </form>


              <div className="text-center">
                <p className="text-sm text-green-600">
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-medium text-green-700 hover:text-green-900">
                    Sign up for free
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="mt-8 text-center">
            <p className="text-sm text-green-600 mb-4">Join thousands of farmers already using SoilSense</p>
            <div className="flex justify-center space-x-6 text-xs text-green-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Soil Analysis</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Crop Recommendations</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Community Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
