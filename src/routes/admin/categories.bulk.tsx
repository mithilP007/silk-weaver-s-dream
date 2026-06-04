import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft, Save, Loader2, TableProperties } from "lucide-react";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/categories/bulk")({
  component: AdminCategoriesBulk,
});

interface CategoryRow {
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: string;
  activeStatus: boolean;
  parentCategory: string;
  errors: {
    name?: string;
    slug?: string;
  };
}

function AdminCategoriesBulk() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [existingCategories, setExistingCategories] = useState<any[]>([]);

  // Initialize with 3 rows as required by the testing checklist
  const [rows, setRows] = useState<CategoryRow[]>([
    { name: "", slug: "", description: "", image: "", displayOrder: "", activeStatus: true, parentCategory: "", errors: {} },
    { name: "", slug: "", description: "", image: "", displayOrder: "", activeStatus: true, parentCategory: "", errors: {} },
    { name: "", slug: "", description: "", image: "", displayOrder: "", activeStatus: true, parentCategory: "", errors: {} },
  ]);

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/categories`);
        const res = await response.json();
        if (res.success) {
          setExistingCategories(res.data);
        }
      } catch (err) {
        console.error("Error fetching existing categories:", err);
      }
    };
    fetchExisting();
  }, []);

  const addRow = () => {
    setRows([
      ...rows,
      { name: "", slug: "", description: "", image: "", displayOrder: "", activeStatus: true, parentCategory: "", errors: {} },
    ]);
  };

  const removeRow = (index: number) => {
    if (rows.length === 1) {
      toast.warning("You must enter at least one category row.");
      return;
    }
    const updated = [...rows];
    updated.splice(index, 1);
    setRows(updated);
  };

  const handleNameChange = (index: number, val: string) => {
    const updated = [...rows];
    updated[index].name = val;

    // Auto-generate slug if currently empty
    if (!updated[index].slug.trim()) {
      updated[index].slug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (val.trim()) {
      delete updated[index].errors.name;
    }
    setRows(updated);
  };

  const handleSlugChange = (index: number, val: string) => {
    const updated = [...rows];
    updated[index].slug = val;
    if (val.trim()) {
      delete updated[index].errors.slug;
    }
    setRows(updated);
  };

  const handleSlugBlur = (index: number) => {
    const updated = [...rows];
    if (!updated[index].slug.trim() && updated[index].name.trim()) {
      updated[index].slug = updated[index].name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    setRows(updated);
  };

  const handleChange = (index: number, field: keyof CategoryRow, val: any) => {
    const updated = [...rows];
    (updated[index] as any)[field] = val;
    setRows(updated);
  };

  const validateRows = (): boolean => {
    let isValid = true;
    const updated = [...rows];
    const slugs = new Set<string>();

    for (let i = 0; i < updated.length; i++) {
      const row = updated[i];
      const errors: typeof row.errors = {};

      if (!row.name.trim()) {
        errors.name = "Category Name is required";
        isValid = false;
      }

      // Generate or clean slug
      let slug = row.slug.trim();
      if (!slug && row.name.trim()) {
        slug = row.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      if (slug) {
        if (slugs.has(slug)) {
          errors.slug = "Duplicate slug in upload batch";
          isValid = false;
        } else {
          slugs.add(slug);
        }
      }

      updated[i].errors = errors;
    }

    setRows(updated);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateRows()) {
      toast.error("Please fix the errors marked in the spreadsheet rows.");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Map spreadsheet rows to backend category attributes
      const payload = rows.map((r) => ({
        name: r.name.trim(),
        slug: r.slug.trim() || r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        image: r.image.trim() || null,
        description: r.description.trim() || null,
        displayOrder: r.displayOrder.trim() ? parseInt(r.displayOrder) : null,
        activeStatus: r.activeStatus,
        parentCategory: r.parentCategory || null,
      }));

      const response = await fetch(`${API_BASE}/api/categories/bulk`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to publish categories catalog.");
      }

      toast.success(`Successfully cataloged ${data.count} categories!`);
      navigate({ to: "/admin/categories" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Network error while saving categories.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#6e5d53] mb-1">
            <Link to="/admin/categories" className="hover:text-[#2c2623] flex items-center gap-1">
              <ArrowLeft size={14} /> Categories Catalog
            </Link>
            <span>/</span>
            <span className="text-[#2c2623] font-bold">Bulk Creator</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl flex items-center gap-2">
            <TableProperties className="text-[#3a1d13]" size={26} />
            Bulk Category Catalog
          </h1>
          <p className="text-sm text-[#6e5d53] mt-1">
            Fast, spreadsheet-style cataloging for boutique saree collections, divisions, and subcategories.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/categories"
            className="rounded-xl border border-[#e8dfd8] bg-white px-5 py-3 text-sm font-bold text-[#6e5d53] hover:bg-[#fbfaf7] transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3a1d13] text-[#f7f2ed] px-5 py-3 text-sm font-semibold shadow-soft hover:bg-[#4d2d22] transition-colors disabled:opacity-75"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Bulk Categories
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spreadsheet / Table Style editor */}
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8dfd8] bg-[#fbfaf7] text-[#6e5d53] uppercase tracking-wider font-semibold">
                <th className="py-4 px-4 w-12 text-center">Row</th>
                <th className="py-4 px-4 min-w-[200px]">Category Name *</th>
                <th className="py-4 px-4 min-w-[180px]">Slug (Optional)</th>
                <th className="py-4 px-4 min-w-[250px]">Description Story</th>
                <th className="py-4 px-4 min-w-[200px]">Category Image URL</th>
                <th className="py-4 px-4 w-28">Order</th>
                <th className="py-4 px-4 w-28">Active</th>
                <th className="py-4 px-4 min-w-[180px]">Parent Division</th>
                <th className="py-4 px-4 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8] font-medium text-[#2c2623]">
              {rows.map((row, index) => (
                <tr key={index} className="hover:bg-[#fbfaf7]/40 transition-colors">
                  {/* Row index */}
                  <td className="py-3.5 px-4 text-center font-bold text-[#6e5d53] bg-[#fbfaf7]/50">
                    {index + 1}
                  </td>

                  {/* Name field */}
                  <td className="py-3.5 px-4 vertical-align-top">
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder="e.g. Bridal Silks"
                      className={`w-full rounded-lg border px-3 py-2 text-sm text-[#2c2623] outline-none focus:border-[#d4af37] bg-white transition-colors ${
                        row.errors.name ? "border-red-400" : "border-[#e8dfd8]"
                      }`}
                    />
                    {row.errors.name && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">{row.errors.name}</p>
                    )}
                  </td>

                  {/* Slug field */}
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={row.slug}
                      onChange={(e) => handleSlugChange(index, e.target.value)}
                      onBlur={() => handleSlugBlur(index)}
                      placeholder="auto-generated-slug"
                      className={`w-full rounded-lg border px-3 py-2 text-sm font-mono text-[#2c2623] outline-none focus:border-[#d4af37] bg-white transition-colors ${
                        row.errors.slug ? "border-red-400" : "border-[#e8dfd8]"
                      }`}
                    />
                    {row.errors.slug && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">{row.errors.slug}</p>
                    )}
                  </td>

                  {/* Description field */}
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={row.description}
                      onChange={(e) => handleChange(index, "description", e.target.value)}
                      placeholder="Enter collection story or description..."
                      className="w-full rounded-lg border border-[#e8dfd8] px-3 py-2 text-sm text-[#2c2623] outline-none focus:border-[#d4af37] bg-white transition-colors"
                    />
                  </td>

                  {/* Image URL field */}
                  <td className="py-3.5 px-4">
                    <input
                      type="text"
                      value={row.image}
                      onChange={(e) => handleChange(index, "image", e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full rounded-lg border border-[#e8dfd8] px-3 py-2 text-sm text-[#2c2623] outline-none focus:border-[#d4af37] bg-white transition-colors"
                    />
                  </td>

                  {/* Display Order */}
                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      value={row.displayOrder}
                      onChange={(e) => handleChange(index, "displayOrder", e.target.value)}
                      placeholder="1"
                      className="w-full rounded-lg border border-[#e8dfd8] px-3 py-2 text-sm text-[#2c2623] outline-none focus:border-[#d4af37] bg-white transition-colors"
                    />
                  </td>

                  {/* Active Status */}
                  <td className="py-3.5 px-4">
                    <select
                      value={row.activeStatus ? "true" : "false"}
                      onChange={(e) => handleChange(index, "activeStatus", e.target.value === "true")}
                      className="w-full rounded-lg border border-[#e8dfd8] px-3 py-2 text-sm text-[#2c2623] outline-none focus:border-[#d4af37] bg-white transition-colors cursor-pointer"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </td>

                  {/* Optional Parent Category */}
                  <td className="py-3.5 px-4">
                    <select
                      value={row.parentCategory}
                      onChange={(e) => handleChange(index, "parentCategory", e.target.value)}
                      className="w-full rounded-lg border border-[#e8dfd8] px-3 py-2 text-sm text-[#2c2623] outline-none focus:border-[#d4af37] bg-white transition-colors cursor-pointer"
                    >
                      <option value="">None (Top Level)</option>
                      {existingCategories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Action (Remove Row) */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => removeRow(index)}
                      title="Remove Row"
                      className="rounded p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row button */}
        <div className="border-t border-[#e8dfd8] bg-[#fbfaf7]/60 p-4 flex justify-between items-center">
          <button
            onClick={addRow}
            className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#3a1d13] px-4 py-2.5 text-xs font-bold text-[#3a1d13] hover:bg-[#3a1d13] hover:text-[#f7f2ed] transition-all"
          >
            <Plus size={14} /> Add Row
          </button>

          <p className="text-[11px] text-[#6e5d53] italic">
            * Category Name is required. Slugs are automatically created if left blank.
          </p>
        </div>
      </div>
    </div>
  );
}
