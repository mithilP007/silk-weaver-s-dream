import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/data/types";
import { useStore } from "@/store/StoreContext";
import { formatINR, discountPercent } from "@/lib/format";
import { StarRating } from "./StarRating";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wished = isWishlisted(product.id);
  const off = discountPercent(product.price, product.discountPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
              {off}% OFF
            </span>
          )}
          {product.newArrival && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-semibold text-gold-foreground shadow-sm">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          aria-label="Add to wishlist"
          onClick={() => toggleWishlist(product)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-card"
        >
          <Heart size={16} className={cn(wished && "fill-primary text-primary")} />
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={() => addToCart(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
          >
            <ShoppingBag size={14} /> Add to Cart
          </button>
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            aria-label="Quick view"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-card text-foreground shadow-md transition-colors hover:bg-accent"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] uppercase tracking-wider text-gold">
          {product.subcategory}
        </span>
        <Link to="/product/$slug" params={{ slug: product.slug }}>
          <h3 className="mt-1 line-clamp-2 text-[15px] font-medium leading-snug text-foreground transition-colors hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <StarRating rating={product.rating} reviews={product.reviews} showValue className="mt-2" />
        <div className="mt-3 flex items-center gap-2">
          <span className="text-lg font-semibold text-primary">
            {formatINR(product.discountPrice)}
          </span>
          {off > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatINR(product.price)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
