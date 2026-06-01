import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, Zap, Truck, RotateCcw, ShieldCheck, Check } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SectionHeading } from "@/components/store/SectionHeading";
import { ProductCard } from "@/components/store/ProductCard";
import { StarRating } from "@/components/store/StarRating";
import { EmptyState } from "@/components/store/EmptyState";
import { Search } from "lucide-react";
import { getProductBySlug, getRelated } from "@/data/products";
import { useStore } from "@/store/StoreContext";
import { formatINR, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  head: () => ({ meta: [{ title: "Saree Details — Sri Kamatchi Silk" }] }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = useParams({ from: "/product/$slug" });
  const product = getProductBySlug(slug);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-3xl px-4 py-20">
          <EmptyState icon={Search} title="Saree not found" description="This product may have moved." action={<Link to="/shop" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Back to shop</Link>} />
        </div>
      </StoreLayout>
    );
  }

  const off = discountPercent(product.price, product.discountPrice);
  const related = getRelated(product);
  const specs = [
    { label: "Color", value: product.color },
    { label: "Fabric", value: product.fabric },
    { label: "Occasion", value: product.occasion.join(", ") },
    { label: "Saree Length", value: product.sareeLength },
    { label: "Blouse Length", value: product.blouseLength },
    { label: "Blouse Included", value: product.blouseIncluded ? "Yes" : "No" },
  ];

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <nav className="text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> /{" "}
          <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <div className="flex gap-3 sm:flex-col">
              {product.gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={cn("h-20 w-16 overflow-hidden rounded-lg border-2", activeImg === i ? "border-gold" : "border-transparent")}>
                  <img src={img} alt="thumbnail" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-muted">
              <img src={product.gallery[activeImg]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
              {off > 0 && <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{off}% OFF</span>}
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-gold">{product.subcategory}</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">{product.name}</h1>
            <StarRating rating={product.rating} reviews={product.reviews} showValue className="mt-3" />
            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">{formatINR(product.discountPrice)}</span>
              {off > 0 && <span className="text-lg text-muted-foreground line-through">{formatINR(product.price)}</span>}
              {off > 0 && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">Save {off}%</span>}
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm">
              {product.stock > 0 ? <span className="flex items-center gap-1.5 text-green-700"><Check size={15} /> In Stock ({product.stock} available)</span> : <span className="text-destructive">Out of Stock</span>}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-2xl border border-border bg-card p-5 text-sm">
              {specs.map((s) => (
                <div key={s.label}>
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center"><Minus size={15} /></button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center"><Plus size={15} /></button>
              </div>
              <button onClick={() => toggleWishlist(product)} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:border-gold" aria-label="Wishlist">
                <Heart size={18} className={cn(isWishlisted(product.id) && "fill-primary text-primary")} />
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => addToCart(product, qty)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-card py-3.5 text-sm font-medium text-primary transition-colors hover:bg-secondary">
                <ShoppingBag size={17} /> Add to Cart
              </button>
              <Link to="/checkout" onClick={() => addToCart(product, qty)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground">
                <Zap size={17} /> Buy Now
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
              <div className="rounded-xl border border-border bg-card p-3"><Truck className="mx-auto text-gold" size={20} /><p className="mt-2">Free shipping over ₹4,999</p></div>
              <div className="rounded-xl border border-border bg-card p-3"><RotateCcw className="mx-auto text-gold" size={20} /><p className="mt-2">7-day easy returns</p></div>
              <div className="rounded-xl border border-border bg-card p-3"><ShieldCheck className="mx-auto text-gold" size={20} /><p className="mt-2">100% authentic silk</p></div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground">Description</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <SectionHeading eyebrow="You May Also Like" title="Related Sarees" />
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
