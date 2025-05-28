"use client";

import React from "react";
import { Leaf } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check session status
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setSession(true);
        } else {
          setSession(null);
        }
      })
      .catch((error) => {
        console.error("Auth check error:", error);
        setSession(null);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        setSession(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="text-xl font-bold text-green-800">
                  SoilSense
                </span>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#features"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#community"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              Community
            </Link>
            <Link
              href="/#about"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              About Us
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-green-700 hover:text-green-900"
              >
                Logout
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="text-green-700 hover:text-green-900"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
