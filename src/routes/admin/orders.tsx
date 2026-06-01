import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Search,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  Truck,
  MapPin,
  Calendar,
  X,
  Loader2,
} from "lucide-react";
import { API_BASE } from "@/lib/api";
import { dummyOrders as initialOrders } from "@/data/store";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await response.json();
      if (res.success) {
        const mapped = res.data.map((o: any) => ({
          id: o.id,
          orderNumber: o.id.substring(0, 8).toUpperCase(),
          createdAt: new Date(o.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
          customerName: o.customerName,
          total: o.totalAmount,
          status: o.orderStatus,
          payment: o.paymentMethod,
          paymentStatus: o.paymentStatus,
          shippingAddress: {
            email: o.user?.email || "customer@example.com",
            phone: o.customerPhone,
            addressLine: o.address,
            city: o.city,
            state: o.state,
            pincode: o.pincode,
          },
          items: o.orderItems.map((item: any) => ({
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }));
        setOrders(mapped);
      } else {
        throw new Error(res.message || "Failed to load order logs.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Offline, loaded mock back-ups.");
      setOrders(initialOrders);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.message || "Failed to update order status");
      }

      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error updating order status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
          Order Fullfillment Log
        </h1>
        <p className="text-sm text-[#6e5d53] mt-1">
          Review customer saree orders, dispatch shipments, and manage statuses.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between rounded-xl border border-[#e8dfd8] bg-white p-4 shadow-soft">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e5d53]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order logs by ID, customer name..."
            className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] py-2.5 pl-10 pr-4 text-sm text-[#2c2623] outline-none focus:border-[#d4af37]"
          />
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={15} className="text-[#6e5d53]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-[#e8dfd8] bg-white px-4 py-2.5 text-sm text-[#2c2623] outline-none focus:border-[#d4af37]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e8dfd8] bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8dfd8] text-[#6e5d53] uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Saree Details</th>
                <th className="py-3.5 px-4">Total Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3ede8] font-medium text-[#2c2623]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[#6e5d53]">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-[#3a1d13]" />
                      <span>Fetching order logs...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-[#6e5d53]">
                    No order logs found.
                  </td>
                </tr>
              ) : (
                filtered.map((o: any) => (
                  <tr key={o.id} className="hover:bg-[#fbfaf7]/65 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-primary">{o.orderNumber}</td>
                    <td className="py-4 px-4">{o.createdAt}</td>
                    <td className="py-4 px-4">
                      <p className="font-bold">{o.customerName}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{o.shippingAddress?.email}</p>
                    </td>
                    <td className="py-4 px-4 max-w-[200px] truncate">
                      {o.items?.map((i: any) => `${i.productName} (x${i.quantity})`).join(", ")}
                    </td>
                    <td className="py-4 px-4 font-bold text-primary">{formatINR(o.total)}</td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                          o.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700"
                            : o.status === "Shipped"
                            ? "bg-blue-50 text-blue-700"
                            : o.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700",
                        )}
                      >
                        {o.status === "Delivered" && <CheckCircle2 size={10} />}
                        {o.status === "Shipped" && <Truck size={10} />}
                        {o.status === "Pending" && <Clock size={10} />}
                        {o.status === "Cancelled" && <XCircle size={10} />}
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded border border-[#e8dfd8] px-2.5 py-1 text-[11px] font-semibold text-[#6e5d53] hover:bg-[#fbfaf7]"
                      >
                        <Eye size={12} /> View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#2c2623]/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#e8dfd8] bg-white p-6 shadow-card sm:p-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-6 top-6 rounded-lg bg-[#fbfaf7] p-2 border border-[#e8dfd8] text-[#6e5d53] hover:text-[#2c2623]"
            >
              <X size={16} />
            </button>

            <h3 className="font-display text-xl font-bold text-[#2c2623]">
              Order Details & Fulfillment
            </h3>
            <div className="flex flex-wrap items-center gap-x-4 mt-2 border-b border-[#f3ede8] pb-4">
              <span className="font-mono font-bold text-sm text-primary">
                {selectedOrder.orderNumber}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Calendar size={12} /> {selectedOrder.createdAt}
              </span>
            </div>

            <div className="mt-6 space-y-6 text-sm text-[#2c2623]">
              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Purchased Sarees</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl border border-[#f3ede8] bg-[#fbfaf7] p-3"
                    >
                      <div>
                        <p className="font-bold text-xs">{item.productName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-primary">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-2 border-t border-[#f3ede8] pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Delivery Destination</h4>
                <div className="rounded-xl border border-[#f3ede8] bg-[#fbfaf7] p-4 text-xs space-y-1">
                  <p className="font-bold text-sm">{selectedOrder.customerName}</p>
                  <p className="text-muted-foreground flex items-start gap-1.5 mt-2">
                    <MapPin size={13} className="shrink-0 text-gold mt-0.5" />
                    <span>
                      {selectedOrder.shippingAddress.addressLine},<br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </span>
                  </p>
                  <p className="text-muted-foreground pt-1.5 font-semibold">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="space-y-3 border-t border-[#f3ede8] pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Fulfillment Actions</h4>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Pending")}
                    className={cn(
                      "rounded-lg border border-[#e8dfd8] px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
                      selectedOrder.status === "Pending"
                        ? "bg-amber-50 border-amber-200 text-amber-700"
                        : "bg-white text-[#6e5d53] hover:bg-[#fbfaf7]",
                    )}
                  >
                    Set Pending
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Shipped")}
                    className={cn(
                      "rounded-lg border border-[#e8dfd8] px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
                      selectedOrder.status === "Shipped"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white text-[#6e5d53] hover:bg-[#fbfaf7]",
                    )}
                  >
                    Set Shipped
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Delivered")}
                    className={cn(
                      "rounded-lg border border-[#e8dfd8] px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
                      selectedOrder.status === "Delivered"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-white text-[#6e5d53] hover:bg-[#fbfaf7]",
                    )}
                  >
                    Set Delivered
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Cancelled")}
                    className={cn(
                      "rounded-lg border border-red-100 px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer",
                      selectedOrder.status === "Cancelled"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-white text-red-600 hover:bg-red-50",
                    )}
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
