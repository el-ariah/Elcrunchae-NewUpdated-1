import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pb-20 md:pb-0">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-green-800 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Stay Fresh with El Crunchae
              </h3>
              <p className="text-green-200 mt-1">
                Subscribe for exclusive offers, new products & healthy recipes
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-green-200 rounded-full px-5 min-w-[250px]"
              />
              <Button className="rounded-full bg-orange-600 hover:bg-orange-700 text-white px-6 shrink-0">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <img
              src="/assets/brand/footer-brand.png"
              alt="El Crunchae"
              className="h-16 w-auto mb-4 brightness-0 invert"
            />
            <p className="text-sm leading-relaxed mb-4">
              El Crunchae — <em>Pure Crunch, Pure Joy</em>. A premium freeze-dried
              food brand by El-Ariah Preserves Pty Ltd, specializing in manufacturing,
              white labeling, trading, and export of freeze-dried fruits, vegetables,
              and cooked meals.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "https://instagram.com/elcrunchae", label: "Instagram" },
                { icon: Facebook, href: "https://facebook.com/elcrunchae", label: "Facebook" },
                { icon: Twitter, href: "https://twitter.com/elcrunchae", label: "Twitter" },
                { icon: Youtube, href: "https://youtube.com/@elcrunchae", label: "YouTube" },
                { icon: Linkedin, href: "https://linkedin.com/company/el-ariah-preserves", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { name: "Home", path: "/" },
                { name: "All Products", path: "/products" },
                { name: "About Us", path: "/about" },
                { name: "Blog & Media", path: "/blog" },
                { name: "White Labeling", path: "/business" },
                { name: "Contact Us", path: "/contact" },
                { name: "My Orders", path: "/orders" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-green-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Our Products</h4>
            <ul className="space-y-2.5">
              {[
                { name: "Freeze Dried Fruits", path: "/products?category=fruits" },
                { name: "Freeze Dried Vegetables", path: "/products?category=vegetables" },
                { name: "Freeze Dried Cooked Food", path: "/products?category=cooked-food" },
                { name: "White Label Products", path: "/business" },
                { name: "Bulk & Export Orders", path: "/business" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm hover:text-green-400 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Handles */}
            <h4 className="text-white font-semibold text-lg mt-8 mb-3">Follow Us</h4>
            <ul className="space-y-2">
              {[
                { name: "📸 Instagram", url: "https://instagram.com/elcrunchae" },
                { name: "🎬 YouTube", url: "https://youtube.com/@elcrunchae" },
                { name: "💼 LinkedIn", url: "https://linkedin.com/company/el-ariah-preserves" },
                { name: "💬 WhatsApp", url: "https://wa.me/918151977997" },
              ].map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-green-400 transition-colors"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm">
                  El-Ariah Preserves Pty Ltd,
                  <br />
                  Bangalore, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-400 shrink-0" />
                <a
                  href="tel:+918151977997"
                  className="text-sm hover:text-green-400 transition-colors"
                >
                  +91 81519 77997
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-400 shrink-0" />
                <a
                  href="mailto:christeena@el-ariah.com"
                  className="text-sm hover:text-green-400 transition-colors"
                >
                  christeena@el-ariah.com
                </a>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Certifications</p>
              <div className="flex gap-2">
                {["FSSAI", "ISO", "HACCP"].map((cert) => (
                  <span
                    key={cert}
                    className="text-[10px] font-bold px-2.5 py-1 rounded bg-white/10 text-green-400 border border-green-800"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>© 2026 El Crunchae by El-Ariah Preserves Pty Ltd. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="/policies?tab=refund" className="hover:text-gray-300">
                Refund Policy
              </Link>
              <Link to="/policies?tab=terms" className="hover:text-gray-300">
                Terms of Service
              </Link>
              <Link to="/policies?tab=shipping" className="hover:text-gray-300">
                Shipping Policy
              </Link>
              <Link to="/blog" className="hover:text-gray-300">
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}