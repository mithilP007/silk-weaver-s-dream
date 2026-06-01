import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/store/EmptyState";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { subcategories } from "@/data/categories";

export const Route = createFileRoute("/category/$slug")({
  head: () => ({ meta: [{ title: "Saree Collection — Sri Kamatchi Silk" }] }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/category/$slug" });
  const sub = subcategories.find((s) => s.slug === slug);
  const list = products.filter((p) => p.subcategorySlug === slug);

  return (
    <StoreLayout>
      <section className="bg-gradient-champagne">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:py-20">
          <nav className="mb-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> /{" "}
            <Link to="/silk-sarees" className="hover:text-primary">Silk Sarees</Link> /{" "}
            <span className="text-foreground">{sub?.name ?? "Collection"}</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">{sub?.name ?? "Collection"}</h1>
          {sub && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{sub.description}</p>}
          <div className="gold-divider mx-auto mt-6 w-24" />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <p className="mb-6 text-sm text-muted-foreground">{list.length} products</p>
        {list.length === 0 ? (
          <EmptyState icon={Search} title="No sarees yet" description="This collection is being woven. Check back soon." action={<Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Browse all <ArrowRight size={16} /></Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    </StoreLayout>
  );
}
