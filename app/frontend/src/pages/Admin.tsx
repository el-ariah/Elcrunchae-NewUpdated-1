import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Package,
  Search,
  LogIn,
  LogOut,
  Loader2,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  User,
  Settings,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  fetchProducts as fetchProductsAPI,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSiteSettings,
  saveSiteSettings,
  defaultSettings,
  type SiteSettings,
} from "@/lib/siteSettings";

interface ProductForm {
  slug: string;
  name: string;
  category: string;
  category_label: string;
  description: string;
  long_description: string;
  weight: string;
  price: number;
  original_price: number;
  image: string;
  box_image: string;
  nutrition_highlights: string;
  shelf_life: string;
  how_to_use: string;
  badge: string;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  sort_order: number;
}

const emptyForm: ProductForm = {
  slug: "",
  name: "",
  category: "fruits",
  category_label: "Fruits",
  description: "",
  long_description: "",
  weight: "50g",
  price: 0,
  original_price: 0,
  image: "",
  box_image: "",
  nutrition_highlights: "[]",
  shelf_life: "12 months",
  how_to_use: "",
  badge: "",
  sku: "",
  stock_quantity: 0,
  is_active: true,
  sort_order: 0,
};

const categoryOptions = [
  { value: "fruits", label: "Fruits" },
  { value: "vegetables", label: "Vegetables" },
  { value: "cooked-food", label: "Cooked Food" },
];

type AdminTab = "products" | "settings";

export default function AdminPage() {
  const { user, loading, logout: handleLogout, setShowLoginModal } = useAuth();
  const [products, setProducts] = useState<(Product & { dbId?: number })[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<ProductForm | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<AdminTab>("products");

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getSiteSettings());
  const [settingsSaved, setSettingsSaved] = useState(false);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const items = await fetchProductsAPI();
      setProducts(items);
    } catch (err) {
      console.error("Failed to load products:", err);
      toast.error("Failed to load products");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user, loadProducts]);

  const startEdit = (product: Product & { dbId?: number }) => {
    let nhStr = "[]";
    try {
      nhStr = JSON.stringify(product.nutritionHighlights);
    } catch {
      nhStr = "[]";
    }
    setEditingProduct({
      slug: product.id,
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel,
      description: product.description,
      long_description: product.longDescription,
      weight: product.weight,
      price: product.price,
      original_price: product.originalPrice || 0,
      image: product.image,
      box_image: product.boxImage || "",
      nutrition_highlights: nhStr,
      shelf_life: product.shelfLife,
      how_to_use: product.howToUse,
      badge: product.badge || "",
      sku: product.sku || "",
      stock_quantity: product.stockQuantity || 0,
      is_active: product.isActive !== false,
      sort_order: product.sortOrder || 0,
    });
    setEditingId(product.dbId || null);
    setIsCreating(false);
  };

  const startCreate = () => {
    setEditingProduct({
      ...emptyForm,
      sort_order: products.length + 1,
    });
    setEditingId(null);
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditingId(null);
    setIsCreating(false);
  };

  const handleSave = async () => {
    if (!editingProduct) return;
    if (!editingProduct.name || !editingProduct.slug || !editingProduct.price) {
      toast.error("Name, slug, and price are required");
      return;
    }

    setSaving(true);
    try {
      const data: Record<string, any> = {
        slug: editingProduct.slug,
        name: editingProduct.name,
        category: editingProduct.category,
        category_label:
          categoryOptions.find((c) => c.value === editingProduct.category)?.label ||
          editingProduct.category_label,
        description: editingProduct.description,
        long_description: editingProduct.long_description,
        weight: editingProduct.weight,
        price: Number(editingProduct.price),
        original_price: Number(editingProduct.original_price) || 0,
        image: editingProduct.image,
        box_image: editingProduct.box_image,
        nutrition_highlights: editingProduct.nutrition_highlights,
        shelf_life: editingProduct.shelf_life,
        how_to_use: editingProduct.how_to_use,
        badge: editingProduct.badge,
        sku: editingProduct.sku,
        stock_quantity: Number(editingProduct.stock_quantity),
        is_active: editingProduct.is_active,
        sort_order: Number(editingProduct.sort_order),
      };

      if (isCreating) {
        await createProduct(data);
        toast.success("Product created successfully!");
      } else if (editingId) {
        await updateProduct(editingId, data);
        toast.success("Product updated successfully!");
      }

      cancelEdit();
      await loadProducts();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dbId: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(dbId);
      toast.success("Product deleted");
      await loadProducts();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete product");
    }
  };

  const updateField = (field: keyof ProductForm, value: any) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, [field]: value });
  };

  const handleSaveSettings = () => {
    saveSiteSettings(siteSettings);
    setSettingsSaved(true);
    toast.success("Site settings saved! Refresh the homepage to see changes.");
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleResetSettings = () => {
    setSiteSettings({ ...defaultSettings });
    saveSiteSettings({ ...defaultSettings });
    toast.success("Settings reset to defaults");
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            El Crunchae Admin
          </h1>
          <p className="text-gray-500 mb-8">
            Sign in to manage products, SKUs, and inventory
          </p>
          <Button
            onClick={() => setShowLoginModal(true)}
            className="w-full rounded-xl bg-green-700 hover:bg-green-800 text-white gap-2 h-12"
          >
            <LogIn className="w-5 h-5" />
            Sign In to Continue
          </Button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mt-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-green-700" />
                <h1 className="text-lg font-bold text-gray-900">
                  Admin Panel
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user.name || "Admin"}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLogout()}
                className="rounded-lg gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "products"
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "settings"
                  ? "border-green-700 text-green-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Settings className="w-4 h-4" />
              Site Settings
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "settings" ? (
          /* ─── Site Settings Tab ─── */
          <div className="max-w-2xl">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Site Settings</h2>
              <p className="text-sm text-gray-500">
                Adjust visual settings for the website. Changes are saved locally and applied on page refresh.
              </p>
            </div>

            {/* Hero Overlay Settings */}
            <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hero Section Overlay</h3>
                  <p className="text-xs text-gray-500">
                    Control the gradient overlay darkness on the hero background image
                  </p>
                </div>
              </div>

              {/* Desktop Overlay */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Desktop Overlay Opacity
                  </label>
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {siteSettings.heroOverlayOpacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={siteSettings.heroOverlayOpacity}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      heroOverlayOpacity: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Light (more image visible)</span>
                  <span>Dark (better text readability)</span>
                </div>
              </div>

              {/* Mobile Overlay */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Mobile Overlay Opacity
                  </label>
                  <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {siteSettings.heroMobileOverlayOpacity}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={95}
                  step={5}
                  value={siteSettings.heroMobileOverlayOpacity}
                  onChange={(e) =>
                    setSiteSettings({
                      ...siteSettings,
                      heroMobileOverlayOpacity: Number(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-700"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Light (more image visible)</span>
                  <span>Dark (better text readability)</span>
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl overflow-hidden border mb-4">
                <div className="relative h-40">
                  <img
                    src="https://mgx-backend-cdn.metadl.com/generate/images/985690/2026-03-01/f3553a4f-be1b-4917-8dfb-0ec076a5ca39.png"
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"
                    style={{ opacity: siteSettings.heroOverlayOpacity / 100 }}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"
                    style={{ opacity: (siteSettings.heroOverlayOpacity / 100) * 0.6 }}
                  />
                  <div className="absolute inset-0 flex items-center px-6">
                    <div>
                      <p className="text-xs text-green-300 font-medium mb-1">
                        100% Natural • No Preservatives
                      </p>
                      <p className="text-xl font-bold text-white drop-shadow-lg">
                        Pure Crunch, Pure Joy
                      </p>
                      <p className="text-xs text-gray-200 mt-1">
                        Premium freeze-dried fruits by El Crunchae
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-400 text-center">
                  Desktop Preview — Overlay at {siteSettings.heroOverlayOpacity}%
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveSettings}
                className="rounded-xl bg-green-700 hover:bg-green-800 text-white gap-2"
              >
                <Save className="w-4 h-4" />
                {settingsSaved ? "Saved!" : "Save Settings"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResetSettings}
                className="rounded-xl"
              >
                Reset to Defaults
              </Button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Settings are stored in your browser. After saving, refresh the homepage to see the changes.
            </p>
          </div>
        ) : (
          /* ─── Products Tab ─── */
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Products", value: products.length, color: "bg-green-50 text-green-700" },
                { label: "Fruits", value: products.filter((p) => p.category === "fruits").length, color: "bg-emerald-50 text-emerald-700" },
                { label: "Vegetables", value: products.filter((p) => p.category === "vegetables").length, color: "bg-orange-50 text-orange-700" },
                { label: "Cooked Food", value: products.filter((p) => p.category === "cooked-food").length, color: "bg-red-50 text-red-700" },
              ].map((stat) => (
                <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm opacity-80">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-10 rounded-xl border border-gray-200 px-3 text-sm bg-white"
              >
                <option value="all">All Categories</option>
                {categoryOptions.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <Button onClick={startCreate} className="rounded-xl bg-green-700 hover:bg-green-800 text-white gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            {/* Edit/Create Form */}
            {editingProduct && (
              <div className="bg-white rounded-2xl border shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    {isCreating ? "Create New Product" : "Edit Product"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={cancelEdit}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Slug (URL ID) *</label>
                    <Input value={editingProduct.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="e.g. strawberry" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Name *</label>
                    <Input value={editingProduct.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Product name" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Category *</label>
                    <select value={editingProduct.category} onChange={(e) => updateField("category", e.target.value)} className="w-full h-10 rounded-lg border border-gray-200 px-3 text-sm">
                      {categoryOptions.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">SKU</label>
                    <Input value={editingProduct.sku} onChange={(e) => updateField("sku", e.target.value)} placeholder="e.g. FD-FRT-STR-50" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Price (₹) *</label>
                    <Input type="number" value={editingProduct.price} onChange={(e) => updateField("price", Number(e.target.value))} className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Original Price (₹)</label>
                    <Input type="number" value={editingProduct.original_price} onChange={(e) => updateField("original_price", Number(e.target.value))} className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Weight</label>
                    <Input value={editingProduct.weight} onChange={(e) => updateField("weight", e.target.value)} placeholder="e.g. 50g" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Shelf Life</label>
                    <Input value={editingProduct.shelf_life} onChange={(e) => updateField("shelf_life", e.target.value)} placeholder="e.g. 12 months" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Badge</label>
                    <Input value={editingProduct.badge} onChange={(e) => updateField("badge", e.target.value)} placeholder="e.g. Bestseller" className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Stock Quantity</label>
                    <Input type="number" value={editingProduct.stock_quantity} onChange={(e) => updateField("stock_quantity", Number(e.target.value))} className="rounded-lg" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Sort Order</label>
                    <Input type="number" value={editingProduct.sort_order} onChange={(e) => updateField("sort_order", Number(e.target.value))} className="rounded-lg" />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={editingProduct.is_active} onChange={(e) => updateField("is_active", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-green-700 focus:ring-green-700" />
                      <span className="text-sm font-medium text-gray-700">Active (visible on site)</span>
                    </label>
                  </div>
                </div>

                {/* Image URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Product Image URL</label>
                    <div className="flex gap-2">
                      <Input value={editingProduct.image} onChange={(e) => updateField("image", e.target.value)} placeholder="/images/Product.jpg" className="rounded-lg flex-1" />
                      {editingProduct.image && (
                        <div className="w-10 h-10 rounded-lg border overflow-hidden shrink-0">
                          <img src={editingProduct.image} alt="" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Box Image URL (optional)</label>
                    <div className="flex gap-2">
                      <Input value={editingProduct.box_image} onChange={(e) => updateField("box_image", e.target.value)} placeholder="/images/ProductBox.jpg" className="rounded-lg flex-1" />
                      {editingProduct.box_image && (
                        <div className="w-10 h-10 rounded-lg border overflow-hidden shrink-0">
                          <img src={editingProduct.box_image} alt="" className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Text Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Short Description</label>
                    <textarea value={editingProduct.description} onChange={(e) => updateField("description", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Brief product description..." />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Long Description</label>
                    <textarea value={editingProduct.long_description} onChange={(e) => updateField("long_description", e.target.value)} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Detailed product description..." />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">How to Use</label>
                    <textarea value={editingProduct.how_to_use} onChange={(e) => updateField("how_to_use", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Usage instructions..." />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nutrition Highlights (JSON array)</label>
                    <textarea value={editingProduct.nutrition_highlights} onChange={(e) => updateField("nutrition_highlights", e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 font-mono" placeholder='["Rich in Vitamin C", "High in Antioxidants"]' />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button variant="outline" onClick={cancelEdit} className="rounded-lg">Cancel</Button>
                  <Button onClick={handleSave} disabled={saving} className="rounded-lg bg-green-700 hover:bg-green-800 text-white gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isCreating ? "Create Product" : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}

            {/* Product List */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-green-700" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div key={product.dbId} className="bg-white rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-14 h-14 rounded-lg bg-gray-50 border overflow-hidden shrink-0">
                        {product.image ? (
                          <img src={product.boxImage || product.image} alt={product.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                          {product.badge && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">{product.badge}</span>
                          )}
                          {product.isActive === false && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0">Inactive</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{product.sku || "No SKU"}</span>
                          <span>₹{product.price}</span>
                          <span>{product.weight}</span>
                          <span className="capitalize">{product.category.replace("-", " ")}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" onClick={() => startEdit(product)} className="rounded-lg gap-1.5">
                          <Pencil className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(product.dbId!, product.name)} className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setExpandedId(expandedId === product.dbId ? null : product.dbId!)} className="rounded-lg">
                          {expandedId === product.dbId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    {expandedId === product.dbId && (
                      <div className="px-4 pb-4 pt-0 border-t mx-4 mt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-sm">
                          <div><p className="text-gray-400 text-xs">Stock</p><p className="font-medium">{product.stockQuantity}</p></div>
                          <div><p className="text-gray-400 text-xs">Original Price</p><p className="font-medium">{product.originalPrice ? `₹${product.originalPrice}` : "—"}</p></div>
                          <div><p className="text-gray-400 text-xs">Shelf Life</p><p className="font-medium">{product.shelfLife}</p></div>
                          <div><p className="text-gray-400 text-xs">Sort Order</p><p className="font-medium">{product.sortOrder}</p></div>
                        </div>
                        <div className="mt-3">
                          <p className="text-gray-400 text-xs mb-1">Description</p>
                          <p className="text-sm text-gray-600">{product.description}</p>
                        </div>
                        <div className="mt-3">
                          <p className="text-gray-400 text-xs mb-1">Nutrition Highlights</p>
                          <div className="flex flex-wrap gap-1.5">
                            {product.nutritionHighlights.map((nh) => (
                              <span key={nh} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{nh}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}