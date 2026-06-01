import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { EmptyState } from "@/components/store/EmptyState";
import { dummyOrders } from "@/data/store";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — Sri Kamatchi Silk" }] }),
  component: OrdersPage,
});

const statusStyle: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Processing: "bg-amber-100 text-amber-800",
  Pending: "bg-secondary text-secondary-foreground",
  Cancelled: "bg-red-100 text-red-800",
};

function OrdersPage() {
  const orders = dummyOrders;
  return (
    <StoreLayout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">My Orders</h1>
        <p className="mt-2 text-muted-foreground">Track and review your purchases.</p>
        <div className="mt-8 space-y-4">
          {orders.length === 0 ? (
            <EmptyState icon={Package} title="No orders yet" description="When you place an order it will appear here." action={<Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">Start shopping <ArrowRight size={16} /></Link>} />
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Order {o.id}</p>
                    <p className="text-xs text-muted-foreground">Placed on {o.date} · {o.payment}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[o.status]}`}>{o.status}</span>
                </div>
                <div className="mt-4 space-y-2">
                  {o.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{it.name} × {it.quantity}</span>
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
