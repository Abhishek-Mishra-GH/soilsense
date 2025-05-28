import Link from "next/link";
import { Button } from "../ui/button";

export default function CTASection() {
  return (
    <section className="py-20 bg-green-600">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-green-100">
            Join thousands of farmers who are already using SoilSense to grow
            better crops sustainably.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-green-600 hover:bg-green-50"
              >
                Start Free Scan
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="bg-green-600 text-white hover:bg-white hover:text-green-600"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
