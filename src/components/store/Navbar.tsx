import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useStore } from "@/store/StoreContext";
import { API_BASE } from "@/lib/api";
import logoImg from "@/assets/logo.png";

export function Navbar() {
  const { cartCount, wishlist } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings/home`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch((err) => console.error("Error fetching header settings:", err));
  }, []);

  const header = settings?.header;
  const brandName = header?.brandName || "Sri Kamatchi Silk";
  const tagline = header?.tagline || "Silk";
  const logoUrl = header?.logoUrl || "";

  const getLogoSrc = () => {
    if (!logoUrl) return logoImg;
    if (logoUrl.startsWith("http") || logoUrl.startsWith("data:")) return logoUrl;
    if (logoUrl.startsWith("/")) return `${API_BASE}${logoUrl}`;
    return logoUrl;
  };

  const whatsappUrl = "https://wa.me/919443210987"; // Placeholder to be customized later

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop", search: { q: query } as never });
    setSearchOpen(false);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <button className="lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-3">
          <img
            src={getLogoSrc()}
            alt={brandName}
            className="h-14 sm:h-20 w-auto object-contain max-h-20"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== logoImg) {
                target.src = logoImg;
              }
            }}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            to="/"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/category/$slug"
            params={{ slug: "semi-silks" }}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Semi Silks
          </Link>
          <Link
            to="/category/$slug"
            params={{ slug: "celebrity-silks" }}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Celebrity Silks
          </Link>
          <Link
            to="/category/$slug"
            params={{ slug: "cotton-silks" }}
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Silk Cotton
          </Link>
          <Link
            to="/shop"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Shop
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Contact WhatsApp
          </a>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
          >
            <Search size={19} />
          </button>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
          >
            <Heart size={19} />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          <Link
            to="/login"
            aria-label="Account"
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
          >
            <User size={19} />
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background"
          >
            <form onSubmit={submitSearch} className="mx-auto flex max-w-3xl gap-2 px-4 py-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for Kanchipuram, bridal, cotton silk…"
                  className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold"
                />
              </div>
              <button className="rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground">
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85%] flex-col bg-background shadow-card lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <span className="font-display text-lg font-bold text-primary">{brandName}</span>
                <button aria-label="Close" onClick={() => setMobileOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <nav className="flex flex-col gap-1">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                    activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                    activeOptions={{ exact: true }}
                  >
                    Home
                  </Link>
                  <Link
                    to="/category/$slug"
                    params={{ slug: "semi-silks" }}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                    activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                  >
                    Semi Silks
                  </Link>
                  <Link
                    to="/category/$slug"
                    params={{ slug: "celebrity-silks" }}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                    activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                  >
                    Celebrity Silks
                  </Link>
                  <Link
                    to="/category/$slug"
                    params={{ slug: "cotton-silks" }}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                    activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                  >
                    Silk Cotton
                  </Link>
                  <Link
                    to="/shop"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                    activeProps={{ className: "bg-secondary text-primary font-semibold" }}
                  >
                    Shop
                  </Link>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/85 hover:bg-secondary"
                  >
                    Contact WhatsApp
                  </a>
                </nav>
              </div>
              <div className="border-t border-border p-5">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-medium text-primary-foreground"
                >
                  <User size={16} /> Login / Register
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
