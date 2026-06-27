import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Edit, FileText, Globe, ToggleLeft, ToggleRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPages,
});

const INITIAL_PAGES = [
  { id: "1", title: "About Us", slug: "about", status: true, lastUpdated: "May 28, 2026" },
  { id: "2", title: "Contact Us", slug: "contact", status: true, lastUpdated: "May 29, 2026" },
  {
    id: "3",
    title: "Privacy Policy",
    slug: "privacy-policy",
    status: true,
    lastUpdated: "May 10, 2026",
  },
  {
    id: "4",
    title: "Terms and Conditions",
    slug: "terms",
    status: true,
    lastUpdated: "May 10, 2026",
  },
  {
    id: "5",
    title: "Shipping Policy",
    slug: "shipping-policy",
    status: true,
    lastUpdated: "May 12, 2026",
  },
  {
    id: "6",
    title: "Return Policy",
    slug: "return-policy",
    status: true,
    lastUpdated: "May 15, 2026",
  },
];

import { Loader2, Plus, Trash2 } from "lucide-react";

function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSlug, setPageSlug] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pageActive, setPageActive] = useState(true);

  const fetchPages = async (selectId?: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/pages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (res.success) {
        setPages(res.data);
        if (res.data.length > 0) {
          // If a specific ID is requested, select it. Otherwise select the first page.
          const pageToSelect = selectId
            ? res.data.find((p: any) => p.id === selectId) || res.data[0]
            : res.data[0];
          selectPage(pageToSelect);
        } else {
          setSelectedPage(null);
        }
      } else {
        throw new Error(res.message || "Failed to load pages");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error fetching CMS pages from backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const selectPage = (p: any) => {
    setSelectedPage(p);
    setPageTitle(p.title);
    setPageSlug(p.slug);
    setPageContent(p.content);
    setPageActive(p.isPublished);
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/pages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update page status");
      }
      toast.success("Page status updated");
      fetchPages(selectedPage?.id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error updating page status");
    }
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this CMS page?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/pages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete page");
      }
      toast.success("Page deleted successfully!");
      fetchPages();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error deleting page");
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    const isNew = selectedPage.id === "new";
    const url = isNew ? `${API_BASE}/api/pages` : `${API_BASE}/api/pages/${selectedPage.id}`;
    const method = isNew ? "POST" : "PUT";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: pageTitle,
          slug: pageSlug,
          content: pageContent,
          isPublished: pageActive,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save page contents");
      }

      toast.success(
        isNew
          ? `"${pageTitle}" page published successfully!`
          : `"${pageTitle}" page contents updated & deployed live!`,
      );
      fetchPages(data.data?.id);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error saving page");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
            CMS Page Contents Editor
          </h1>
          <p className="text-sm text-[#6e5d53] mt-1">
            Maintain storefront legal regulations, policies, and editorial information sheets.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedPage({ id: "new", title: "", slug: "", content: "", isPublished: true });
            setPageTitle("");
            setPageSlug("");
            setPageContent("");
            setPageActive(true);
          }}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3a1d13] text-[#f7f2ed] px-5 py-3 text-sm font-semibold shadow-soft hover:bg-[#4d2d22] transition-colors"
        >
          <Plus size={16} /> Create Saree Page
        </button>
      </div>

      {/* Editor Columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Page List Sidebar */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-5 shadow-soft h-fit space-y-4">
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-[#6e5d53] border-b border-[#f3ede8] pb-3">
            Boutique Pages list
          </h3>
          <div className="space-y-1.5">
            {isLoading && pages.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#6e5d53] flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#3a1d13]" />
                <span>Loading CMS pages...</span>
              </div>
            ) : pages.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-8">
                No editorial pages found. Click "Create Saree Page" above to add one.
              </p>
            ) : (
              pages.map((p) => {
                const active = selectedPage?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => selectPage(p)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border p-3.5 cursor-pointer transition-all",
                      active
                        ? "border-[#d4af37] bg-[#fbfaf7] shadow-soft"
                        : "border-transparent bg-transparent hover:bg-[#fbfaf7]/60",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <FileText
                        size={16}
                        className={active ? "text-[#d4af37]" : "text-[#6e5d53]"}
                      />
                      <div>
                        <p
                          className={cn(
                            "text-xs font-bold",
                            active ? "text-[#2c2623]" : "text-[#6e5d53]",
                          )}
                        >
                          {p.title}
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5 font-mono">
                          /{p.slug}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(p.id, p.isPublished);
                      }}
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                      {p.isPublished ? (
                        <ToggleRight size={24} className="text-[#d4af37]" />
                      ) : (
                        <ToggleLeft size={24} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Content Editor Area */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft lg:col-span-2">
          {selectedPage ? (
            <form onSubmit={handleSavePage} className="space-y-5 text-sm text-[#2c2623]">
              <div className="flex items-center justify-between border-b border-[#f3ede8] pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold">
                    {selectedPage.id === "new"
                      ? "Publish New Saree Page"
                      : `Edit Editorial: ${selectedPage.title}`}
                  </h3>
                  {selectedPage.id !== "new" && selectedPage.updatedAt && (
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                      Last updated:{" "}
                      {new Date(selectedPage.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {selectedPage.id !== "new" && (
                    <button
                      type="button"
                      onClick={() => handleDeletePage(selectedPage.id)}
                      className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      title="Delete Saree Page"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-emerald-600" />
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      {pageActive ? "Live on Storefront" : "Draft Hidden"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    Page Title
                  </label>
                  <input
                    type="text"
                    required
                    value={pageTitle}
                    onChange={(e) => setPageTitle(e.target.value)}
                    placeholder="e.g. Silk Fabric Care Guide"
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">
                    URL Slug Path
                  </label>
                  <input
                    type="text"
                    required
                    value={pageSlug}
                    onChange={(e) => setPageSlug(e.target.value)}
                    placeholder="e.g. fabric-care"
                    className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53] flex items-center justify-between">
                  <span>Rich Text Body Content</span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    HTML tags accepted
                  </span>
                </label>
                {/* Visual rich text Mock area UI */}
                <div className="rounded-xl border border-[#e8dfd8] overflow-hidden">
                  <div className="bg-[#fbfaf7] border-b border-[#e8dfd8] px-4 py-2 flex items-center gap-3 text-xs text-[#6e5d53] font-bold">
                    <span className="cursor-pointer hover:text-black">Bold</span>
                    <span className="cursor-pointer hover:text-black">Italic</span>
                    <span className="cursor-pointer hover:text-black">Heading</span>
                    <span className="cursor-pointer hover:text-black">Bullet List</span>
                  </div>
                  <textarea
                    rows={12}
                    required
                    value={pageContent}
                    onChange={(e) => setPageContent(e.target.value)}
                    placeholder="Write beautiful editorial content here..."
                    className="w-full bg-[#fbfaf7] px-4 py-3 text-xs text-[#2c2623] outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#f3ede8]">
                <label className="flex items-center gap-2 font-semibold text-[#6e5d53] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pageActive}
                    onChange={(e) => setPageActive(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#3a1d13]"
                  />
                  Activate Page live on storefront navigation links
                </label>

                <button
                  type="submit"
                  className="rounded-xl bg-[#3a1d13] text-white px-6 py-3 text-xs font-bold hover:bg-[#4d2d22] flex items-center gap-1.5 cursor-pointer"
                >
                  <Check size={14} /> {selectedPage.id === "new" ? "Publish Page" : "Deploy Live"}
                </button>
              </div>
            </form>
          ) : (
            <p className="text-center text-xs text-muted-foreground py-16">
              Select a page on the sidebar directory to load content.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
