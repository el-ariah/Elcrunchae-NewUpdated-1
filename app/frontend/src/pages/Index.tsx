import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, Shield, Clock, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import { fetchProducts, categories, type Product } from "@/lib/api";
import { getSiteSettings } from "@/lib/siteSettings";

const FLATLAY_BG = "/assets/sections/flatlay-bg.png";
const HERO_BG = "/assets/hero-background.png";

const whyChoose = [
  {
    icon: Leaf,
    title: "100% Natural",
    desc: "No preservatives, no additives, no artificial colors. Pure nature in every bite.",
  },
  {
    icon: Shield,
    title: "~91% Nutrients Retained",
    desc: "Advanced freeze-drying preserves most vitamins, minerals, and antioxidants.",
  },
  {
    icon: Clock,
    title: "2 Year Shelf Life",
    desc: "Our products stay fresh and nutritious for up to 2 years without refrigeration.",
  },
  {
    icon: Truck,
    title: "Pan-India & Export",
    desc: "We deliver across India and export globally with reliable logistics.",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const settings = useMemo(() => getSiteSettings(), []);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data.filter((p) => p.isActive !== false));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const featuredProducts = products.filter((p) => p.badge);

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category === cat.id).length,
  }));

  // Dynamic overlay opacity based on admin settings + device
  const overlayOpacity = isMobile
    ? settings.heroMobileOverlayOpacity / 100
    : settings.heroOverlayOpacity / 100;

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Hero Section — Responsive with admin-configurable overlay */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        {/* Background image with responsive focal point */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Freeze dried fruits"
            className="w-full h-full object-cover object-center md:object-center"
            style={{ objectPosition: isMobile ? "60% center" : "center center" }}
            fetchPriority="high"
          />
          {/* Dynamic gradient overlay — opacity controlled by admin settings */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"
            style={{ opacity: overlayOpacity }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"
            style={{ opacity: isMobile ? overlayOpacity * 0.85 : overlayOpacity * 0.6 }}
          />
          {/* Extra mobile bottom gradient for stat readability */}
          {isMobile && (
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
          )}
        </div>

        {/* Decorative glow accents */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-20 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-amber-500/8 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 border border-white/15 shadow-lg"
            >
              <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              <span className="text-xs sm:text-sm text-green-300 font-medium">
                100% Natural • No Preservatives • Made in India
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight mb-4 sm:mb-6 drop-shadow-2xl"
            >
              Pure Crunch,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                Pure Joy
              </span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-lg drop-shadow-lg"
            >
              Premium freeze-dried fruits, vegetables & ready meals by El Crunchae.
              Retaining ~91% nutrients with an irresistible crunch. From farm to
              your table — naturally.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-green-600 hover:bg-green-700 text-white px-8 text-base gap-2 shadow-xl shadow-green-900/50"
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/business">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 text-base font-semibold gap-2 shadow-xl shadow-amber-900/30"
                >
                  White Label Partner
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="flex gap-6 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15"
            >
              {[
                { value: "20+", label: "Products" },
                { value: "~91%", label: "Nutrients Retained" },
                { value: "2yr", label: "Shelf Life" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl sm:text-3xl font-bold text-white drop-shadow-lg">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-sm text-gray-300">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Our Range
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
              From crispy fruits to instant meals — discover the perfect
              freeze-dried products for your lifestyle.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {categoriesWithCount.map((cat) => {
              const catProducts = products.filter(
                (p) => p.category === cat.id
              );
              const displayProduct = catProducts[0];
              return (
                <motion.div key={cat.id} variants={scaleIn}>
                  <Link
                    to={`/products?category=${cat.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <div
                      className={`h-40 sm:h-48 bg-gradient-to-br ${cat.color} p-4 sm:p-6 flex items-center justify-between`}
                    >
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          {cat.name}
                        </h3>
                        <p className="text-white/80 text-sm mt-1">
                          {cat.count} products
                        </p>
                      </div>
                      {displayProduct && (
                        <img
                          src={displayProduct.image}
                          alt={displayProduct.name}
                          className="h-24 w-24 sm:h-32 sm:w-32 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-sm text-gray-600">{cat.description}</p>
                      <div className="flex items-center gap-1 mt-3 text-green-700 font-medium text-sm group-hover:gap-2 transition-all">
                        Shop Now <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-end justify-between mb-8 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div>
              <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
                Top Picks
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                Featured Products
              </h2>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-1 text-green-700 font-medium hover:gap-2 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={scaleIn}>
                  <Link
                    to={`/products/${product.id}`}
                    className="group bg-[#FAFAF5] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <div className="relative p-3 sm:p-4 pb-0">
                      {product.badge && (
                        <span className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 text-[10px] font-bold uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-green-800 text-white">
                          {product.badge}
                        </span>
                      )}
                      <img
                        src={product.boxImage || product.image}
                        alt={product.name}
                        className="w-full h-32 sm:h-40 md:h-48 object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider ${
                          product.category === "fruits"
                            ? "text-green-600"
                            : product.category === "vegetables"
                            ? "text-orange-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.categoryLabel}
                      </span>
                      <h3 className="font-semibold text-gray-900 mt-1 text-xs sm:text-sm md:text-base line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-base sm:text-lg font-bold text-green-800">
                          ₹{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs sm:text-sm text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1">{product.weight}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <div className="md:hidden text-center mt-6 sm:mt-8">
            <Link to="/products">
              <Button
                variant="outline"
                className="rounded-full border-green-800 text-green-800"
              >
                View All Products <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Why El Crunchae
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              The El Crunchae Difference
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {whyChoose.map((item, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon className="w-5 h-5 sm:w-7 sm:h-7 text-green-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg">{item.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Preview with Flatlay */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={FLATLAY_BG}
            alt="Products flatlay"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <motion.div
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <div className="max-w-2xl">
            <motion.span
              variants={fadeInUp}
              className="text-sm font-semibold text-green-400 uppercase tracking-wider"
            >
              Our Story
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 mb-4 sm:mb-6"
            >
              From Nature to Your Table
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-300 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
              El Crunchae was born from a passion for preserving nature&apos;s
              goodness in its purest form. Using state-of-the-art freeze-drying
              technology, we transform fresh Indian fruits, vegetables, and
              traditional recipes into lightweight, shelf-stable superfoods.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-gray-300 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              Whether you&apos;re a health-conscious snacker, a busy professional, an
              outdoor adventurer, or a business looking for premium white-label
              products — El Crunchae delivers nature&apos;s best, preserved
              perfectly.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/about">
                <Button
                  size="lg"
                  className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2"
                >
                  Learn Our Story <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <motion.section
        className="py-12 sm:py-16 md:py-24 bg-gradient-to-r from-green-800 to-green-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Ready to Partner with El Crunchae?
          </h2>
          <p className="text-green-200 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Whether you want to buy our products, start white labeling, or
            explore export opportunities — we&apos;re here to help you grow.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
            <Link to="/products">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full bg-orange-600 hover:bg-orange-700 text-white px-8 gap-2"
              >
                Shop Products <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/business">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full bg-amber-500 hover:bg-amber-600 text-gray-900 px-8 font-semibold gap-2"
              >
                Business Inquiry
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}