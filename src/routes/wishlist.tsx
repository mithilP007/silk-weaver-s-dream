import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { EmptyState } from "@/components/store/EmptyState";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "My Wishlist — Sri Kamatchi Silk" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { wishlist } = useStore();
  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">My Wishlist</h1>
        <p className="mt-2 text-muted-foreground">{wishlist.length} saved item(s)</p>
        <div className="mt-8">
          {wishlist.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Start saving the sarees you love and find them all here."
              action={
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  <ShoppingBag size={16} /> Explore Sarees
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {wishlist.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
