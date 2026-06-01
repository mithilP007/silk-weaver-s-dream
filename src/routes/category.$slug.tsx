import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowRight, Search, Loader2 } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/store/EmptyState";
import { products as mockProducts } from "@/data/products";
import { subcategories as mockSubcategories } from "@/data/categories";
import { useState, useEffect, useMemo } from "react";

export const Route = createFileRoute("/category/$slug")({
  head: () => ({ meta: [{ title: "Saree Collection — Sri Kamatchi Silk" }] }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/category/$slug" });

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/categories")
        ]);

        const prods = await prodRes.json();
        const cats = await catRes.json();

        if (prods.success) setDbProducts(prods.data);
        if (cats.success) setDbCategories(cats.data);
      } catch (err) {
        console.error("Storefront API fetch offline, using mock backup", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const liveProducts = useMemo(() => {
    if (dbProducts.length === 0) return mockProducts;
    return dbProducts.map((p) => {
      const img = p.image?.startsWith("http")
        ? p.image
        : (p.image ? `http://localhost:5000${p.image}` : "");
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: p.price,
        discountPrice: p.discountPrice || p.price,
        rating: 4.9,
        reviews: 21,
        image: img,
        gallery: [img],
        category: p.category?.name || "Silk Sarees",
        subcategory: p.category?.name || "Semi Silks",
        subcategorySlug: p.category?.slug || "semi-silks",
        stock: p.stock,
        fabric: p.fabric || "Pure Silk",
        color: p.color || "Gold",
        sareeLength: p.sareeLength || "6.3 metres",
        blouseLength: p.blouseLength || "0.8 metres",
        blouseIncluded: p.blouseIncluded !== false,
        featured: p.isFeatured || false,
        trending: p.isTrending || false,
        offer: p.isOffer || false,
        newArrival: true,
        description: p.description,
        categoryId: p.categoryId,
        occasion: ["Wedding", "Reception"],
      };
    });
  }, [dbProducts]);

  const liveSubcategories = useMemo(() => {
    if (dbCategories.length === 0) return mockSubcategories;
    return dbCategories.map((c) => {
      const localMatch = mockSubcategories.find((m) => m.slug === c.slug);
      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: localMatch?.description || "Handcrafted saree division.",
        image: c.image || localMatch?.image || mockSubcategories[0].image,
      };
    });
  }, [dbCategories]);

  const sub = liveSubcategories.find((s) => s.slug === slug);
  const list = liveProducts.filter((p) => p.subcategorySlug === slug);

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
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="animate-spin text-primary mr-2" size={20} />
            <span className="text-sm text-muted-foreground">Loading boutique catalog...</span>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground">{list.length} products</p>
            {list.length === 0 ? (
              <EmptyState icon={Search} title="No sarees yet" description="This collection is being woven. Check back soon." action={<Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Browse all <ArrowRight size={16} /></Link>} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {list.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </>
        )}
      </section>
    </StoreLayout>
  );
}
