import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  isValidName,
  checkRateLimit,
} from "@/lib/security";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 81519 77997"],
    action: "tel:+918151977997",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["christeena@el-ariah.com"],
    action: "mailto:christeena@el-ariah.com",
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["El-Ariah Preserves Pty Ltd", "Bangalore, India"],
    action: "#",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
    action: "#",
  },
];

export default function ContactPage() {
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limit form submissions
    if (!checkRateLimit("contact_form", 3, 120000)) {
      toast.error("Too many submissions. Please wait a moment before trying again.");
      return;
    }

    // Sanitize
    const name = sanitizeInput(formName, 100);
    const email = formEmail.trim();
    const phone = sanitizeInput(formPhone, 20);
    const message = sanitizeInput(formMessage, 2000);

    // Validate
    if (!name || !isValidName(name)) {
      toast.error("Please enter a valid name");
      return;
    }
    if (!email || !isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (phone && !isValidPhone(phone)) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!message || message.length < 10) {
      toast.error("Please enter a message (at least 10 characters)");
      return;
    }

    setSubmitting(true);

    // Construct WhatsApp message with sanitized data
    const whatsappMsg = encodeURIComponent(
      `Hi, I'm ${name}.\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ""}${formSubject ? `\nSubject: ${formSubject}` : ""}\n\n${message}`
    );
    window.open(`https://wa.me/918151977997?text=${whatsappMsg}`, "_blank", "noopener,noreferrer");

    setSubmitting(false);
    toast.success("Redirecting to WhatsApp...");
  };

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-8 md:pt-32 md:pb-12 bg-gradient-to-br from-green-800 to-green-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">Contact</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Get In Touch
          </h1>
          <p className="text-green-200 max-w-xl">
            Have questions about our products, want to place a bulk order, or
            explore partnership opportunities? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((info, i) => (
              <a
                key={i}
                href={info.action}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 block"
                rel="noopener noreferrer"
              >
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-green-700" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((d, j) => (
                  <p key={j} className="text-sm text-gray-500">{d}</p>
                ))}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + WhatsApp */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl p-6 md:p-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name *</label>
                      <Input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Your name"
                        className="rounded-xl"
                        maxLength={100}
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
                      <Input
                        type="email"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="rounded-xl"
                        maxLength={200}
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                      <Input
                        type="tel"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value.replace(/[^\d+\s()-]/g, ""))}
                        placeholder="+91 81519 77997"
                        className="rounded-xl"
                        maxLength={20}
                        autoComplete="tel"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subject</label>
                      <select
                        value={formSubject}
                        onChange={(e) => setFormSubject(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select a topic</option>
                        <option value="Product Inquiry">Product Inquiry</option>
                        <option value="Bulk Order">Bulk Order</option>
                        <option value="White Labeling">White Labeling</option>
                        <option value="Export Inquiry">Export Inquiry</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message *</label>
                    <Textarea
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="rounded-xl min-h-[140px] resize-none"
                      maxLength={2000}
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{formMessage.length}/2000</p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full rounded-xl bg-green-700 hover:bg-green-800 text-white"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : null}
                    Send Message
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* WhatsApp CTA */}
              <div className="bg-green-800 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Chat on WhatsApp</h3>
                    <p className="text-green-200 text-sm">Get instant responses</p>
                  </div>
                </div>
                <p className="text-green-100 text-sm mb-5">
                  For quick inquiries, product questions, or to place an order
                  directly — chat with us on WhatsApp!
                </p>
                <a
                  href="https://wa.me/918151977997"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full rounded-xl bg-white text-green-800 hover:bg-green-50 font-semibold">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start WhatsApp Chat
                  </Button>
                </a>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="space-y-3">
                  {[
                    { icon: Instagram, name: "Instagram", handle: "@elcrunchae", color: "text-pink-600", url: "https://instagram.com/elcrunchae" },
                    { icon: Facebook, name: "Facebook", handle: "El Crunchae", color: "text-blue-600", url: "https://facebook.com/elcrunchae" },
                    { icon: Twitter, name: "Twitter / X", handle: "@elcrunchae", color: "text-sky-500", url: "https://twitter.com/elcrunchae" },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <social.icon className={`w-5 h-5 ${social.color}`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{social.name}</p>
                        <p className="text-xs text-gray-500">{social.handle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Visit Website */}
              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                <h3 className="font-bold text-amber-900 mb-2">Visit Our Main Website</h3>
                <p className="text-sm text-amber-800 mb-4">
                  Check out our full range and latest updates on our main website.
                </p>
                <a href="https://el-ariah.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-xl border-amber-600 text-amber-800 hover:bg-amber-100 w-full">
                    Visit el-ariah.com
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}