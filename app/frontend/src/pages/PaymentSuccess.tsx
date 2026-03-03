import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const status = searchParams.get("status") || "paid";
  const { clearCart } = useCart();

  useEffect(() => {
    if (status === "paid") {
      clearCart();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />
      <div className="flex items-center justify-center min-h-[70vh] px-4 pt-20">
        {status === "paid" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-500 mb-2">
              Thank you for your order.{orderId ? ` Your order #${orderId} has been confirmed.` : ""}
            </p>
            <p className="text-sm text-gray-400 mb-8">
              You&apos;ll receive a confirmation email shortly.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/orders">
                <Button className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2">
                  <Package className="w-4 h-4" />
                  View Orders
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="rounded-full border-green-800 text-green-800 hover:bg-green-50 gap-2">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : status === "failed" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
            <p className="text-gray-500 mb-6">
              Your payment could not be verified. Please try again or contact support.
            </p>
            <Link to="/cart">
              <Button className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2">
                Return to Cart
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <Loader2 className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h1>
            <p className="text-gray-500 mb-6">
              Your payment is still being processed. Please check back later.
            </p>
            <Link to="/orders">
              <Button className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2">
                <Package className="w-4 h-4" />
                View Orders
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}