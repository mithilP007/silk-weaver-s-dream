import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { Product } from "@/data/types";

export interface CartItem {
  product: Product;
  quantity: number;
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

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

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

  useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart = (product: Product, quantity = 1) => {
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
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.product.id !== id));

  const updateQuantity = (id: string, quantity: number) =>
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0),
    );

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((p) => p.id === product.id)) {
        toast("Removed from wishlist", { description: product.name });
        return prev.filter((p) => p.id !== product.id);
      }
      toast.success("Saved to wishlist", { description: product.name });
      return [...prev, product];
    });
  };

  const isWishlisted = (id: string) => wishlist.some((p) => p.id === id);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.product.discountPrice * i.quantity, 0);

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
