import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronRight,
  Package,
  Globe,
  Tag,
  Users,
  TrendingUp,
  Shield,
  CheckCircle,
  Building,
  Handshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BIZ_IMG = "/assets/sections/business-hero.png";

const services = [
  {
    icon: Tag,
    title: "White Labeling",
    desc: "Launch your own freeze-dried brand with our manufacturing expertise. We handle production, you build the brand.",
    features: [
      "Custom branding & packaging design",
      "Flexible MOQ for startups",
      "Full regulatory compliance support",
      "Private label product development",
      "Quality assurance at every step",
    ],
  },
  {
    icon: Globe,
    title: "Trading & Export",
    desc: "We export premium freeze-dried products to international markets with full documentation and compliance.",
    features: [
      "Export to 20+ countries",
      "International food safety certifications",
      "Custom packaging for global markets",
      "Competitive bulk pricing",
      "End-to-end logistics support",
    ],
  },
  {
    icon: Building,
    title: "Bulk Manufacturing",
    desc: "Large-scale freeze-drying services for businesses, institutions, and government agencies.",
    features: [
      "High-capacity production lines",
      "Custom recipe development",
      "Institutional & defense supply",
      "Emergency food supply programs",
      "Consistent quality at scale",
    ],
  },
];

const whyPartner = [
  {
    icon: Shield,
    title: "Certified Facility",
    desc: "FSSAI, ISO 22000, HACCP, GMP certified manufacturing unit",
  },
  {
    icon: TrendingUp,
    title: "Growing Market",
    desc: "Freeze-dried food market growing at 8.3% CAGR globally",
  },
  {
    icon: Users,
    title: "Expert Team",
    desc: "Experienced food scientists and quality control professionals",
  },
  {
    icon: Handshake,
    title: "Flexible Terms",
    desc: "Customizable MOQ, pricing, and partnership models",
  },
];

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={BIZ_IMG}
            alt="Business partnership"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Business</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-2xl">
            Partner with El Crunchae
          </h1>
          <p className="text-green-200 max-w-xl text-lg">
            White labeling, trading, export & bulk manufacturing — grow your
            business with India's premium freeze-dried food manufacturer.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Business Solutions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
                  <service.icon className="w-7 h-7 text-green-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">
                  {service.desc}
                </p>
                <ul className="space-y-2.5">
                  {service.features.map((f, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              The El Crunchae Advantage
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyPartner.map((item, i) => (
              <div
                key={i}
                className="text-center bg-[#FAFAF5] rounded-2xl p-6 border border-gray-100"
              >
                <div className="w-14 h-14 rounded-full bg-green-800 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              How White Labeling Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Consultation",
                desc: "Share your vision, target market, and product requirements with our team.",
              },
              {
                step: "02",
                title: "Product Development",
                desc: "We develop custom formulations and packaging designs for your brand.",
              },
              {
                step: "03",
                title: "Production",
                desc: "Manufacturing begins with strict quality control at every stage.",
              },
              {
                step: "04",
                title: "Delivery",
                desc: "Finished products are delivered to your warehouse or directly to customers.",
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 h-full">
                  <span className="text-4xl font-bold text-green-100">
                    {item.step}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mt-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-green-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-16 md:py-24 bg-green-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Business Inquiry
            </h2>
            <p className="text-green-200 mt-3">
              Interested in white labeling, bulk orders, or export? Fill out the
              form and our team will get back to you within 24 hours.
            </p>
          </div>

          <form
            className="bg-white rounded-2xl p-6 md:p-10 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                "https://wa.me/919876543210?text=Hi, I'm interested in El Crunchae business partnership.",
                "_blank"
              );
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Full Name *
                </label>
                <Input
                  placeholder="Your full name"
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Company Name
                </label>
                <Input
                  placeholder="Your company name"
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Phone *
                </label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="rounded-xl"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Service Interested In *
              </label>
              <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Select a service</option>
                <option value="whitelabel">White Labeling / Reselling</option>
                <option value="export">Trading & Export</option>
                <option value="bulk">Bulk Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Message
              </label>
              <Textarea
                placeholder="Tell us about your requirements, target market, expected volumes..."
                className="rounded-xl min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-xl bg-green-700 hover:bg-green-800 text-white"
            >
              Submit Inquiry
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}