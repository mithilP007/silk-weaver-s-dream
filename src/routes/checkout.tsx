import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CreditCard, Banknote, Lock, Loader2, Sparkles, AlertTriangle, ShieldCheck } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useStore } from "@/store/StoreContext";
import { formatINR } from "@/lib/format";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Sri Kamatchi Silk" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, cartSubtotal, clearCart } = useStore();
  const [pay, setPay] = useState<"razorpay" | "cod">("razorpay");
  const shipping = cartSubtotal > 4999 || cartSubtotal === 0 ? 0 : 99;
  const total = cartSubtotal + shipping;

  const navigate = useNavigate();

  // Address & Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");

  const [isPlacing, setIsPlacing] = useState(false);
  const [showSimulatedRzp, setShowSimulatedRzp] = useState(false);
  const [simulatedRzpOrderId, setSimulatedRzpOrderId] = useState("");
  const [simulatedDbOrderId, setSimulatedDbOrderId] = useState("");

  // Load user data if logged in
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required", {
        description: "Please log in or create an account to complete your luxury saree order.",
      });
      navigate({ to: "/login" });
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacing(true);

    try {
      // 1. Create order on the backend
      const orderPayload = {
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        paymentMethod: pay === "cod" ? "Cash on Delivery" : "Razorpay",
        customerName: name,
        customerPhone: phone,
        address: landmark ? `${address} (Landmark: ${landmark})` : address,
        city,
        state,
        pincode,
      };

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || "Failed to create order on server.");
      }

      const dbOrder = resData.data;

      // 2. Handle payment method routing
      if (pay === "cod") {
        toast.success("Order placed successfully!", {
          description: "Thank you for shopping at Sri Kamatchi Silk.",
        });
        clearCart();
        navigate({ to: "/orders" });
      } else {
        // Razorpay Payment flow
        // Fetch simulated Razorpay Order ID from backend
        const rzpRes = await fetch(`${API_BASE}/api/payments/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            orderId: dbOrder.id,
            amount: total,
          }),
        });

        const rzpData = await rzpRes.json();
        if (!rzpRes.ok || !rzpData.success) {
          throw new Error(rzpData.message || "Razorpay order creation failed.");
        }

        // Open custom simulated sandbox widget overlay
        setSimulatedRzpOrderId(rzpData.id);
        setSimulatedDbOrderId(dbOrder.id);
        setShowSimulatedRzp(true);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Checkout failed. Please try again.");
    } finally {
      setIsPlacing(false);
    }
  };

  const handleSimulatedPaymentSuccess = async () => {
    setIsPlacing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/api/payments/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 12)}`,
          razorpay_order_id: simulatedRzpOrderId,
          razorpay_signature: "simulated_signature_hash_value",
          receipt_order_id: simulatedDbOrderId,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Payment verification failed.");
      }

      toast.success("Payment successful! Order confirmed.", {
        description: "Your handloom saree is being prepped for dispatch.",
      });
      setShowSimulatedRzp(false);
      clearCart();
      navigate({ to: "/orders" });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Payment confirmation failed");
    } finally {
      setIsPlacing(false);
    }
  };

  const field = "w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-gold disabled:opacity-70";

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Checkout</h1>

        {/* Login warning banner if guest */}
        {!localStorage.getItem("token") && (
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs font-medium text-amber-800">
            <AlertTriangle className="shrink-0 text-amber-600" size={16} />
            <div className="flex-1">
              <span>You are checking out as a Guest. </span>
              <Link to="/login" className="font-bold underline hover:text-amber-950">Log in now</Link>
              <span> to persistently track this order and save sarees.</span>
            </div>
          </div>
        )}

        <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground">Shipping Address</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Full name"
                  className={field}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isPlacing}
                />
                <input
                  required
                  placeholder="Phone number"
                  className={field}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isPlacing}
                />
                <input
                  required
                  placeholder="Email"
                  type="email"
                  className={`${field} sm:col-span-2`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPlacing}
                />
                <input
                  required
                  placeholder="Address line"
                  className={`${field} sm:col-span-2`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isPlacing}
                />
                <input
                  required
                  placeholder="City"
                  className={field}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={isPlacing}
                />
                <input
                  required
                  placeholder="State"
                  className={field}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isPlacing}
                />
                <input
                  required
                  placeholder="Pincode"
                  className={field}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  disabled={isPlacing}
                />
                <input
                  placeholder="Landmark (optional)"
                  className={field}
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  disabled={isPlacing}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-foreground">Payment Method</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${pay === "razorpay" ? "border-gold bg-secondary/50" : "border-border"}`}>
                  <input type="radio" checked={pay === "razorpay"} onChange={() => setPay("razorpay")} disabled={isPlacing} className="accent-[var(--primary)]" />
                  <CreditCard size={20} className="text-primary" />
                  <span className="text-sm font-medium">Razorpay (Cards, UPI, Netbanking)</span>
                </label>
                <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${pay === "cod" ? "border-gold bg-secondary/50" : "border-border"}`}>
                  <input type="radio" checked={pay === "cod"} onChange={() => setPay("cod")} disabled={isPlacing} className="accent-[var(--primary)]" />
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
                  <span className="text-sm font-medium">{formatINR((i.product.discountPrice ?? i.product.price) * i.quantity)}</span>
                </div>
              ))}
              {cart.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty. <Link to="/shop" className="text-primary">Shop now</Link></p>}
            </div>
            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatINR(cartSubtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{shipping === 0 ? "Free" : formatINR(shipping)}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold"><dt>Total</dt><dd className="text-primary">{formatINR(total)}</dd></div>
            </dl>
            <button
              disabled={cart.length === 0 || isPlacing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground disabled:opacity-50 cursor-pointer"
            >
              {isPlacing ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
              {isPlacing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>

      {/* Simulated Razorpay Payment Modal Overlay */}
      {showSimulatedRzp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#2c2623]/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-card text-center animate-in zoom-in-95 duration-200">
            <Sparkles className="mx-auto text-[#d4af37] animate-bounce mb-3" size={32} />
            <h3 className="font-display text-xl font-bold text-[#2c2623]">Razorpay Secure Checkout</h3>
            <p className="text-xs text-[#6e5d53] mt-1.5 uppercase tracking-widest font-semibold">Boutique Sandbox Gateway</p>
            <div className="my-5 border-y border-[#f3ede8] py-4 text-sm space-y-2">
              <div className="flex justify-between text-xs text-[#6e5d53]"><span>Order Reference</span><span className="font-mono font-semibold">{simulatedRzpOrderId}</span></div>
              <div className="flex justify-between font-bold text-primary"><span>Total Amount</span><span>{formatINR(total)}</span></div>
            </div>

            <div className="rounded-xl bg-[#fbfaf7] border border-[#f3ede8] p-3 text-[11px] text-[#6e5d53] leading-relaxed mb-6 flex items-start gap-2 text-left">
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={14} />
              <span>This is a secure simulated billing environment. Clicking success will invoke backend verification and persistently record payment structures.</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleSimulatedPaymentSuccess}
                disabled={isPlacing}
                className="w-full rounded-xl bg-[#3a1d13] text-white py-3 text-xs font-bold hover:bg-[#4d2d22] disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isPlacing ? <Loader2 size={13} className="animate-spin" /> : null}
                Authorize Successful Payment
              </button>
              <button
                onClick={() => {
                  setShowSimulatedRzp(false);
                  toast.error("Payment cancelled by customer.");
                }}
                disabled={isPlacing}
                className="w-full rounded-xl border border-[#e8dfd8] text-[#6e5d53] py-3 text-xs font-bold hover:bg-[#fbfaf7] disabled:opacity-50 cursor-pointer"
              >
                Cancel & Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </StoreLayout>
  );
}
