import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SectionHeading } from "@/components/store/SectionHeading";
import { ProductCard } from "@/components/store/ProductCard";
import { subcategories, MAIN_CATEGORY, collections } from "@/data/categories";
import { products } from "@/data/products";

export const Route = createFileRoute("/silk-sarees")({
  head: () => ({
    meta: [
      { title: "Silk Sarees Collection — Sri Kamatchi Silk" },
      {
        name: "description",
        content:
          "Explore our handwoven Silk Sarees — semi silk, cotton silk, luxury and celebrity collections.",
      },
    ],
  }),
  component: SilkSareesPage,
});

function SilkSareesPage() {
  const featured = products.filter((p) => p.featured).slice(0, 8);
  return (
    <StoreLayout>
      <section className="bg-gradient-champagne">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-20">
          <nav className="mb-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>{" "}
            / <span className="text-foreground">Silk Sarees</span>
          </nav>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            {MAIN_CATEGORY.name}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{MAIN_CATEGORY.description}</p>
          <div className="gold-divider mx-auto mt-6 w-24" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading eyebrow="Browse" title="Shop by Subcategory" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {subcategories.map((s, i) => (
            <Link
              key={s.id}
              to="/category/$slug"
              params={{ slug: s.slug }}
              className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover-lift"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                  {s.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Premium Edits" title="Curated Collections" />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {collections.map((c) => (
              <Link
                key={c.slug}
                to="/shop"
                className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:border-gold hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <SectionHeading eyebrow="Handpicked" title="Featured Sarees" align="left" />
          <Link
            to="/shop"
            className="hidden items-center gap-1.5 text-sm font-medium text-primary sm:inline-flex"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </StoreLayout>
  );
}
