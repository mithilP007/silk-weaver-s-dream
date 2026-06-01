import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X, Search } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/store/EmptyState";
import { products } from "@/data/products";
import { subcategories, FABRICS, COLORS, OCCASION_LIST } from "@/data/categories";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>) => ({ q: (s.q as string) || "" }),
  head: () => ({ meta: [{ title: "Shop All Sarees — Sri Kamatchi Silk" }] }),
  component: ShopPage,
});

const SORTS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "low", label: "Price: Low to High" },
  { value: "high", label: "Price: High to Low" },
];

function ShopPage() {
  const { q } = Route.useSearch();
  const [search, setSearch] = useState(q);
  const [subs, setSubs] = useState<string[]>([]);
  const [fabrics, setFabrics] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [occ, setOcc] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(40000);
  const [sort, setSort] = useState("latest");
  const [drawer, setDrawer] = useState(false);

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (subs.length && !subs.includes(p.subcategory)) return false;
      if (fabrics.length && !fabrics.includes(p.fabric)) return false;
      if (colors.length && !colors.includes(p.color)) return false;
      if (occ.length && !p.occasion.some((o) => occ.includes(o))) return false;
      if (p.discountPrice > maxPrice) return false;
      return true;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.discountPrice - b.discountPrice);
    if (sort === "high") list = [...list].sort((a, b) => b.discountPrice - a.discountPrice);
    if (sort === "popular") list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [search, subs, fabrics, colors, occ, maxPrice, sort]);

  const CheckList = ({ title, items, state, set }: { title: string; items: string[]; state: string[]; set: (v: string[]) => void }) => (
    <div className="border-b border-border py-5">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <div className="space-y-2">
        {items.map((it) => (
          <label key={it} className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={state.includes(it)} onChange={() => toggle(state, set, it)} className="h-4 w-4 rounded border-border accent-[var(--primary)]" />
            {it}
          </label>
        ))}
      </div>
    </div>
  );

  const Filters = () => (
    <>
      <CheckList title="Subcategory" items={subcategories.map((s) => s.name)} state={subs} set={setSubs} />
      <CheckList title="Fabric" items={FABRICS} state={fabrics} set={setFabrics} />
      <CheckList title="Color" items={COLORS} state={colors} set={setColors} />
      <CheckList title="Occasion" items={OCCASION_LIST} state={occ} set={setOcc} />
      <div className="py-5">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Max Price: {formatINR(maxPrice)}</h3>
        <input type="range" min={4000} max={40000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-[var(--primary)]" />
      </div>
    </>
  );

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">Shop</span>
        </nav>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">All Sarees</h1>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sarees…" className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-3 text-sm outline-none focus:border-gold" />
            </div>
            <Filters />
          </aside>

          <div>
            <div className="mb-6 flex items-center justify-between gap-3">
              <button onClick={() => setDrawer(true)} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm lg:hidden">
                <SlidersHorizontal size={15} /> Filters
              </button>
              <p className="hidden text-sm text-muted-foreground sm:block">{filtered.length} products</p>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-gold">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            {filtered.length === 0 ? (
              <EmptyState icon={Search} title="No sarees found" description="Try adjusting your filters or search term." />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-background p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setDrawer(false)}><X size={20} /></button>
            </div>
            <Filters />
            <button onClick={() => setDrawer(false)} className="mt-4 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground">Show {filtered.length} results</button>
          </div>
        </div>
      )}
    </StoreLayout>
  );
}
