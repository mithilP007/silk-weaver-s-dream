import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  ArrowRight,
  Loader2,
  Calendar,
  CreditCard,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { EmptyState } from "@/components/store/EmptyState";
import { dummyOrders as mockOrders } from "@/data/store";
import { formatINR } from "@/lib/format";
import { useState, useEffect } from "react";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — Sri Kamatchi Silk" }] }),
  component: OrdersPage,
});

const statusStyle: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Processing: "bg-amber-100 text-amber-800",
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-indigo-100 text-indigo-800",
  Packed: "bg-purple-100 text-purple-800",
  Cancelled: "bg-red-100 text-red-800",
  Returned: "bg-gray-100 text-gray-800",
};

function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/api/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const res = await response.json();
        if (res.success) {
          const mapped = res.data.map((o: any) => ({
            id: o.id,
            orderNumber: o.id.substring(0, 8).toUpperCase(),
            date: new Date(o.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            status: o.orderStatus,
            payment: o.paymentMethod,
            paymentStatus: o.paymentStatus,
            total: o.totalAmount,
            items: o.orderItems.map((item: any) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.price,
              quantity: item.quantity,
            })),
          }));
          setOrders(mapped);
        }
      } catch (err) {
        console.error("Orders API fetch offline, using mock backup", err);
        setOrders(mockOrders);
      } finally {
        setIsLoading(false);
      }
    };
    loadOrders();
  }, []);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">My Orders</h1>
        <p className="mt-2 text-muted-foreground">Track and review your purchases.</p>

        <div className="mt-8 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="animate-spin text-primary mr-2" size={20} />
              <span className="text-sm text-muted-foreground">Retrieving saree order log...</span>
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="When you place an order it will appear here."
              action={
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  Start shopping <ArrowRight size={16} />
                </Link>
              }
            />
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground font-mono">
                      Order #{o.orderNumber || o.id}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Calendar size={13} /> Placed on {o.date} · {o.payment} ({o.paymentStatus})
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[o.status] || "bg-secondary text-secondary-foreground"}`}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {o.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">
                        {it.name} × {it.quantity}
                      </span>
                      <span className="font-medium">{formatINR(it.price * it.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-bold text-primary">{formatINR(o.total)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
