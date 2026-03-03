import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, Search, Loader2, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { fetchProducts, type Product } from "@/lib/api";
import { assetPath } from "@/lib/assetPath";
import LoginModal from "@/components/LoginModal";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

// Highlight matching text in search results
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-green-100 text-green-800 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user, logout, setShowLoginModal, showLoginModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setActiveIndex(-1);
    setShowUserMenu(false);
  }, [location]);

  // Load products for search
  useEffect(() => {
    const load = async () => {
      const products = await fetchProducts();
      setAllProducts(products);
    };
    load();
  }, []);

  // Local search
  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      const q = query.toLowerCase();
      const filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.longDescription && p.longDescription.toLowerCase().includes(q))
      );
      setSearchResults(filtered.slice(0, 6));
      setIsSearching(false);
    },
    [allProducts]
  );

  // Debounced search trigger
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setActiveIndex(-1);
      return;
    }
    setIsSearching(true);
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, performSearch]);

  // Close search/user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node) &&
        (!mobileSearchRef.current || !mobileSearchRef.current.contains(e.target as Node))
      ) {
        setSearchOpen(false);
        setSearchQuery("");
        setActiveIndex(-1);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSelect = (product: Product) => {
    navigate(`/products/${product.id}`);
    setSearchOpen(false);
    setSearchQuery("");
    setActiveIndex(-1);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter" && activeIndex >= 0 && searchResults[activeIndex]) {
      e.preventDefault();
      handleSearchSelect(searchResults[activeIndex]);
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
      setActiveIndex(-1);
    }
  };

  return (
    <>
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src={assetPath("/assets/brand/logo.png")}
                alt="El Crunchae"
                className="h-10 md:h-14 w-auto object-contain"
                loading="lazy"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.path
                      ? "bg-green-800 text-white"
                      : scrolled
                      ? "text-gray-700 hover:bg-green-50 hover:text-green-800"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    if (!searchOpen) {
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    scrolled
                      ? "text-gray-600 hover:bg-gray-100"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Search className="w-5 h-5" />
                </button>

                {searchOpen && (
                  <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          ref={inputRef}
                          autoFocus
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setActiveIndex(-1);
                          }}
                          onKeyDown={handleKeyDown}
                          placeholder="Search products by name, category..."
                          className="rounded-xl border-gray-200 pl-10 pr-10"
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-green-600" />
                        )}
                      </div>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="max-h-80 overflow-y-auto border-t">
                        {searchResults.map((p, idx) => (
                          <button
                            key={p.id}
                            onClick={() => handleSearchSelect(p)}
                            className={`w-full flex items-center gap-3 p-3 transition-colors text-left ${
                              idx === activeIndex
                                ? "bg-green-50"
                                : "hover:bg-green-50"
                            }`}
                          >
                            <img
                              src={p.boxImage || p.image}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-contain bg-gray-50 p-1 shrink-0"
                              loading="lazy"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                <HighlightText text={p.name} query={searchQuery} />
                              </p>
                              <p className="text-xs text-gray-500">
                                <HighlightText
                                  text={p.categoryLabel}
                                  query={searchQuery}
                                />{" "}
                                • ₹{p.price}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {searchQuery && !isSearching && searchResults.length === 0 && (
                      <div className="p-4 text-center text-sm text-gray-400 border-t">
                        No products found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                    {!searchQuery && (
                      <div className="p-3 text-center text-xs text-gray-400 border-t">
                        Type to search by product name, category, or keywords
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`p-2 rounded-full transition-colors ${
                      scrolled
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/orders"
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`p-2 rounded-full transition-colors ${
                    scrolled
                      ? "text-gray-600 hover:bg-gray-100"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              <Link to="/cart" className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full gap-2 ${
                    scrolled
                      ? "border-green-800 text-green-800 hover:bg-green-800 hover:text-white"
                      : "border-white text-white hover:bg-white hover:text-green-800"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Cart
                </Button>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
              <Link to="/products">
                <Button
                  size="sm"
                  className="rounded-full bg-orange-600 hover:bg-orange-700 text-white gap-2"
                >
                  Shop Now
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setIsOpen(false);
                }}
                className={`p-2 ${scrolled ? "text-gray-700" : "text-white"}`}
              >
                <Search className="w-5 h-5" />
              </button>
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className={`w-5 h-5 ${scrolled ? "text-gray-700" : "text-white"}`} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
              <button
                onClick={() => {
                  setIsOpen(!isOpen);
                  setSearchOpen(false);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  scrolled ? "text-gray-700" : "text-white"
                }`}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t px-4 py-3" ref={mobileSearchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className="rounded-xl pl-10 pr-10"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-green-600" />
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 max-h-60 overflow-y-auto">
                {searchResults.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => handleSearchSelect(p)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
                      idx === activeIndex ? "bg-green-50" : "hover:bg-green-50"
                    }`}
                  >
                    <img
                      src={p.boxImage || p.image}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-contain bg-gray-50 p-1 shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        <HighlightText text={p.name} query={searchQuery} />
                      </p>
                      <p className="text-xs text-gray-500">₹{p.price}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-3">No products found</p>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md border-t px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-green-800 text-white"
                    : "text-gray-700 hover:bg-green-50"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50"
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowLoginModal(true);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-green-700 hover:bg-green-50"
              >
                Sign In / Register
              </button>
            )}
            <Link
              to="/business"
              className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50"
            >
              Business
            </Link>
            <div className="flex gap-2 pt-3">
              <Link to="/cart" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-green-800 text-green-800"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart {totalItems > 0 && `(${totalItems})`}
                </Button>
              </Link>
              <Link to="/products" className="flex-1">
                <Button className="w-full rounded-xl bg-orange-600 hover:bg-orange-700 text-white">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-around py-2">
          {[
            { name: "Home", path: "/", emoji: "🏠" },
            { name: "Products", path: "/products", emoji: "🛒" },
            { name: "Blog", path: "/blog", emoji: "📝" },
            { name: "Orders", path: "/orders", emoji: "📦" },
            { name: "Cart", path: "/cart", emoji: "🛍️" },
          ].map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors relative ${
                  isActive ? "text-green-800" : "text-gray-500"
                }`}
              >
                <span className="text-lg">{link.emoji}</span>
                <span className="text-[10px] font-medium">{link.name}</span>
                {link.name === "Cart" && totalItems > 0 && (
                  <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}