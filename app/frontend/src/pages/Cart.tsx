
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Truck,
  Shield,
  Loader2,
  LogIn,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  createPaymentSession,
  verifyPayment,
} from "@/lib/api";
import {
  sanitizeInput,
  validateShippingForm,
  getSafeErrorMessage,
  checkRateLimit,
} from "@/lib/security";

// 🔴 CHANGE THIS TO "ONLINE" WHEN YOU WANT TO ENABLE RAZORPAY AGAIN
const PAYMENT_MODE = "COD";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user, loading: authLoading, setShowLoginModal } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();

  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPincode, setShippingPincode] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");

  const shippingFee = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!checkRateLimit("checkout", 3, 60000)) {
      toast.error("Too many checkout attempts. Please wait a moment.");
      return;
    }

    const sanitizedData = {
      name: sanitizeInput(shippingName, 100),
      address: sanitizeInput(shippingAddress, 300),
      city: sanitizeInput(shippingCity, 100),
      state: sanitizeInput(shippingState, 100),
      pincode: sanitizeInput(shippingPincode, 10),
      phone: sanitizeInput(shippingPhone, 20),
    };

    const validationError = validateShippingForm(sanitizedData);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setCheckingOut(true);

    try {
      const cartItems = items.map((i) => ({
        product_id: i.product.dbId || 0,
        product_name: sanitizeInput(i.product.name, 200),
        product_image: i.product.boxImage || i.product.image,
        quantity: Math.max(1, Math.min(99, Math.floor(i.quantity))),
        unit_price: i.product.price,
      }));

      // 🔵 CASH ON DELIVERY MODE
      if (PAYMENT_MODE === "COD") {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/entities/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
              status: "pending",
              total_amount: total,
              shipping_fee: shippingFee,
              shipping_name: sanitizedData.name,
              shipping_address: sanitizedData.address,
              shipping_city: sanitizedData.city,
              shipping_state: sanitizedData.state,
              shipping_pincode: sanitizedData.pincode,
              shipping_phone: sanitizedData.phone,
              payment_status: "pending",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to create order");
        }

        clearCart();
        toast.success("Order placed successfully! Cash on Delivery.");
        navigate("/orders");
        return;
      }

      // 🟢 ONLINE PAYMENT MODE (Razorpay preserved)
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway.");
        return;
      }

      const orderData = await createPaymentSession({
        items: cartItems,
        shipping_name: sanitizedData.name,
        shipping_address: sanitizedData.address,
        shipping_city: sanitizedData.city,
        shipping_state: sanitizedData.state,
        shipping_pincode: sanitizedData.pincode,
        shipping_phone: sanitizedData.phone,
      });

      const options = {
        key: orderData.razorpay_key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "El Crunchae",
        description: "Freeze Dried Products",
        order_id: orderData.razorpay_order_id,
        handler: async (response: any) => {
          try {
            const verifyResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderData.order_id,
            });

            if (verifyResult.status === "paid") {
              clearCart();
              toast.success("Payment successful!");
              navigate(`/payment-success?order_id=${orderData.order_id}&status=paid`);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch (err: any) {
            toast.error(getSafeErrorMessage(err, "Payment verification failed."));
          }
        },
        theme: { color: "#15803d" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      toast.error(getSafeErrorMessage(err, "Checkout failed."));
    } finally {
      setCheckingOut(false);
    }
  };

  return null; // UI unchanged for brevity
}
