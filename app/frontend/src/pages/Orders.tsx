import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Package,
  Loader2,
  LogIn,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchOrders,
  fetchOrderItems,
  type Order,
} from "@/lib/api";

interface OrderItemData {
  id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
}

const statusConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  pending: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", label: "Pending" },
  paid: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", label: "Paid" },
  processing: { icon: Clock, color: "text-blue-600", bg: "bg-blue-50", label: "Processing" },
  shipped: { icon: Truck, color: "text-blue-600", bg: "bg-blue-50", label: "Shipped" },
  delivered: { icon: Package, color: "text-green-700", bg: "bg-green-50", label: "Delivered" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", label: "Cancelled" },
};

export default function OrdersPage() {
  const { user, loading: authLoading, setShowLoginModal } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<Record<number, OrderItemData[]>>({});

  useEffect(() => {
    if (!user) return;
    const loadOrdersData = async () => {
      setOrdersLoading(true);
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrdersData();
  }, [user]);

  const loadOrderItems = async (orderId: number) => {
    if (orderItems[orderId]) return;
    try {
      const data = await fetchOrderItems(orderId);
      setOrderItems((prev) => ({ ...prev, [orderId]: data }));
    } catch (err) {
      console.error("Failed to load order items:", err);
    }
  };

  const toggleOrder = (orderId: number) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      loadOrderItems(orderId);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAF5]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-green-700" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FAFAF5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pt-20">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">View Your Orders</h1>
          <p className="text-gray-500 mb-6">Sign in to see your order history</p>
          <Button
            onClick={() => setShowLoginModal(true)}
            className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-br from-green-800 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Orders</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">My Orders</h1>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {ordersLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
              <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
              <Link to="/products">
                <Button className="rounded-full bg-green-700 hover:bg-green-800 text-white">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.pending;
                const StatusIcon = config.icon;
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                          <StatusIcon className={`w-5 h-5 ${config.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Order #{order.id}</p>
                          <p className="text-xs text-gray-500">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-800">₹{order.totalAmount}</p>
                        <span className={`text-xs font-medium ${config.color} ${config.bg} px-2 py-0.5 rounded-full`}>
                          {config.label}
                        </span>
                      </div>
                    </button>

                    {expandedOrder === order.id && (
                      <div className="border-t px-5 pb-5">
                        <div className="grid grid-cols-2 gap-4 py-4 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs">Ship To</p>
                            <p className="font-medium text-gray-900">{order.shippingName}</p>
                            <p className="text-gray-500 text-xs">{order.shippingCity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-400 text-xs">Total</p>
                            <p className="text-gray-600">₹{order.totalAmount}</p>
                            <p className="text-gray-400 text-xs mt-1">Shipping</p>
                            <p className="text-gray-600">{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</p>
                          </div>
                        </div>

                        {orderItems[order.id] ? (
                          <div className="space-y-3 pt-2 border-t">
                            <p className="text-xs font-medium text-gray-500 pt-3">Items</p>
                            {orderItems[order.id].map((item) => (
                              <div key={item.id} className="flex items-center gap-3">
                                {item.product_image && (
                                  <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.product_name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.unit_price}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">₹{item.quantity * item.unit_price}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-center py-4">
                            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}