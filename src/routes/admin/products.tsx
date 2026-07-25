import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  SlidersHorizontal,
  X,
  FileImage,
  Loader2,
  TableProperties,
} from "lucide-react";
import { API_BASE, safeFetchJson } from "@/lib/api";
import { FABRICS, COLORS } from "@/data/categories";
import { formatINR, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [productList, setProductList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState("All");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState(12000);
  const [formDiscount, setFormDiscount] = useState<number | undefined>(9999);
  const [formSub, setFormSub] = useState(""); // Category ID
  const [formStock, setFormStock] = useState(10);
  const [formFabric, setFormFabric] = useState("Pure Silk");
  const [formColor, setFormColor] = useState("Red");
  const [formSareeLen, setFormSareeLen] = useState("5.5m");
  const [formBlouseLen, setFormBlouseLen] = useState("0.8m");
  const [formBlouseInc, setFormBlouseInc] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);
  const [formTrending, setFormTrending] = useState(false);
  const [formOffer, setFormOffer] = useState(false);
  const [formDesc, setFormDesc] = useState("");

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  // Load functions
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/products`);
      const res = await safeFetchJson(response);
      if (res.success) {
        setProductList(res.data);
      } else {
        throw new Error(res.message || "Failed to load products");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Network error while fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/categories`);
      const res = await safeFetchJson(response);
      if (res.success) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Map backend product data to frontend schema
  const mappedProducts = useMemo(() => {
    return productList.map((p) => {
      const img = p.image?.startsWith("http") ? p.image : p.image ? `${API_BASE}${p.image}` : "https://placehold.co/600x800/fafaf9/78350f?text=Sri+Kamatchi+Silk";
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice || p.price,
        rating: 5,
        reviews: 1,
        image: img,
        category: p.category?.name || "Silk Sarees",
        subcategory: p.category?.name || "Semi Silks",
        subcategorySlug: p.category?.slug || "semi-silks",
        stock: p.stock,
        fabric: p.fabric || "Pure Silk",
        color: p.color || "Gold",
        sareeLength: p.sareeLength || "5.5m",
        blouseLength: p.blouseLength || "0.8m",
        blouseIncluded: p.blouseIncluded !== false,
        featured: p.isFeatured || false,
        trending: p.isTrending || false,
        offer: p.isOffer || false,
        newArrival: true,
        description: p.description,
        categoryId: p.categoryId,
      };
    });
  }, [productList]);

  const filtered = useMemo(() => {
    return mappedProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchSub = subFilter === "All" || p.subcategory === subFilter;
      return matchSearch && matchSub;
    });
  }, [mappedProducts, search, subFilter]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice(12000);
    setFormDiscount(9999);
    if (categories.length > 0) {
      setFormSub(categories[0].id);
    } else {
      setFormSub("");
    }
    setFormStock(10);
    setFormFabric("Pure Silk");
    setFormColor("Red");
    setFormSareeLen("5.5m");
    setFormBlouseLen("0.8m");
    setFormBlouseInc(true);
    setFormFeatured(false);
    setFormTrending(false);
    setFormOffer(false);
    setFormDesc(
      "Handcrafted luxury silk saree woven meticulously by master craftsmen in Kanchipuram.",
    );
    setImageFile(null);
    setPreviewUrl("");
    setEditorOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(p.price);
    setFormDiscount(p.discountPrice);
    setFormSub(p.categoryId || "");
    setFormStock(p.stock);
    setFormFabric(p.fabric);
    setFormColor(p.color);
    setFormSareeLen(p.sareeLength);
    setFormBlouseLen(p.blouseLength);
    setFormBlouseInc(p.blouseIncluded);
    setFormFeatured(p.featured || false);
    setFormTrending(p.trending || false);
    setFormOffer(p.offer || false);
    setFormDesc(p.description);
    setImageFile(null);
    setPreviewUrl(p.image);
    setEditorOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to retire this saree from the catalog?")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authorization token not found. Please log in.");
        }

        const response = await fetch(`${API_BASE}/api/products/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await safeFetchJson(response);
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to delete product");
        }

        toast.success("Saree retired successfully", {
          description: "The catalog product has been removed.",
        });
        fetchProducts();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Error retiring product");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      let finalImageUrl = previewUrl;

      // 1. Image upload flow if new file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch(`${API_BASE}/api/uploads/product`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const uploadData = await safeFetchJson(uploadResponse);
        if (!uploadResponse.ok || !uploadData.success) {
          throw new Error(uploadData.message || "Failed to upload image file");
        }

        // Relative path returned, e.g. "/uploads/products/<filename>"
        finalImageUrl = uploadData.imageUrl;
      }

      // Generate a unique slug
      const baseSlug = formName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      const generatedSlug = `${baseSlug}-${Date.now()}`;

      // Strip API_BASE from finalImageUrl if it was prepended by the frontend for rendering
      let savedImageUrl = finalImageUrl;
      if (savedImageUrl.startsWith(API_BASE)) {
        savedImageUrl = savedImageUrl.substring(API_BASE.length);
      }

      // 2. Prepare payload
      const productPayload = {
        name: formName,
        slug: editingProduct ? editingProduct.slug : generatedSlug,
        description: formDesc,
        price: parseFloat(formPrice.toString()),
        discountPrice: formDiscount ? parseFloat(formDiscount.toString()) : null,
        stock: parseInt(formStock.toString()),
        image: savedImageUrl,
        fabric: formFabric,
        color: formColor,
        occasion: "Wedding",
        isFeatured: formFeatured,
        isTrending: formTrending,
        isOffer: formOffer,
        categoryId: formSub,
      };

      if (editingProduct) {
        // PUT
        const response = await fetch(`${API_BASE}/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productPayload),
        });

        const data = await safeFetchJson(response);
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to update product");
        }

        toast.success("Saree updated successfully");
      } else {
        // POST
        const response = await fetch(`${API_BASE}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productPayload),
        });

        const data = await safeFetchJson(response);
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to create product");
        }

        toast.success("New Saree woven & cataloged!");
      }

      setEditorOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error saving product specs");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
            Saree Catalog Management
          </h1>
          <p className="text-sm text-[#6e5d53] mt-1">
            Publish new sarees, adjust inventory stock levels, and customize trending & featured
            items.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/products/bulk"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#3a1d13] bg-white text-[#3a1d13] px-5 py-3 text-sm font-semibold shadow-soft hover:bg-[#fbfaf7] transition-colors"
          >
            <TableProperties size={16} /> Bulk Product Upload
          </Link>
          <button
            onClick={openCreateModal}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3a1d13] text-[#f7f2ed] px-5 py-3 text-sm font-semibold shadow-soft hover:bg-[#4d2d22] transition-colors"
          >
            <Plus size={16} /> Catalog New Saree
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-xl border border-[#e8dfd8] bg-white p-4 shadow-soft">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e5d53]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by saree name, fabric..."
            className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] py-2.5 pl-10 pr-4 text-sm text-[#2c2623] outline-none focus:border-[#d4af37]"
          />
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={15} className="text-[#6e5d53]" />
          <select
            value={subFilter}
            onChange={(e) => setSubFilter(e.target.value)}
            className="rounded-xl border border-[#e8dfd8] bg-white px-4 py-2.5 text-sm text-[#2c2623] outline-none focus:border-[#d4af37]"
          >
            <option value="All">All Categories</option>
            {categories.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8dfd8] text-[#6e5d53] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Saree</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Highlights</th>
                <th className="py-3.5 px-4">Details</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8] font-medium text-[#2c2623]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[#6e5d53]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#3a1d13]" />
                      <span>Fetching boutique catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[#6e5d53]">
                    No sarees match your query. Adjust search or select another category filter.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const off = discountPercent(p.price, p.discountPrice);
                  return (
                    <tr key={p.id} className="hover:bg-[#fbfaf7]/65 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-12 w-10 shrink-0 rounded object-cover"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://placehold.co/600x800/fafaf9/78350f?text=Sri+Kamatchi+Silk";
                              }}
                            />
                          ) : (
                            <div className="grid h-12 w-10 shrink-0 place-items-center rounded bg-[#f3ede8] text-[#6e5d53]">
                              <FileImage size={16} />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-sm leading-snug">{p.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                              {p.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold">{p.subcategory}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-primary">{formatINR(p.discountPrice)}</p>
                        {off > 0 && (
                          <p className="text-[10px] text-muted-foreground line-through">
                            {formatINR(p.price)}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            "rounded px-2 py-0.5 text-[10px] font-bold",
                            p.stock > 5
                              ? "bg-emerald-50 text-emerald-700"
                              : p.stock > 0
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700",
                          )}
                        >
                          {p.stock} Pcs
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.featured && (
                            <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">
                              Featured
                            </span>
                          )}
                          {p.trending && (
                            <span className="rounded bg-[#d4af37]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#d4af37]">
                              Trending
                            </span>
                          )}
                          {p.offer && (
                            <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[9px] font-bold text-sky-700">
                              Offer
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[10px] text-[#6e5d53] leading-relaxed">
                        <p>Fabric: {p.fabric}</p>
                        <p>Color: {p.color}</p>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="rounded border border-[#e8dfd8] p-1.5 text-[#6e5d53] hover:bg-[#fbfaf7] hover:text-[#2c2623]"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="rounded border border-red-100 p-1.5 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Form Drawer/Modal Overlay */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#2c2623]/60 backdrop-blur-sm"
            onClick={() => {
              if (!isSubmitting) setEditorOpen(false);
            }}
          />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-card sm:p-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditorOpen(false)}
              disabled={isSubmitting}
              className="absolute right-6 top-6 rounded-lg bg-[#fbfaf7] p-2 border border-[#e8dfd8] text-[#6e5d53] hover:text-[#2c2623] disabled:opacity-50"
            >
              <X size={16} />
            </button>

            <h3 className="font-display text-2xl font-bold text-[#2c2623]">
              {editingProduct ? "Modify Saree Specifications" : "Weave & Publish Saree"}
            </h3>
            <p className="text-xs text-[#6e5d53] mt-1 border-b border-[#f3ede8] pb-4">
              {editingProduct
                ? `Editing catalog item: ${editingProduct.name}`
                : "Fill details to catalog a new handloom creation."}
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-5 text-sm text-[#2c2623]">
              {/* Image Upload Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                  Saree Image
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] p-3.5">
                  <div className="shrink-0">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-20 w-16 rounded object-cover border border-[#e8dfd8] shadow-sm bg-white"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://placehold.co/600x800/fafaf9/78350f?text=Sri+Kamatchi+Silk";
                        }}
                      />
                    ) : (
                      <div className="grid h-20 w-16 place-items-center rounded border border-dashed border-[#e8dfd8] bg-[#fbfaf7] text-[#6e5d53]">
                        <FileImage size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      disabled={isSubmitting}
                      className="w-full text-xs text-[#6e5d53] file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#3a1d13] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#f7f2ed] file:hover:bg-[#4d2d22] file:transition-colors file:disabled:opacity-50"
                    />
                    <p className="text-[10px] text-muted-foreground leading-normal">
                      Accepts JPG, JPEG, PNG, WEBP. Maximum file size 5MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Saree Title
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Kanchipuram Golden Zari Saree"
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Category
                  </label>
                  <select
                    value={formSub}
                    disabled={isSubmitting}
                    onChange={(e) => setFormSub(e.target.value)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 text-[#2c2623] outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {categories.map((sub) => (
                      <option key={sub.id} value={sub.id} className="text-[#2c2623] bg-white">
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Cost Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    disabled={isSubmitting}
                    value={formPrice}
                    onChange={(e) => setFormPrice(+e.target.value)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Discounted Price (₹)
                  </label>
                  <input
                    type="number"
                    disabled={isSubmitting}
                    value={formDiscount || ""}
                    onChange={(e) => setFormDiscount(e.target.value ? +e.target.value : undefined)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Looms Stock (Pcs)
                  </label>
                  <input
                    type="number"
                    required
                    disabled={isSubmitting}
                    value={formStock}
                    onChange={(e) => setFormStock(+e.target.value)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Fabric
                  </label>
                  <select
                    value={formFabric}
                    disabled={isSubmitting}
                    onChange={(e) => setFormFabric(e.target.value)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 text-[#2c2623] outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {FABRICS.map((fab) => (
                      <option key={fab} value={fab} className="text-[#2c2623] bg-white">
                        {fab}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Color
                  </label>
                  <select
                    value={formColor}
                    disabled={isSubmitting}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 text-[#2c2623] outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {COLORS.map((col) => (
                      <option key={col} value={col} className="text-[#2c2623] bg-white">
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Saree Length
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={formSareeLen}
                    onChange={(e) => setFormSareeLen(e.target.value)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Blouse Length
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={formBlouseLen}
                    onChange={(e) => setFormBlouseLen(e.target.value)}
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 py-2 border-y border-[#f3ede8]">
                <label className="flex items-center gap-2 font-semibold text-[#6e5d53] cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    checked={formBlouseInc}
                    onChange={(e) => setFormBlouseInc(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#3a1d13]"
                  />
                  Blouse Included
                </label>
                <label className="flex items-center gap-2 font-semibold text-[#6e5d53] cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#3a1d13]"
                  />
                  Featured Saree
                </label>
                <label className="flex items-center gap-2 font-semibold text-[#6e5d53] cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    checked={formTrending}
                    onChange={(e) => setFormTrending(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#3a1d13]"
                  />
                  Trending Product
                </label>
                <label className="flex items-center gap-2 font-semibold text-[#6e5d53] cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={isSubmitting}
                    checked={formOffer}
                    onChange={(e) => setFormOffer(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#3a1d13]"
                  />
                  Offer Discount
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                  Product Story (Description)
                </label>
                <textarea
                  rows={3}
                  required
                  disabled={isSubmitting}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#f3ede8]">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  disabled={isSubmitting}
                  className="rounded-xl border border-[#e8dfd8] px-5 py-3 text-xs font-bold text-[#6e5d53] hover:bg-[#fbfaf7] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-[#3a1d13] px-6 py-3 text-xs font-bold text-white hover:bg-[#4d2d22] flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {isSubmitting ? "Saving Specs..." : "Save Saree Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
