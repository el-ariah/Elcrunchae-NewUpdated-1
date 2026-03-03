import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF5] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-bold text-green-800 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/products">
            <Button
              variant="outline"
              className="rounded-full border-green-800 text-green-800 hover:bg-green-50 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}