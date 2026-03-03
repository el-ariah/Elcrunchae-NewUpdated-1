import { Link } from "react-router-dom";
import { ChevronRight, Calendar, Clock, ArrowRight, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const blogPosts = [
  {
    id: 1,
    title: "What is Freeze Drying? The Science Behind El Crunchae",
    excerpt:
      "Discover how freeze-drying technology preserves 97% of nutrients while removing 98% of moisture, creating lightweight, shelf-stable superfoods that last 25+ years.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop",
    category: "Technology",
    date: "Feb 20, 2026",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "5 Creative Ways to Use Freeze-Dried Fruits in Your Kitchen",
    excerpt:
      "From smoothie bowls to baking and trail mixes — explore delicious recipes using El Crunchae freeze-dried fruits that your whole family will love.",
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop",
    category: "Recipes",
    date: "Feb 15, 2026",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Why Freeze-Dried Food is the Future of Emergency Preparedness",
    excerpt:
      "With a shelf life of 25+ years and no refrigeration needed, freeze-dried food is the ultimate solution for emergency kits, camping, and disaster preparedness.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    category: "Lifestyle",
    date: "Feb 10, 2026",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "From Farm to Freeze: How We Source the Freshest Ingredients",
    excerpt:
      "Learn about our direct partnerships with Indian farmers and how we ensure only the freshest, peak-ripeness produce makes it into our freeze-drying chambers.",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&h=400&fit=crop",
    category: "Behind the Scenes",
    date: "Feb 5, 2026",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Freeze-Dried vs Dehydrated: What's the Difference?",
    excerpt:
      "Not all preserved foods are created equal. Understand the key differences between freeze-drying and dehydration in terms of nutrition, taste, and texture.",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop",
    category: "Education",
    date: "Jan 28, 2026",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "White Labeling with El Crunchae: A Complete Guide for Brands",
    excerpt:
      "Looking to launch your own freeze-dried food brand? Learn how our white-label manufacturing service can help you bring premium products to market quickly.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    category: "Business",
    date: "Jan 20, 2026",
    readTime: "7 min read",
  },
];

const videos = [
  {
    id: 1,
    title: "Inside Our Freeze-Drying Facility",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=340&fit=crop",
    duration: "3:45",
    description: "Take a virtual tour of our state-of-the-art freeze-drying manufacturing unit in Bangalore.",
  },
  {
    id: 2,
    title: "How Freeze-Dried Strawberries Are Made",
    thumbnail: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=340&fit=crop",
    duration: "2:30",
    description: "Watch the journey of fresh strawberries as they transform into crispy, nutrient-rich snacks.",
  },
  {
    id: 3,
    title: "El Crunchae at India Food Expo 2026",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=340&fit=crop",
    duration: "5:12",
    description: "Highlights from our showcase at the India Food Expo — product demos, tastings, and more.",
  },
];

const socialLinks = [
  {
    name: "Instagram",
    handle: "@elcrunchae",
    url: "https://instagram.com/elcrunchae",
    color: "from-purple-500 to-pink-500",
    icon: "📸",
    followers: "12.5K",
    desc: "Behind-the-scenes, recipes & product launches",
  },
  {
    name: "Facebook",
    handle: "El Crunchae",
    url: "https://facebook.com/elcrunchae",
    color: "from-blue-600 to-blue-500",
    icon: "👍",
    followers: "8.2K",
    desc: "Community updates, offers & events",
  },
  {
    name: "YouTube",
    handle: "El Crunchae",
    url: "https://youtube.com/@elcrunchae",
    color: "from-red-600 to-red-500",
    icon: "🎬",
    followers: "3.1K",
    desc: "Factory tours, recipes & product reviews",
  },
  {
    name: "Twitter / X",
    handle: "@elcrunchae",
    url: "https://twitter.com/elcrunchae",
    color: "from-gray-800 to-gray-700",
    icon: "🐦",
    followers: "5.7K",
    desc: "News, health tips & industry insights",
  },
  {
    name: "LinkedIn",
    handle: "El-Ariah Preserves",
    url: "https://linkedin.com/company/el-ariah-preserves",
    color: "from-blue-700 to-blue-600",
    icon: "💼",
    followers: "2.4K",
    desc: "Business updates, partnerships & careers",
  },
  {
    name: "WhatsApp",
    handle: "+91 81519 77997",
    url: "https://wa.me/918151977997",
    color: "from-green-600 to-green-500",
    icon: "💬",
    followers: "Direct",
    desc: "Quick orders, support & inquiries",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 bg-gradient-to-br from-green-800 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Blog & Media</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">Blog & Media</h1>
          <p className="text-green-200 max-w-xl text-lg">
            Explore articles, videos, and updates from the world of freeze-dried food innovation.
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex items-center justify-between mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest Articles</h2>
              <p className="text-gray-500 mt-1">Insights, recipes, and stories from El Crunchae</p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-xs font-semibold bg-green-800 text-white px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-green-700 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <span className="text-sm font-semibold text-green-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Videos */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Videos</h2>
            <p className="text-gray-500 mt-1">Watch our factory tours, product demos, and more</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {videos.map((video) => (
              <motion.div
                key={video.id}
                variants={fadeInUp}
                className="bg-[#FAFAF5] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-green-800 ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                    {video.duration}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Follow Us Everywhere</h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              Stay connected with El Crunchae across all platforms for recipes, offers, behind-the-scenes content, and more.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${social.color} flex items-center justify-center text-2xl`}
                  >
                    {social.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                      {social.name}
                    </h3>
                    <p className="text-xs text-gray-500">{social.handle}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm font-bold text-green-700">{social.followers}</p>
                    <p className="text-[10px] text-gray-400">followers</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{social.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-700 group-hover:gap-2 transition-all">
                  Follow <ExternalLink className="w-3 h-3" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-green-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Want to Collaborate?
          </h2>
          <p className="text-green-200 mb-6 max-w-lg mx-auto">
            We're always looking for food bloggers, influencers, and brands to partner with. Let's create something amazing together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button size="lg" className="rounded-full bg-white text-green-800 hover:bg-green-50 px-8 gap-2">
                Get In Touch <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/business">
              <Button size="lg" variant="outline" className="rounded-full border-white text-white hover:bg-white/10 px-8">
                White Label Partnership
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}