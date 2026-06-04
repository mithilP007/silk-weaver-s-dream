import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { formatINR } from "@/lib/format";
import { useState, useEffect, useMemo } from "react";
import { API_BASE } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const [prodRes, orderRes, userRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`),
          fetch(`${API_BASE}/api/orders`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE}/api/users`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const prods = await prodRes.json();
        const ordersData = await orderRes.json();
        const usersData = await userRes.json();

        if (prods.success) setDbProducts(prods.data);
        if (ordersData.success) setDbOrders(ordersData.data);
        if (usersData.success) setDbUsers(usersData.data);
      } catch (err) {
        console.error("Dashboard API fetch error", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const liveProducts = useMemo(() => {
    return dbProducts.map((p) => {
      const img = p.image?.startsWith("http")
        ? p.image
        : (p.image ? `${API_BASE}${p.image}` : "");
      return {
        ...p,
        image: img
      };
    });
  }, [dbProducts]);

  const liveOrders = useMemo(() => {
    return dbOrders.map((o: any) => ({
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
      items: o.orderItems?.map((item: any) => ({
        productName: item.product?.name || "Silk Saree",
        quantity: item.quantity,
        price: item.price,
      })) || [],
    }));
  }, [dbOrders]);

  const recentOrders = useMemo(() => {
    return liveOrders.slice(0, 5);
  }, [liveOrders]);

  const lowStockProducts = useMemo(() => {
    return liveProducts.filter((p) => p.stock < 5);
  }, [liveProducts]);

  // Adjust stats dynamically using real DB data only
  const stats = useMemo(() => {
    const totalSalesVal = dbOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrdersCount = dbOrders.length;
    const realCustomersCount = dbUsers.filter(u => u.role !== "admin").length;
    const lowStockCount = lowStockProducts.length;

    return [
      {
        label: "Total Sales",
        value: formatINR(totalSalesVal),
        change: totalOrdersCount > 0 ? "Real-time boutique revenue" : "No sales data available",
        trend: "up",
        icon: TrendingUp,
        color: "bg-[#d4af37]/10 text-[#d4af37]",
      },
      {
        label: "Total Orders",
        value: `${totalOrdersCount}`,
        change: totalOrdersCount > 0 ? "Completed checkout orders" : "No orders yet",
        trend: "up",
        icon: ShoppingBag,
        color: "bg-emerald-50 text-emerald-600",
      },
      {
        label: "Customers",
        value: `${realCustomersCount}`,
        change: "Registered client accounts",
        trend: "up",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
      },
      {
        label: "Low Stock Alert",
        value: `${lowStockCount} Items`,
        change: lowStockCount > 0 ? "Requires loom attention" : "All items well stocked",
        trend: lowStockCount > 0 ? "down" : "up",
        icon: AlertTriangle,
        color: lowStockCount > 0 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600",
      },
    ];
  }, [dbOrders, dbUsers, lowStockProducts]);

  // Sales chart calculations
  const monthlySales = useMemo(() => {
    const months: any[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("en-IN", { month: "short" }),
        year: d.getFullYear(),
        month: d.getMonth(),
        sales: 0
      });
    }

    dbOrders.forEach((o: any) => {
      const orderDate = new Date(o.createdAt);
      const match = months.find(
        (m: any) => m.year === orderDate.getFullYear() && m.month === orderDate.getMonth()
      );
      if (match) {
        match.sales += o.totalAmount;
      }
    });

    return months;
  }, [dbOrders]);

  const maxSales = useMemo(() => {
    return Math.max(...monthlySales.map((m) => m.sales), 1000);
  }, [monthlySales]);

  const hasSalesData = useMemo(() => {
    return dbOrders.length > 0 && monthlySales.some((m) => m.sales > 0);
  }, [dbOrders, monthlySales]);

  const svgPoints = useMemo(() => {
    return monthlySales.map((m, idx) => {
      const x = idx * 120; // range 0 to 600
      const y = 160 - (m.sales / maxSales) * 120; // range 40 to 160
      return { x, y };
    });
  }, [monthlySales, maxSales]);

  const pathD = useMemo(() => {
    if (svgPoints.length === 0) return "";
    return `M ${svgPoints[0].x} ${svgPoints[0].y} ` + svgPoints.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
  }, [svgPoints]);

  const areaD = useMemo(() => {
    if (svgPoints.length === 0) return "";
    return `${pathD} L ${svgPoints[svgPoints.length - 1].x} 200 L 0 200 Z`;
  }, [pathD, svgPoints]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-sm text-[#6e5d53] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#3a1d13]" />
        <span className="font-semibold">Retrieving overview analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
          Overview Dashboard
        </h1>
        <p className="text-sm text-[#6e5d53] mt-1">
          Welcome back. Here is the latest performance summary of your Kanchipuram boutique.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat: any, idx: number) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6e5d53]">
                {stat.label}
              </span>
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${stat.color}`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="mt-4">
              <span className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
                {stat.value}
              </span>
              <span
                className={`block text-[11px] font-medium mt-1 ${
                  stat.trend === "up" ? "text-emerald-600" : "text-[#6e5d53]"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Analytical Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart Card */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#f3ede8] pb-4">
            <h3 className="font-display text-lg font-bold text-[#2c2623]">Sales Analytical Curve</h3>
            <span className="rounded-full bg-[#fbfaf7] border border-[#e8dfd8] px-3 py-1 text-[11px] font-semibold text-[#6e5d53]">
              Monthly View
            </span>
          </div>

          <div className="mt-6 flex h-60 w-full flex-col justify-between relative">
            {!hasSalesData ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] z-10">
                <p className="text-sm font-semibold text-muted-foreground italic">No sales data available</p>
              </div>
            ) : null}
            <div className="relative flex-1">
              <svg className="h-full w-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#f5eeea" strokeDasharray="3,3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="#f5eeea" strokeDasharray="3,3" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="#f5eeea" strokeDasharray="3,3" />
                
                {hasSalesData && (
                  <>
                    <path d={areaD} fill="url(#chartGrad)" />
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#d4af37"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {svgPoints.map((p, idx) => (
                      <circle key={idx} cx={p.x} cy={p.y} r="5" fill="#3a1d13" stroke="#d4af37" strokeWidth="2" />
                    ))}
                  </>
                )}
              </svg>
            </div>
            <div className="flex justify-between border-t border-[#f5eeea] pt-3 text-[10px] uppercase tracking-wider text-[#6e5d53] font-semibold">
              {monthlySales.map((m, idx) => (
                <span key={idx}>{m.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Stock Alerts Watch */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft">
          <div className="flex items-center justify-between border-b border-[#f3ede8] pb-4">
            <h3 className="font-display text-lg font-bold text-[#2c2623]">Stock Watch</h3>
            <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
              {lowStockProducts.length} Alerts
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-8">No low stock products</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl border border-[#f3ede8] bg-[#fbfaf7] p-3">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-10 w-8 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-8 bg-sidebar-accent rounded flex items-center justify-center text-[8px] text-muted-foreground font-semibold">No Image</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-xs font-semibold text-[#2c2623]">{p.name}</p>
                    <p className="text-[10px] text-amber-700 font-medium">Only {p.stock} pieces left in loom</p>
                  </div>
                  <Link to="/admin/products" className="text-[#6e5d53] hover:text-primary shrink-0">
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders table */}
      <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between border-b border-[#f3ede8] pb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[#2c2623]">Recent Bridal & Store Orders</h3>
            <p className="text-xs text-[#6e5d53]">Operational processing view of the 5 latest customer orders.</p>
          </div>
          <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#d4af37] hover:underline">
            Manage all logs <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="mt-6 overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-12">No orders yet</p>
          ) : (
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#e8dfd8] text-[#6e5d53] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Sarees</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3ede8] font-medium">
                {recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-[#fbfaf7]/65 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">{o.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#2c2623]">{o.customerName}</p>
                      <p className="text-[10px] text-muted-foreground">{o.shippingAddress?.phone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {o.items?.map((it: any) => `${it.productName} (x${it.quantity})`).join(", ")}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-primary">{formatINR(o.total)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        o.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                        o.status === "Shipped" ? "bg-blue-50 text-blue-700" :
                        o.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-muted text-muted-foreground"
                      }`}>
                        {o.status === "Delivered" ? <CheckCircle2 size={10} /> :
                         o.status === "Shipped" ? <Clock size={10} /> :
                         o.status === "Pending" ? <Clock size={10} /> : <RotateCcw size={10} />}
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-[#6e5d53] hover:text-primary">
                        <Eye size={13} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
