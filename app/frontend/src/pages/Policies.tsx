import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight, Truck, RotateCcw, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tabs = [
  { id: "shipping", label: "Shipping Policy", icon: Truck },
  { id: "refund", label: "Refund & Returns", icon: RotateCcw },
  { id: "terms", label: "Terms of Service", icon: FileText },
];

function ShippingPolicy() {
  return (
    <div className="prose prose-green max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Policy</h2>
      <p className="text-gray-600 mb-4">Last updated: February 2026</p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Domestic Shipping (India)</h3>
      <ul className="space-y-2 text-gray-600 list-disc pl-5">
        <li><strong>Free Shipping:</strong> On all orders above ₹499.</li>
        <li><strong>Standard Shipping:</strong> ₹49 flat rate for orders below ₹499.</li>
        <li><strong>Processing Time:</strong> Orders are processed within 1-2 business days.</li>
        <li><strong>Delivery Time:</strong> 3-7 business days depending on your location.</li>
        <li><strong>Tracking:</strong> A tracking number will be shared via email/SMS once your order is shipped.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">International Shipping</h3>
      <ul className="space-y-2 text-gray-600 list-disc pl-5">
        <li>International shipping is available for bulk and white-label orders.</li>
        <li>Shipping charges and delivery times vary by destination.</li>
        <li>Please contact us at <a href="mailto:christeena@el-ariah.com" className="text-green-700 hover:underline">christeena@el-ariah.com</a> for international shipping quotes.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Packaging</h3>
      <p className="text-gray-600">
        All products are carefully packed in food-grade, nitrogen-flushed packaging to ensure maximum freshness during transit. Our freeze-dried products are lightweight and durable, minimizing the risk of damage during shipping.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Order Issues</h3>
      <p className="text-gray-600">
        If your order is delayed, damaged, or lost during transit, please contact us within 48 hours of the expected delivery date at <a href="mailto:christeena@el-ariah.com" className="text-green-700 hover:underline">christeena@el-ariah.com</a> or call <a href="tel:+918151977997" className="text-green-700 hover:underline">+91 8151977997</a>.
      </p>
    </div>
  );
}

function RefundPolicy() {
  return (
    <div className="prose prose-green max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund & Return Policy</h2>
      <p className="text-gray-600 mb-4">Last updated: February 2026</p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Return Eligibility</h3>
      <ul className="space-y-2 text-gray-600 list-disc pl-5">
        <li>Returns are accepted within <strong>7 days</strong> of delivery.</li>
        <li>Products must be <strong>unopened and in original packaging</strong>.</li>
        <li>Perishable food items that have been opened cannot be returned for hygiene and safety reasons.</li>
        <li>Damaged or defective products can be returned regardless of opening status — please provide photos.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">How to Initiate a Return</h3>
      <ol className="space-y-2 text-gray-600 list-decimal pl-5">
        <li>Email us at <a href="mailto:christeena@el-ariah.com" className="text-green-700 hover:underline">christeena@el-ariah.com</a> with your order number and reason for return.</li>
        <li>Our team will review your request within 24-48 hours.</li>
        <li>If approved, we'll provide return shipping instructions.</li>
        <li>Once we receive and inspect the returned product, your refund will be processed.</li>
      </ol>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Refund Process</h3>
      <ul className="space-y-2 text-gray-600 list-disc pl-5">
        <li>Refunds are processed within <strong>5-7 business days</strong> after we receive the returned product.</li>
        <li>Refunds will be credited to the original payment method.</li>
        <li>Shipping charges are non-refundable unless the return is due to our error.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Exchanges</h3>
      <p className="text-gray-600">
        We currently do not offer direct exchanges. Please return the original product and place a new order for the desired item.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Damaged Products</h3>
      <p className="text-gray-600">
        If you receive a damaged or defective product, please contact us within 48 hours with photos of the damage. We will arrange a replacement or full refund at no extra cost.
      </p>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="prose prose-green max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of Service</h2>
      <p className="text-gray-600 mb-4">Last updated: February 2026</p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">1. General</h3>
      <p className="text-gray-600">
        By accessing and using the El Crunchae website (operated by El-Ariah Preserves Pty Ltd), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">2. Products & Pricing</h3>
      <ul className="space-y-2 text-gray-600 list-disc pl-5">
        <li>All product descriptions, images, and prices are as accurate as possible but may vary slightly.</li>
        <li>Prices are listed in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</li>
        <li>We reserve the right to modify prices without prior notice.</li>
        <li>Product availability is subject to stock levels.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">3. Orders & Payment</h3>
      <ul className="space-y-2 text-gray-600 list-disc pl-5">
        <li>By placing an order, you confirm that all information provided is accurate.</li>
        <li>Payment is processed securely through Stripe. We do not store your payment details.</li>
        <li>We reserve the right to cancel orders due to pricing errors, stock issues, or suspected fraud.</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">4. Intellectual Property</h3>
      <p className="text-gray-600">
        All content on this website — including logos, text, images, and product designs — is the property of El-Ariah Preserves Pty Ltd and protected by intellectual property laws. Unauthorized use is prohibited.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">5. Limitation of Liability</h3>
      <p className="text-gray-600">
        El-Ariah Preserves Pty Ltd shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability shall not exceed the amount paid for the specific product in question.
      </p>

      <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">6. Contact</h3>
      <p className="text-gray-600">
        For any questions regarding these terms, please contact us at <a href="mailto:christeena@el-ariah.com" className="text-green-700 hover:underline">christeena@el-ariah.com</a>.
      </p>
    </div>
  );
}

export default function PoliciesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "shipping";

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      <section className="pt-24 pb-6 md:pt-32 md:pb-8 bg-gradient-to-br from-green-800 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Policies</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {tabs.find((t) => t.id === activeTab)?.label || "Policies"}
          </h1>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "bg-green-800 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10">
            {activeTab === "shipping" && <ShippingPolicy />}
            {activeTab === "refund" && <RefundPolicy />}
            {activeTab === "terms" && <TermsOfService />}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}