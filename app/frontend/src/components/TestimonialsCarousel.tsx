import { useState, useCallback, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Testimonial } from "@/lib/api";

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Health Enthusiast",
    content: "El Crunchae's freeze-dried fruits are a game-changer! The strawberries taste just like fresh ones but with an amazing crunch.",
    rating: 5,
    avatarUrl: "",
    isFeatured: true,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    role: "Fitness Trainer",
    content: "I recommend El Crunchae products to all my clients. The nutrient retention is impressive and they're perfect for post-workout snacking.",
    rating: 5,
    avatarUrl: "",
    isFeatured: true,
  },
  {
    id: 3,
    name: "Anita Desai",
    role: "Working Professional",
    content: "The freeze-dried biryani is a lifesaver for my office lunches. Just add hot water and you have a delicious, authentic meal.",
    rating: 4,
    avatarUrl: "",
    isFeatured: true,
  },
  {
    id: 4,
    name: "Vikram Patel",
    role: "Adventure Traveler",
    content: "Perfect for trekking! Lightweight, nutritious, and tastes amazing. The mango slices are my absolute favorite trail snack.",
    rating: 5,
    avatarUrl: "",
    isFeatured: true,
  },
  {
    id: 5,
    name: "Sneha Reddy",
    role: "Mom of Two",
    content: "My kids love the freeze-dried sweet corn and blueberries. Finally, a healthy snack they actually enjoy eating!",
    rating: 5,
    avatarUrl: "",
    isFeatured: true,
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const item = testimonials[current];
  if (!item) return null;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            What Our Customers Say
          </h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-[#FAFAF5] rounded-2xl p-8 md:p-10 text-center"
            >
              <Quote className="w-10 h-10 text-green-200 mx-auto mb-4" />
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 italic">
                &ldquo;{item.content}&rdquo;
              </p>
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < item.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(item.name)}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                  {item.role && (
                    <p className="text-xs text-gray-500">{item.role}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-green-700 w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}