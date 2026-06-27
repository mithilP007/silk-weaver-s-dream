import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/types";
import { API_BASE } from "@/lib/api";

export interface CartItem {
  product: Product;
  quantity: number;
  dbId?: string;
}

interface StoreContextValue {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  cartCount: number;
  cartSubtotal: number;
  hydrated: boolean;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = "sks_cart";
const WISH_KEY = "sks_wishlist";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from LocalStorage first (for guest and fast loading)
  useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      const w = localStorage.getItem(WISH_KEY);
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  // Sync with persistent backend database if logged in
  useEffect(() => {
    const syncWithBackend = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // 1. Fetch Cart
        const cartRes = await fetch(`${API_BASE}/api/cart`, {
          headers: getHeaders(),
        });
        const cartData = await cartRes.json();
        if (cartRes.ok && cartData.success) {
          const mappedCart: CartItem[] = cartData.data.map((item: any) => {
            const img = item.product.image?.startsWith("http")
              ? item.product.image
              : item.product.image
                ? `${API_BASE}${item.product.image}`
                : "";
            return {
              product: {
                id: item.product.id,
                slug: item.product.slug,
                name: item.product.name,
                price: item.product.price,
                discountPrice: item.product.discountPrice || item.product.price,
                rating: 4.9,
                reviews: 12,
                image: img,
                gallery: [img],
                category: item.product.category?.name || "Silk Sarees",
                subcategory: item.product.category?.name || "Semi Silks",
                subcategorySlug: item.product.category?.slug || "semi-silks",
                stock: item.product.stock,
                fabric: item.product.fabric || "Pure Silk",
                color: item.product.color || "Gold",
                sareeLength: item.product.sareeLength || "6.3 metres",
                blouseLength: item.product.blouseLength || "0.8 metres",
                blouseIncluded: item.product.blouseIncluded !== false,
                featured: item.product.isFeatured || false,
                trending: item.product.isTrending || false,
                offer: item.product.isOffer || false,
                newArrival: true,
                description: item.product.description || "",
                categoryId: item.product.categoryId,
                occasion: ["Wedding"],
              },
              quantity: item.quantity,
              dbId: item.id,
            };
          });
          setCart(mappedCart);
        }

        // 2. Fetch Wishlist
        const wishRes = await fetch(`${API_BASE}/api/wishlist`, {
          headers: getHeaders(),
        });
        const wishData = await wishRes.json();
        if (wishRes.ok && wishData.success) {
          const mappedWish = wishData.data.map((item: any) => {
            const img = item.product.image?.startsWith("http")
              ? item.product.image
              : item.product.image
                ? `${API_BASE}${item.product.image}`
                : "";
            return {
              id: item.product.id,
              slug: item.product.slug,
              name: item.product.name,
              price: item.product.price,
              discountPrice: item.product.discountPrice || item.product.price,
              rating: 4.9,
              reviews: 12,
              image: img,
              gallery: [img],
              category: item.product.category?.name || "Silk Sarees",
              subcategory: item.product.category?.name || "Semi Silks",
              subcategorySlug: item.product.category?.slug || "semi-silks",
              stock: item.product.stock,
              fabric: item.product.fabric || "Pure Silk",
              color: item.product.color || "Gold",
              sareeLength: item.product.sareeLength || "6.3 metres",
              blouseLength: item.product.blouseLength || "0.8 metres",
              blouseIncluded: item.product.blouseIncluded !== false,
              featured: item.product.isFeatured || false,
              trending: item.product.isTrending || false,
              offer: item.product.isOffer || false,
              newArrival: true,
              description: item.product.description || "",
              categoryId: item.product.categoryId,
              occasion: ["Wedding"],
              dbId: item.id,
            };
          });
          setWishlist(mappedWish);
        }
      } catch (err) {
        console.error("Failed to sync cart/wishlist with database", err);
      }
    };

    if (hydrated) {
      syncWithBackend();
    }
  }, [hydrated]);

  const addToCart = async (product: Product, quantity = 1) => {
    // Optimistic UI Update
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { product, quantity }];
    });
    toast.success("Added to cart", { description: product.name });

    // Sync database
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${API_BASE}/api/cart`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ productId: product.id, quantity }),
        });
      } catch (err) {
        console.error("Failed to sync cart item addition", err);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    const targetItem = cart.find((i) => i.product.id === id);
    setCart((prev) => prev.filter((i) => i.product.id !== id));

    const token = localStorage.getItem("token");
    if (token && targetItem?.dbId) {
      try {
        await fetch(`${API_BASE}/api/cart/${targetItem.dbId}`, {
          method: "DELETE",
          headers: getHeaders(),
        });
      } catch (err) {
        console.error("Failed to sync cart item removal", err);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const targetItem = cart.find((i) => i.product.id === id);
    const qty = Math.max(1, quantity);

    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0),
    );

    const token = localStorage.getItem("token");
    if (token && targetItem?.dbId) {
      try {
        await fetch(`${API_BASE}/api/cart/${targetItem.dbId}`, {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({ quantity: qty }),
        });
      } catch (err) {
        console.error("Failed to sync cart quantity update", err);
      }
    }
  };

  const clearCart = async () => {
    setCart([]);

    const token = localStorage.getItem("token");
    if (token) {
      try {
        await fetch(`${API_BASE}/api/cart`, {
          method: "DELETE",
          headers: getHeaders(),
        });
      } catch (err) {
        console.error("Failed to sync cart clear", err);
      }
    }
  };

  const toggleWishlist = async (product: Product) => {
    const isSaved = wishlist.some((p) => p.id === product.id);

    setWishlist((prev) => {
      if (isSaved) {
        toast("Removed from wishlist", { description: product.name });
        return prev.filter((p) => p.id !== product.id);
      }
      toast.success("Saved to wishlist", { description: product.name });
      return [...prev, product];
    });

    const token = localStorage.getItem("token");
    if (token) {
      try {
        if (isSaved) {
          await fetch(`${API_BASE}/api/wishlist/product/${product.id}`, {
            method: "DELETE",
            headers: getHeaders(),
          });
        } else {
          await fetch(`${API_BASE}/api/wishlist`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ productId: product.id }),
          });
        }
      } catch (err) {
        console.error("Failed to sync wishlist toggle", err);
      }
    }
  };

  const isWishlisted = (id: string) => wishlist.some((p) => p.id === id);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce(
    (s, i) => s + (i.product.discountPrice ?? i.product.price) * i.quantity,
    0,
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      cartCount,
      cartSubtotal,
      hydrated,
    }),
    [cart, wishlist, cartCount, cartSubtotal, hydrated],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
