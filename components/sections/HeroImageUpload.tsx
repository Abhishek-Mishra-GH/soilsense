"use client";

import { useEffect, useState } from "react";
import { ImageUpload } from "../shared/image-upload";

export function HeroImageUpload() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated);
      })
      .catch((error) => {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      });
  }, []);

  return (
    <ImageUpload
      isAuthenticated={isAuthenticated}
      onError={(error) => {
        console.error("Upload error:", error);
      }}
    />
  );
}
