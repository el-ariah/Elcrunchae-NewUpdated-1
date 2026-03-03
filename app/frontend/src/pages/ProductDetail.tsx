import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  ArrowLeft,
  Leaf,
  Clock,
  Shield,
  Star,
  Check,
  ShoppingCart,
  Loader2,
  Minus,
  Plus,
  User,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  fetchProducts,
  fetchProductBySlug,
  fetchReviewsByProductId,
  createReview,
  type Product,
  type Review,
} from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  sanitizeInput,
  validateReviewForm,
  getSafeErrorMessage,
  checkRateLimit,
  sanitizeHTML,
} from "@/lib/security";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

function StarRating({
  rating,
  onRate,
  size = "sm",
}: {
  rating: number;
  onRate?: (r: number) => void;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const sizeClass = size === "md" ? "w-6 h-6" : "w-4 h-4";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onRate?.(i)}
          onMouseEnter={() => onRate && setHover(i)}
          onMouseLeave={() => onRate && setHover(0)}
          className={onRate ? "cursor-pointer" : "cursor-default"}
          disabled={!onRate}
        >
          <Star
            className={`${sizeClass} ${
              i <= (hover || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  // Sanitize user-generated content before rendering
  const safeName = sanitizeHTML(review.reviewerName);
  const safeText = sanitizeHTML(review.reviewText);
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
            <User className="w-4 h-4 text-green-700" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{safeName}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <StarRating rating={Math.max(1, Math.min(5, review.rating))} />
      </div>
      {safeText && (
        <p className="text-sm text-gray-600 leading-relaxed mt-2">{safeText}</p>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const { user, setShowLoginModal } = useAuth();

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewerName, setNewReviewerName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setQuantity(1);
      setShowReviewForm(false);
      setNewRating(0);
      setNewReviewText("");
      const p = await fetchProductBySlug(id || "");
      setProduct(p);

      if (p) {
        const all = await fetchProducts();
        const related = all
          .filter((rp) => rp.category === p.category && rp.id !== p.id && rp.isActive !== false)
          .slice(0, 4);
        setRelatedProducts(related);

        // Load reviews
        if (p.dbId) {
          setReviewsLoading(true);
          const revs = await fetchReviewsByProductId(p.dbId);
          setReviews(revs);
          setReviewsLoading(false);
        }
      }
      setLoading(false);
    };
    loadProduct();
  }, [id]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0 ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart!`, {
      action: {
        label: "View Cart",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  const handleSubmitReview = async () => {
    if (!product?.dbId) return;

    // Rate limit review submissions
    if (!checkRateLimit("submit_review", 3, 120000)) {
      toast.error("Too many review attempts. Please wait a moment.");
      return;
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(newReviewerName, 100);
    const sanitizedText = sanitizeInput(newReviewText, 1000);

    // Validate
    const validationError = validateReviewForm({
      rating: newRating,
      reviewerName: sanitizedName,
      reviewText: sanitizedText,
    });
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const review = await createReview({
        product_id: product.dbId,
        rating: Math.max(1, Math.min(5, Math.floor(newRating))),
        review_text: sanitizedText,
        reviewer_name: sanitizedName,
      });
      if (review) {
        setReviews((prev) => [review, ...prev]);
        setNewRating(0);
        setNewReviewText("");
        setNewReviewerName("");
        setShowReviewForm(false);
        toast.success("Review submitted! Thank you.");
      } else {
        toast.error("Failed to submit review. Please try again.");
      }
    } catch (err: any) {
      toast.error(getSafeErrorMessage(err, "Failed to submit review."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAFAF5]">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/products">
            <Button className="rounded-full bg-green-800 hover:bg-green-900 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-20 md:pt-24 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-green-700">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/products" className="hover:text-green-700">Products</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/products?category=${product.category}`} className="hover:text-green-700">
              {product.categoryLabel}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Image */}
            <motion.div
              className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 flex items-center justify-center"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="relative">
                {product.badge && (
                  <span className="absolute -top-2 -left-2 z-10 text-xs font-bold uppercase px-3 py-1.5 rounded-full bg-green-800 text-white">
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.boxImage || product.image}
                  alt={product.name}
                  className="w-full max-w-md h-auto object-contain"
                />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.span
                variants={fadeInUp}
                className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full inline-block ${
                  product.category === "fruits"
                    ? "bg-green-100 text-green-700"
                    : product.category === "vegetables"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.categoryLabel}
              </motion.span>

              <motion.h1
                variants={fadeInUp}
                className="text-2xl md:text-4xl font-bold text-gray-900 mt-4 mb-3"
              >
                {product.name}
              </motion.h1>

              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
                <StarRating rating={Math.round(avgRating)} />
                <span className="text-sm text-gray-500">
                  ({avgRating > 0 ? avgRating.toFixed(1) : "No ratings"} / 5 · {reviews.length} review{reviews.length !== 1 ? "s" : ""})
                </span>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-green-800">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-400 line-through">₹{product.originalPrice}</span>
                    <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </motion.div>

              <motion.p variants={fadeInUp} className="text-gray-600 leading-relaxed mb-6">
                {product.longDescription}
              </motion.p>

              {/* Quick Info */}
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="text-sm font-semibold text-gray-900">{product.weight}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-green-50 rounded-xl p-3">
                  <Clock className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Shelf Life</p>
                    <p className="text-sm font-semibold text-gray-900">{product.shelfLife}</p>
                  </div>
                </div>
              </motion.div>

              {/* Nutrition Highlights */}
              <motion.div variants={fadeInUp} className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Nutrition Highlights</h3>
                <div className="flex flex-wrap gap-2">
                  {product.nutritionHighlights.map((nh) => (
                    <span
                      key={nh}
                      className="flex items-center gap-1.5 text-sm bg-white border border-green-200 text-green-800 px-3 py-1.5 rounded-full"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {nh}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* How to Use */}
              <motion.div
                variants={fadeInUp}
                className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100"
              >
                <h3 className="font-semibold text-amber-900 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  How to Use
                </h3>
                <p className="text-sm text-amber-800">{product.howToUse}</p>
              </motion.div>

              {/* Quantity + Add to Cart */}
              <motion.div variants={fadeInUp} className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1 rounded-xl bg-green-700 hover:bg-green-800 text-white gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart — ₹{product.price * quantity}
                  </Button>
                  <Link to="/business" className="flex-1">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full rounded-xl border-green-800 text-green-800 hover:bg-green-50"
                    >
                      Bulk / White Label
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Reviews ({reviews.length})
              </h2>
              {user ? (
                <Button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2"
                >
                  <Star className="w-4 h-4" />
                  {showReviewForm ? "Cancel" : "Write a Review"}
                </Button>
              ) : (
                <Button
                  onClick={() => setShowLoginModal(true)}
                  variant="outline"
                  className="rounded-full border-green-800 text-green-800 hover:bg-green-50 gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In to Review
                </Button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && user && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#FAFAF5] rounded-2xl border border-gray-100 p-6 mb-8"
              >
                <h3 className="font-semibold text-gray-900 mb-4">Write Your Review</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Your Rating *
                    </label>
                    <StarRating rating={newRating} onRate={setNewRating} size="md" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Your Name *
                    </label>
                    <Input
                      value={newReviewerName}
                      onChange={(e) => setNewReviewerName(e.target.value)}
                      placeholder="Enter your name"
                      className="rounded-xl"
                      maxLength={100}
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      Your Review (optional)
                    </label>
                    <Textarea
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      className="rounded-xl resize-none"
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{newReviewText.length}/1000</p>
                  </div>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting || newRating === 0}
                    className="rounded-full bg-green-700 hover:bg-green-800 text-white gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Submit Review
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Rating Summary + Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Summary */}
              <div className="bg-[#FAFAF5] rounded-2xl p-6 border border-gray-100">
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold text-gray-900">
                    {avgRating > 0 ? avgRating.toFixed(1) : "—"}
                  </p>
                  <StarRating rating={Math.round(avgRating)} />
                  <p className="text-sm text-gray-500 mt-1">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="space-y-2">
                  {ratingDistribution.map((rd) => (
                    <div key={rd.star} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-gray-600">{rd.star}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${rd.pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-gray-400 text-xs">{rd.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="md:col-span-3">
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-green-700" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 bg-[#FAFAF5] rounded-2xl border border-gray-100">
                    <Star className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No reviews yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Be the first to review this product!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-[#FAFAF5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              Related Products
            </motion.h2>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerContainer}
            >
              {relatedProducts.map((rp) => (
                <motion.div key={rp.id} variants={scaleIn}>
                  <Link
                    to={`/products/${rp.id}`}
                    className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
                  >
                    <div className="p-4 pb-0">
                      <img
                        src={rp.boxImage || rp.image}
                        alt={rp.name}
                        className="w-full h-36 object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                        {rp.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-base font-bold text-green-800">₹{rp.price}</span>
                        {rp.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{rp.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}