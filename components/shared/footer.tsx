import { Leaf } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-6 w-6" />
              <span className="text-lg font-bold">SoilSense</span>
            </div>
            <p className="text-green-200">
              Empowering farmers with AI-driven soil analysis for sustainable agriculture.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Product</h4>
            <div className="space-y-2 text-green-200">
              <Link href="/scan" className="block hover:text-white transition-colors">
                Soil Scanner
              </Link>
              <Link href="/crops" className="block hover:text-white transition-colors">
                Crop Guide
              </Link>
              <Link href="/dashboard" className="block hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Company</h4>
            <div className="space-y-2 text-green-200">
              <Link href="/about" className="block hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="block hover:text-white transition-colors">
                Blog
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <div className="space-y-2 text-green-200">
              <Link href="/help" className="block hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="/privacy" className="block hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-green-200">
          <p>&copy; {new Date().getFullYear()} SoilSense. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
