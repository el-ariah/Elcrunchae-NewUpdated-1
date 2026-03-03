import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchProducts, categories, type Product } from "@/lib/api";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then((data) => {
      setProducts(data.filter((p) => p.isActive !== false));
      setLoading(false);
    });
  }, []);

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category === cat.id).length,
  }));

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery, products]);

  const setCategory = (cat: string) => {
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Hero */}
      <motion.section
        className="pt-24 pb-8 md:pt-32 md:pb-12 bg-gradient-to-br from-green-800 to-green-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Products</span>
          </div>
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Our Products
          </motion.h1>
          <motion.p
            className="text-green-200 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Explore our complete range of premium freeze-dried fruits,
            vegetables, and ready-to-eat meals.
          </motion.p>
        </div>
      </motion.section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-40 bg-white/95 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Tabs */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1">
              <button
                onClick={() => setCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === "all"
                    ? "bg-green-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({products.length})
              </button>
              {categoriesWithCount.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat.id
                      ? "bg-green-800 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.name.replace("Freeze Dried ", "")} ({cat.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-green-700" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600">
                No products found
              </h3>
              <p className="text-gray-400 mt-1">
                Try adjusting your search or filter
              </p>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => {
                  setCategory("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              key={activeCategory + searchQuery}
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={scaleIn}>
                  <Link
                    to={`/products/${product.id}`}
                    className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 block"
                  >
                    <div className="relative p-4 pb-0 bg-gradient-to-b from-gray-50 to-white">
                      {product.badge && (
                        <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-green-800 text-white">
                          {product.badge}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-600">
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      )}
                      <img
                        src={product.boxImage || product.image}
                        alt={product.name}
                        className="w-full h-40 md:h-52 object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
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
                      <h3 className="font-semibold text-gray-900 mt-1 text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <div>
                          <span className="text-lg font-bold text-green-800">
                            ₹{product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1.5">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {product.weight}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}