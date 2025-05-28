"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  Camera,
  Loader2,
  Image as ImageIcon,
  MapPin,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload?: (imageUrl: string, analysisId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  showAnalysis?: boolean;
  isAuthenticated?: boolean;
}

export function ImageUpload({
  onUpload,
  onError,
  className = "",
  showAnalysis = true,
  isAuthenticated = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const getLocation = async () => {
    if (!isAuthenticated) {
      onError?.("Please sign in to analyze soil images");
      return;
    }

    setIsGettingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      setLocation({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    } catch (error) {
      onError?.("Failed to get location. Please enable location services.");
    } finally {
      setIsGettingLocation(false);
    }
  };

  const uploadImage = async (file: File) => {
    if (!isAuthenticated) {
      onError?.("Please sign in to analyze soil images");
      return;
    }

    if (!location) {
      onError?.("Please allow location access to analyze soil");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lon.toString());

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }).catch((error) => {
        throw new Error(`Network error: ${error.message}`);
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Upload failed" }));
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json().catch(() => {
        throw new Error("Failed to parse server response");
      });

      if (!result.analysisId) {
        throw new Error("Invalid server response");
      }

      setUploadedImage(result.imageUrl);
      onUpload?.(result.imageUrl, result.analysisId);

      // Use Next.js router for navigation
      window.location.href = `/analysis/${result.analysisId}`;
    } catch (error) {
      console.error("Upload error:", error);
      onError?.(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!isAuthenticated) {
        onError?.("Please sign in to analyze soil images");
        return;
      }

      const file = acceptedFiles[0];
      if (file) {
        // Create preview URL
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Get location if not already available
        if (!location) {
          await getLocation();
        }

        if (location) {
          uploadImage(file);
        }
      }
    },
    [location, isAuthenticated]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <Card className="border-2 border-dashed border-green-200 bg-green-50/30">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
              <Camera className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Sign In Required
            </h3>
            <p className="text-green-600 mb-4">
              Please sign in to analyze your soil images
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card
        className={cn(
          "border-2 border-dashed border-green-200 transition-all duration-200",
          isDragActive ? "border-green-400 bg-green-50" : "bg-white",
          className
        )}
      >
        <CardContent className="p-8">
          <div {...getRootProps()} className="cursor-pointer">
            <input {...getInputProps()} />
            <div className="text-center space-y-4">
              {previewUrl ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewUrl(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="py-8">
                  <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    {isDragActive
                      ? "Drop your image here"
                      : "Upload Soil Image"}
                  </h3>
                  <p className="text-green-600 text-sm mb-4">
                    Drag and drop or click to select
                  </p>
                  <p className="text-xs text-green-500">
                    Supported formats: JPEG, PNG, WebP (max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-green-600 mt-2 text-center">
                {uploadProgress < 100
                  ? "Uploading and analyzing..."
                  : "Analysis complete!"}
              </p>
            </div>
          )}

          {location ? (
            <div className="mt-4 flex items-center justify-center text-sm text-green-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>
                Location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </span>
            </div>
          ) : (
            <Button
              variant="outline"
              className="mt-4 mx-auto block"
              onClick={getLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
