import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AuthCallback page — no longer needed for PHP/MySQL JWT auth.
 * Redirects to home page if anyone lands here.
 */
export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF5]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}