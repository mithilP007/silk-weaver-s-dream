import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingBag,
  Clock,
  Users,
  FolderOpen,
  FileText,
  Sliders,
  Store,
  Menu,
  X,
  Crown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Sri Kamatchi Silk — Admin Dashboard" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
  }),
  component: AdminLayout,
});

const MENU_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Products", icon: ShoppingBag, path: "/admin/products" },
  { label: "Orders Log", icon: Clock, path: "/admin/orders" },
  { label: "Customers", icon: Users, path: "/admin/users" },
  { label: "Categories", icon: FolderOpen, path: "/admin/categories" },
  { label: "CMS Pages", icon: FileText, path: "/admin/pages" },
  { label: "Boutique Settings", icon: Sliders, path: "/admin/settings" },
];

function AdminLayout() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user: any = null;

    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }

    if (!token || !user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.", {
        id: "admin-auth-error",
      });
      navigate({ to: "/login" });
    } else {
      setIsAuthorized(true);
    }
  }, [navigate]);

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfaf7] text-[#2c2623]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3a1d13] border-t-transparent"></div>
          <p className="text-sm font-semibold tracking-wider uppercase text-[#6e5d53]">
            Checking authorization...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fbfaf7] text-[#2c2623] antialiased">
      {/* Sidebar - Desktop */}
      <aside className="relative hidden w-64 shrink-0 border-r border-[#e8dfd8] bg-[#3a1d13] text-[#f7f2ed] lg:block">
        <div className="flex h-16 items-center gap-2 border-b border-[#4d2d22] px-6">
          <Crown className="text-[#d4af37]" size={22} />
          <div>
            <h1 className="font-display text-sm font-bold tracking-wider text-white">
              Sri Kamatchi Silk
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#d4af37]/80">Admin Portal</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-6">
          {MENU_ITEMS.map((item) => {
            const active = pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#d4af37] text-[#2c2623]"
                    : "text-[#d4c3b3] hover:bg-[#4d2d22] hover:text-white",
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-6 right-6">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-[#4d2d22] bg-[#4d2d22]/30 py-3 text-xs font-semibold text-[#d4c3b3] transition-colors hover:bg-[#4d2d22] hover:text-white"
          >
            <Store size={14} /> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Header - Global */}
        <header className="flex h-16 items-center justify-between border-b border-[#e8dfd8] bg-white px-4 shadow-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg border border-[#e8dfd8] p-2 text-[#6e5d53] hover:bg-[#fbfaf7] lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#d4af37]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#6e5d53]">
                Boutique Management Suite
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-bold text-[#2c2623]">Admin Officer</p>
              <p className="text-[10px] text-[#6e5d53]">Kanchipuram HQ</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#d4af37] text-sm font-bold text-[#2c2623]">
              AD
            </div>
          </div>
        </header>

        {/* Dynamic Nested Routes */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Sidebar - Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-[#2c2623]/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="absolute inset-y-0 left-0 w-72 bg-[#3a1d13] text-[#f7f2ed] p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-[#4d2d22] pb-4">
              <div className="flex items-center gap-2">
                <Crown className="text-[#d4af37]" size={20} />
                <div>
                  <h1 className="font-display text-sm font-bold tracking-wider text-white">
                    Sri Kamatchi Silk
                  </h1>
                  <p className="text-[9px] uppercase tracking-widest text-[#d4af37]/80">
                    Admin Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg bg-[#4d2d22] p-1.5 text-[#d4c3b3] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <nav className="space-y-1 py-6 flex-1">
              {MENU_ITEMS.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#d4af37] text-[#2c2623]"
                        : "text-[#d4c3b3] hover:bg-[#4d2d22] hover:text-white",
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-[#4d2d22] pt-4">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#4d2d22] bg-[#4d2d22]/30 py-3.5 text-xs font-semibold text-[#d4c3b3] transition-colors hover:bg-[#4d2d22] hover:text-white"
              >
                <Store size={14} /> Back to Storefront
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
