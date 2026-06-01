import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CreditCard, Banknote, Lock } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useStore } from "@/store/StoreContext";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Sri Kamatchi Silk" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const [pay, setPay] = useState<"razorpay" | "cod">("razorpay");
  const shipping = cartSubtotal > 4999 || cartSubtotal === 0 ? 0 : 99;
  const total = cartSubtotal + shipping;

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Order placed!", { description: "This is a demo — connect a backend to process orders." });
    clearCart();
  };

  const field = "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-gold";

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Checkout</h1>
        <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input required placeholder="Full name" className={field} />
                <input required placeholder="Phone number" className={field} />
                <input required placeholder="Email" type="email" className={`${field} sm:col-span-2`} />
                <input required placeholder="Address line" className={`${field} sm:col-span-2`} />
                <input required placeholder="City" className={field} />
                <input required placeholder="State" className={field} />
                <input required placeholder="Pincode" className={field} />
                <input placeholder="Landmark (optional)" className={field} />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground">Payment Method</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${pay === "razorpay" ? "border-gold bg-secondary/50" : "border-border"}`}>
                  <input type="radio" checked={pay === "razorpay"} onChange={() => setPay("razorpay")} className="accent-[var(--primary)]" />
                  <CreditCard size={20} className="text-primary" />
                  <span className="text-sm font-medium">Razorpay (Cards, UPI, Netbanking)</span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${pay === "cod" ? "border-gold bg-secondary/50" : "border-border"}`}>
                  <input type="radio" checked={pay === "cod"} onChange={() => setPay("cod")} className="accent-[var(--primary)]" />
                  <Banknote size={20} className="text-primary" />
                  <span className="text-sm font-medium">Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground">Your Order</h2>
            <div className="mt-4 max-h-60 space-y-3 overflow-y-auto">
              {cart.map((i) => (
                <div key={i.product.id} className="flex items-center gap-3">
                  <img src={i.product.image} alt={i.product.name} className="h-14 w-12 rounded-lg object-cover" />
                  <div className="flex-1 text-sm"><p className="line-clamp-1 font-medium">{i.product.name}</p><p className="text-muted-foreground">Qty {i.quantity}</p></div>
                  <span className="text-sm font-medium">{formatINR(i.product.discountPrice * i.quantity)}</span>
                </div>
              ))}
              {cart.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty. <Link to="/shop" className="text-primary">Shop now</Link></p>}
            </div>
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(cartSubtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total</dt><dd className="text-primary">{formatINR(total)}</dd></div>
            </dl>
            <button disabled={cart.length === 0} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50">
              <Lock size={15} /> Place Order
            </button>
          </div>
        </form>
      </div>
    </StoreLayout>
  );
}
