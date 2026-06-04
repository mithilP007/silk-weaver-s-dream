import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Edit2, Trash2, Folder, X, Loader2, TableProperties, UploadCloud } from "lucide-react";
import { subcategories as initialSubs } from "@/data/categories";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/categories")({
  component: AdminCategories,
});

function CategoryImageUpload({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 1000;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        if (height > MAX_HEIGHT) {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
          onChange([...images, dataUrl]);
          toast.success("Image uploaded & optimized successfully!");
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (idx: number) => {
    const list = images.filter((_, i) => i !== idx);
    onChange(list);
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Category Images</label>
      <div className="grid grid-cols-3 gap-2">
        {images.map((img, idx) => (
          <div key={idx} className="relative group aspect-square rounded-xl border border-[#e8dfd8] overflow-hidden bg-[#fbfaf7]">
            <img src={img} alt={`Category ${idx}`} className="h-full w-full object-cover" />
            {idx === 0 && (
              <span className="absolute bottom-1 left-1 bg-[#3a1d13] text-[#f7f2ed] text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">
                Primary
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold"
            >
              Remove
            </button>
          </div>
        ))}
        <label className="border-2 border-dashed border-[#e8dfd8] rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#fbfaf7] transition-all aspect-square">
          <UploadCloud size={20} className="text-[#6e5d53]" />
          <span className="text-[10px] text-muted-foreground mt-1 font-semibold">Upload</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
          />
        </label>
      </div>
      <p className="text-[9px] text-muted-foreground font-semibold">First image is primary thumbnail. Upload multiple for the gallery.</p>
    </div>
  );
}

function AdminCategories() {
  const [subs, setSubs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any | null>(null);

  // Form Field State
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/categories`);
      const res = await response.json();
      if (res.success) {
        const mapped = res.data.map((c: any) => {
          const localMatch = initialSubs.find((local) => local.slug === c.slug);
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description || localMatch?.description || "Handcrafted luxury saree division under Sri Kamatchi Silk.",
            image: c.image || localMatch?.image || initialSubs[0].image,
            gallery: c.gallery,
          };
        });
        setSubs(mapped);
      } else {
        throw new Error(res.message || "Failed to load categories");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error fetching categories from backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = subs.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()),
  );

  const openCreateModal = () => {
    setEditingSub(null);
    setFormName("");
    setFormDesc("");
    setImages([]);
    setModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setEditingSub(s);
    setFormName(s.name);
    setFormDesc(s.description || "");
    let initialImages: string[] = [];
    if (s.gallery) {
      try {
        initialImages = typeof s.gallery === "string" ? JSON.parse(s.gallery) : s.gallery;
      } catch (e) {
        initialImages = [];
      }
    }
    if (initialImages.length === 0 && s.image) {
      initialImages = [s.image];
    }
    setImages(initialImages);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this saree category? This action requires associated products to be re-assigned first.")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE}/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to delete category");
        }

        toast.success("Category deleted successfully!");
        fetchCategories();
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Error deleting category");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSlug = formName.toLowerCase().replace(/\s+/g, "-");

    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const url = editingSub 
        ? `${API_BASE}/api/categories/${editingSub.id}`
        : `${API_BASE}/api/categories`;
      
      const method = editingSub ? "PUT" : "POST";

      const primaryImage = images.length > 0 ? images[0] : "";
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          name: formName,
          slug: newSlug,
          description: formDesc,
          image: primaryImage,
          gallery: images,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save category");
      }

      toast.success(editingSub ? "Subcategory updated successfully!" : "New Subcategory published!");
      fetchCategories();
      setModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to publish category to database");
    }
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
            Saree Categories Catalog
          </h1>
          <p className="text-sm text-[#6e5d53] mt-1">
            Configure boutique saree divisions (e.g., Luxury Silks, Semi Silks, Bridal collections).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/categories/bulk"
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3a1d13] text-[#f7f2ed] px-5 py-3 text-sm font-semibold shadow-soft hover:bg-[#4d2d22] transition-colors"
          >
            <TableProperties size={16} /> Bulk Category Catalog
          </Link>
          <button
            onClick={openCreateModal}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3a1d13] text-[#f7f2ed] px-5 py-3 text-sm font-semibold shadow-soft hover:bg-[#4d2d22] transition-colors"
          >
            <Plus size={16} /> Add New Category
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rounded-xl border border-[#e8dfd8] bg-white p-4 shadow-soft">
        <div className="relative flex max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e5d53]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name, description..."
            className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] py-2.5 pl-10 pr-4 text-sm text-[#2c2623] outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Table Grid */}
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8dfd8] text-[#6e5d53] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Category Image</th>
                <th className="py-3.5 px-4">Title & Slug</th>
                <th className="py-3.5 px-4">Description Story</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8] font-medium text-[#2c2623]">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-[#6e5d53]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#3a1d13]" />
                      <span>Fetching categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-sm text-[#6e5d53]">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[#fbfaf7]/65 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="h-10 w-10 rounded-xl object-cover border border-[#e8dfd8]"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-sm leading-snug">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                        /category/{s.slug}
                      </p>
                    </td>
                    <td className="py-3 px-4 max-w-sm text-xs text-[#6e5d53] leading-relaxed">
                      {s.description}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        <button
                          onClick={() => openEditModal(s)}
                          className="rounded border border-[#e8dfd8] p-1.5 text-[#6e5d53] hover:bg-[#fbfaf7] hover:text-[#2c2623]"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="rounded border border-red-100 p-1.5 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#2c2623]/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-card animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-6 top-6 rounded-lg bg-[#fbfaf7] p-2 border border-[#e8dfd8] text-[#6e5d53] hover:text-[#2c2623]"
            >
              <X size={16} />
            </button>

            <h3 className="font-display text-xl font-bold text-[#2c2623]">
              {editingSub ? "Modify Saree Category" : "Establish New Category"}
            </h3>
            <p className="text-xs text-[#6e5d53] mt-1 border-b border-[#f3ede8] pb-4">
              Category links will automatically register on the storefront filters.
            </p>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-sm text-[#2c2623]">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Category Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Kanchipuram Silk Sarees"
                  className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Description Story</label>
                <textarea
                  rows={4}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Write a brief heritage story explaining what this category comprises of..."
                  className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <CategoryImageUpload images={images} onChange={setImages} />

              <div className="flex justify-end gap-3 pt-3 border-t border-[#f3ede8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-[#e8dfd8] px-5 py-3 text-xs font-bold text-[#6e5d53] hover:bg-[#fbfaf7]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3a1d13] px-6 py-3 text-xs font-bold text-white hover:bg-[#4d2d22]"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
