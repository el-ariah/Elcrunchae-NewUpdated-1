import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Snowflake,
  Package,
  Truck,
  Award,
  Heart,
  Globe,
  ChevronRight,
  Eye,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { assetPath } from "@/lib/assetPath";

const MFG_IMG = "/assets/sections/about-manufacturing.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const processSteps = [
  {
    icon: Leaf,
    title: "Sourcing",
    desc: "We source the freshest fruits, vegetables, and ingredients directly from trusted Indian farms at peak ripeness.",
  },
  {
    icon: Snowflake,
    title: "Flash Freezing",
    desc: "Products are rapidly frozen to -40°C to lock in cellular structure, nutrients, and natural flavors.",
  },
  {
    icon: Package,
    title: "Freeze Drying",
    desc: "Through sublimation in vacuum chambers, ice is converted directly to vapor, removing 98% moisture while preserving 97% nutrients.",
  },
  {
    icon: Award,
    title: "Quality Check",
    desc: "Every batch undergoes rigorous quality testing for taste, texture, moisture content, and microbiological safety.",
  },
  {
    icon: Package,
    title: "Packaging",
    desc: "Products are sealed in nitrogen-flushed, food-grade packaging to ensure maximum freshness and 25+ year shelf life.",
  },
  {
    icon: Truck,
    title: "Delivery",
    desc: "Shipped across India and exported globally with temperature-controlled logistics and reliable delivery partners.",
  },
];

const certifications = [
  { name: "FSSAI", desc: "Food Safety & Standards Authority of India" },
  { name: "ISO 22000", desc: "Food Safety Management System" },
  { name: "HACCP", desc: "Hazard Analysis Critical Control Points" },
  { name: "GMP", desc: "Good Manufacturing Practices" },
];

const values = [
  {
    icon: Heart,
    title: "Purity",
    desc: "No preservatives, no additives, no artificial colors — ever. Just pure, natural food.",
  },
  {
    icon: Award,
    title: "Quality",
    desc: "Every product meets international food safety standards with rigorous testing at every stage.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    desc: "Reducing food waste through preservation technology while supporting local farming communities.",
  },
  {
    icon: Globe,
    title: "Innovation",
    desc: "Continuously advancing our freeze-drying technology to deliver better taste and nutrition.",
  },
];

const teamMembers = [
  {
    name: "Christeena JayaPrabhu",
    role: "Founder & CEO",
    bio: "19+ years of experience in business operations. Visionary leader driving El Crunchae's mission to revolutionize freeze-dried food in India and globally.",
    image: assetPath("/assets/team/team_member_0.png"),
  },
  {
    name: "Nischitha Krishnamurthy",
    role: "Director & CMO",
    bio: "8+ years of experience in IT. Strategic marketing expert building the El Crunchae brand across domestic and international markets.",
    image: assetPath("/assets/team/team_member_1.jpg"),
  },
  {
    name: "Naveen S Yeshodara",
    role: "Advisory Board",
    bio: "20+ years of experience in IT & Pre-Sales. Seasoned advisor providing strategic guidance on business growth and market expansion.",
    image: assetPath("/assets/team/team_member_2.jpg"),
  },
  {
    name: "Manikumar Lakkaraju",
    role: "Advisory Board & Mentor",
    bio: "Industry mentor with deep expertise in food technology, business development, and strategic advisory.",
    image: assetPath("/assets/team/team_member_3.jpg"),
  },
  {
    name: "Dr. Jayram C S",
    role: "Advisory Board",
    bio: "Entomologist & Technology Mentor. Expert advising on freeze-drying innovation and food science research.",
    image: assetPath("/assets/team/team_member_4.jpg"),
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={MFG_IMG}
            alt="Manufacturing facility"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">About Us</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-2xl">
            Nourishing Lives, Empowering Communities
          </h1>
          <p className="text-green-200 max-w-xl text-lg">
            EL-ARIAH PRESERVES is a high-growth enterprise delivering premium organic and health-focused food products, creating sustainable livelihoods for underserved communities.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            {/* Vision */}
            <motion.div
              variants={fadeInUp}
              className="relative bg-gradient-to-br from-green-800 to-green-900 rounded-3xl p-8 md:p-10 text-white overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-green-300" />
                </div>
                <span className="text-sm font-semibold text-green-300 uppercase tracking-wider">
                  Our Vision
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                  Leading the Future of Healthy Food
                </h2>
                <p className="text-green-100 leading-relaxed text-lg">
                  To become a global leading provider of premium, preservative-free freeze-dried foods, making healthy nutrition accessible and convenient for modern lifestyles.
                </p>
              </div>
            </motion.div>

            {/* Mission */}
            <motion.div
              variants={fadeInUp}
              className="relative bg-white rounded-3xl p-8 md:p-10 border-2 border-green-100 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-50 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-green-700" />
                </div>
                <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
                  Our Mission
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">
                  Farm-Fresh to Your Table
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Bridging the gap between farm-fresh nutrition and urban convenience by leveraging advanced freeze-drying technology to reduce food waste and deliver superior taste.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              From a Vision to India's Premium Freeze-Dried Brand
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="lg:col-span-3 space-y-5" variants={fadeInUp}>
              <p className="text-gray-600 leading-relaxed text-lg">
                El Crunchae was born from a simple yet powerful idea: what if
                we could preserve the peak freshness of India's incredible
                fruits, vegetables, and traditional recipes — making them
                available anytime, anywhere, without any preservatives?
              </p>
              <p className="text-gray-600 leading-relaxed">
                Guided by our philosophy of <strong>"Nourishing Lives"</strong>, we create
                nutritious, long shelf-life solutions while generating measurable
                social impact by empowering and creating sustainable livelihoods
                for underserved communities.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our journey began with extensive research into freeze-drying
                technology — a process used by NASA for astronaut food. We
                invested in state-of-the-art equipment and partnered with
                agricultural experts to source the finest produce directly from
                Indian farms.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, El Crunchae stands as a trusted name in freeze-dried
                food manufacturing, white labeling, and export. From crispy
                strawberries to instant chicken biryani, every product carries
                our commitment to purity, nutrition, and incredible taste.
              </p>

              {/* GST Number */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-3 bg-green-50 rounded-xl px-5 py-3 border border-green-100">
                  <span className="text-xs font-semibold text-green-700 uppercase">GST</span>
                  <span className="text-sm text-gray-800 font-mono font-medium">29AAJCE2827R1ZV</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="lg:col-span-2" variants={scaleIn}>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={assetPath("/assets/products/fruits/freeze-dried-fruits.jpeg")}
                  alt="Freeze dried fruits"
                  className="rounded-2xl w-full h-44 object-cover shadow-md"
                />
                <img
                  src={assetPath("/assets/brand/whatsapp-img.jpeg")}
                  alt="El Crunchae products"
                  className="rounded-2xl w-full h-44 object-cover mt-8 shadow-md"
                />
                <img
                  src={assetPath("/assets/products/fruits/full-box.png")}
                  alt="Product packaging"
                  className="rounded-2xl w-full h-44 object-cover bg-white p-2 shadow-md"
                />
                <img
                  src={assetPath("/assets/brand/chatgpt-1.png")}
                  alt="Brand showcase"
                  className="rounded-2xl w-full h-44 object-cover mt-8 shadow-md"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Accreditations & Logos */}
      <section className="py-16 md:py-20 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Trusted & Certified
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Our Accreditations
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Recognized by leading national and international bodies for quality, safety, and innovation.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {[
              { src: assetPath("/assets/accreditations/slide2_logo_1.png"), alt: "Accreditation Badge" },
              { src: assetPath("/assets/accreditations/slide2_logo_3.png"), alt: "Certification Badge" },
              { src: assetPath("/assets/accreditations/slide2_logo_4.png"), alt: "Quality Certification" },
              { src: assetPath("/assets/accreditations/slide2_logo_5.png"), alt: "Standards Certification" },
              { src: assetPath("/assets/accreditations/slide2_logo_7.png"), alt: "Industry Recognition" },
              { src: assetPath("/assets/accreditations/slide2_logo_8.png"), alt: "Partner Certification" },
              { src: assetPath("/assets/accreditations/slide13_logo_4.png"), alt: "Startup India" },
            ].map((logo, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-center"
                style={{ minWidth: 100, minHeight: 80 }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-16 md:max-h-20 w-auto object-contain"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Our Core Values
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-7 h-7 text-green-700" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{v.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Leadership & Advisory
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Experienced Directors with Industry Advisory — driving innovation in freeze-dried food technology.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {teamMembers.map((member, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="bg-[#FAFAF5] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="h-56 bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=166534&color=fff&size=144`;
                    }}
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-gray-900 text-lg">{member.name}</h3>
                  <p className="text-sm text-green-700 font-medium mt-0.5">{member.role}</p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wider">
              How It's Made
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Our Freeze-Drying Process
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              A meticulous 6-step process that transforms fresh produce into
              lightweight, shelf-stable superfoods.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {processSteps.map((step, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-800 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <step.icon className="w-5 h-5 text-green-600" />
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-24 bg-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <span className="text-sm font-semibold text-green-300 uppercase tracking-wider">
              Trust & Quality
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Our Certifications
            </h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            {certifications.map((cert, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-300" />
                </div>
                <h3 className="font-bold text-white text-lg">{cert.name}</h3>
                <p className="text-sm text-green-200 mt-1">{cert.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Want to Know More?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Get in touch with us to learn about our products, manufacturing
            capabilities, or partnership opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button
                size="lg"
                className="rounded-full bg-green-700 hover:bg-green-800 text-white px-8 gap-2"
              >
                Contact Us <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-green-800 text-green-800 hover:bg-green-50 px-8"
              >
                View Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}