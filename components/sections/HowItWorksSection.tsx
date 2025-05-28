import { Badge } from "../ui/badge";

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-20 bg-gradient-to-b from-green-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-green-900 mb-4">
            Simple Steps to Better Farming
          </h2>
          <p className="text-lg text-green-600 max-w-2xl mx-auto">
            Get started with soil analysis in just three easy steps and
            transform your farming approach.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold text-green-900">
              Upload Soil Image
            </h3>
            <p className="text-green-600">
              Take a clear photo of your soil and upload it to our platform. Our
              AI will analyze it instantly.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold text-green-900">
              Get AI Analysis
            </h3>
            <p className="text-green-600">
              Receive detailed insights about soil type, health score, and
              nutrient levels within seconds.
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto text-white text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold text-green-900">
              Follow Recommendations
            </h3>
            <p className="text-green-600">
              Implement our personalized crop suggestions and sustainable
              farming practices for better yields.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
