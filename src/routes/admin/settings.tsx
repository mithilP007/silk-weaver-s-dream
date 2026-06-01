import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, Truck, Sparkles, HelpCircle, Save, Settings, ToggleLeft, ToggleRight, Loader2, Image } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);

  // Payment States
  const [rzpActive, setRzpActive] = useState(true);
  const [rzpMode, setRzpMode] = useState("test");
  const [rzpKeyId, setRzpKeyId] = useState("");
  const [rzpSecret, setRzpSecret] = useState("");

  // Shipping States
  const [shipFreeAbove, setShipFreeAbove] = useState(4999);
  const [shipCharge, setShipCharge] = useState(99);
  const [shipCod, setShipCod] = useState(true);
  const [shipDays, setShipDays] = useState(5);
  const [shipReturnDays, setShipReturnDays] = useState(7);

  // Home Settings States
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [offerBanner, setOfferBanner] = useState("");

  // Homepage Settings Blocks (Local Toggles)
  const [blockHero, setBlockHero] = useState(true);
  const [blockTrending, setBlockTrending] = useState(true);
  const [blockOccasion, setBlockOccasion] = useState(true);
  const [blockTestimonial, setBlockTestimonial] = useState(true);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 1. Fetch Shipping Settings
      const shipRes = await fetch("http://localhost:5000/api/settings/shipping");
      const shipData = await shipRes.json();
      if (shipData.success && shipData.data) {
        setShipFreeAbove(shipData.data.freeShippingAbove);
        setShipCharge(shipData.data.shippingCharge);
        setShipCod(shipData.data.codEnabled);
        setShipDays(shipData.data.deliveryDays);
      }

      // 2. Fetch Payment Settings (Protected)
      if (token) {
        const payRes = await fetch("http://localhost:5000/api/settings/payment", { headers });
        const payData = await payRes.json();
        if (payData.success && payData.data) {
          setRzpActive(payData.data.razorpayEnabled);
          setRzpKeyId(payData.data.razorpayKeyId || "");
          setRzpSecret(payData.data.razorpaySecret || "");
          setRzpMode(payData.data.razorpayKeyId?.startsWith("rzp_live") ? "live" : "test");
        }
      }

      // 3. Fetch Home Settings
      const homeRes = await fetch("http://localhost:5000/api/settings/home");
      const homeData = await homeRes.json();
      if (homeData.success && homeData.data) {
        setHeroTitle(homeData.data.heroTitle || "");
        setHeroSubtitle(homeData.data.heroSubtitle || "");
        setHeroImage(homeData.data.heroImage || "");
        setOfferBanner(homeData.data.offerBanner || "");
      }
    } catch (err) {
      console.error("Error loading boutique settings:", err);
      toast.error("Failed to load backend configuration settings");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not logged in as admin");
        return;
      }

      let url = "";
      let body = {};

      if (type === "Payment Gateway") {
        url = "http://localhost:5000/api/settings/payment";
        body = {
          razorpayKeyId: rzpKeyId,
          razorpaySecret: rzpSecret,
          razorpayEnabled: rzpActive,
        };
      } else if (type === "Logistics & Shipping") {
        url = "http://localhost:5000/api/settings/shipping";
        body = {
          freeShippingAbove: shipFreeAbove,
          shippingCharge: shipCharge,
          codEnabled: shipCod,
          deliveryDays: shipDays,
        };
      } else if (type === "Homepage Banners") {
        url = "http://localhost:5000/api/settings/home";
        body = {
          heroTitle,
          heroSubtitle,
          heroImage,
          offerBanner,
        };
      } else {
        // Mock fallback for visual local block toggles
        toast.success("Homepage blocks layout toggled locally!");
        return;
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const res = await response.json();
      if (!response.ok || !res.success) {
        throw new Error(res.message || "Failed to update settings");
      }

      toast.success(`${type} configurations saved live in database!`);
      fetchSettings();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update configuration settings");
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-sm text-[#6e5d53] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-[#3a1d13]" />
        <span className="font-semibold">Retrieving boutique database configurations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-[#2c2623] sm:text-3xl">
          Boutique Configurations & Settings
        </h1>
        <p className="text-sm text-[#6e5d53] mt-1">
          Adjust Razorpay gateway settings, logistics transit options, and toggle home sections.
        </p>
      </div>

      {/* Grid Settings Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payment Gateways Config */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f3ede8] pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Razorpay Payment Integration</h3>
              <p className="text-[10px] text-muted-foreground">Manage your online credit card, UPI, and net-banking gateway.</p>
            </div>
          </div>

          <form onSubmit={(e) => handleSaveSettings(e, "Payment Gateway")} className="space-y-4 text-sm text-[#2c2623]">
            <div className="flex items-center justify-between rounded-xl bg-[#fbfaf7] border border-[#f3ede8] p-3.5">
              <div>
                <p className="font-bold text-xs">Enable Razorpay Payments</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Let clients pay securely online at checkout.</p>
              </div>
              <button
                type="button"
                onClick={() => setRzpActive(!rzpActive)}
                className="shrink-0 cursor-pointer"
              >
                {rzpActive ? (
                  <ToggleRight size={32} className="text-[#d4af37]" />
                ) : (
                  <ToggleLeft size={32} className="text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Gateway Mode</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRzpMode("test")}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer",
                    rzpMode === "test"
                      ? "border-[#d4af37] bg-[#fbfaf7] text-primary"
                      : "border-[#e8dfd8] bg-white text-[#6e5d53] hover:bg-[#fbfaf7]",
                  )}
                >
                  Test/Sandbox Mode
                </button>
                <button
                  type="button"
                  onClick={() => setRzpMode("live")}
                  className={cn(
                    "flex-1 rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer",
                    rzpMode === "live"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-[#e8dfd8] bg-white text-[#6e5d53] hover:bg-[#fbfaf7]",
                  )}
                >
                  Live Production Mode
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Razorpay Key ID</label>
              <input
                type="text"
                required
                value={rzpKeyId}
                onChange={(e) => setRzpKeyId(e.target.value)}
                placeholder="e.g. rzp_test_..."
                className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Razorpay Key Secret</label>
              <input
                type="password"
                required
                value={rzpSecret}
                onChange={(e) => setRzpSecret(e.target.value)}
                placeholder="e.g. key secret"
                className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] font-mono text-xs"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f3ede8]">
              <button
                type="submit"
                className="rounded-xl bg-[#3a1d13] text-white px-5 py-3 text-xs font-bold hover:bg-[#4d2d22] flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} /> Save Gateway
              </button>
            </div>
          </form>
        </div>

        {/* Shipping & Delivery Config */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f3ede8] pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Logistics & Shipping Rules</h3>
              <p className="text-[10px] text-muted-foreground">Adjust dispatch fees and estimate courier shipping calendars.</p>
            </div>
          </div>

          <form onSubmit={(e) => handleSaveSettings(e, "Logistics & Shipping")} className="space-y-4 text-sm text-[#2c2623]">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Standard Shipping (₹)</label>
                <input
                  type="number"
                  required
                  value={shipCharge}
                  onChange={(e) => setShipCharge(+e.target.value)}
                  className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Free Shipping Cap (₹)</label>
                <input
                  type="number"
                  required
                  value={shipFreeAbove}
                  onChange={(e) => setShipFreeAbove(+e.target.value)}
                  className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Courier Delivery Days</label>
                <input
                  type="number"
                  required
                  value={shipDays}
                  onChange={(e) => setShipDays(+e.target.value)}
                  className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Return Policy Calendar</label>
                <input
                  type="number"
                  required
                  value={shipReturnDays}
                  onChange={(e) => setShipReturnDays(+e.target.value)}
                  className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#fbfaf7] border border-[#f3ede8] p-3.5 mt-2">
              <div>
                <p className="font-bold text-xs">Activate Cash on Delivery (COD)</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Let clients pay cash upon saree dropoff.</p>
              </div>
              <button
                type="button"
                onClick={() => setShipCod(!shipCod)}
                className="shrink-0 cursor-pointer"
              >
                {shipCod ? (
                  <ToggleRight size={32} className="text-[#d4af37]" />
                ) : (
                  <ToggleLeft size={32} className="text-muted-foreground" />
                )}
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f3ede8]">
              <button
                type="submit"
                className="rounded-xl bg-[#3a1d13] text-white px-5 py-3 text-xs font-bold hover:bg-[#4d2d22] flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} /> Save Logistics
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Homepage Blocks Settings */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f3ede8] pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Homepage Section Toggles</h3>
              <p className="text-[10px] text-muted-foreground">Enable or disable visual sections on the boutique home page.</p>
            </div>
          </div>

          <form onSubmit={(e) => handleSaveSettings(e, "Homepage Blocks")} className="space-y-4 text-sm text-[#2c2623]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl bg-[#fbfaf7] border border-[#f3ede8] p-3.5">
                <div>
                  <p className="font-bold text-xs">Hero Brand Carousel</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Displays top heritage banners.</p>
                </div>
                <button type="button" onClick={() => setBlockHero(!blockHero)} className="shrink-0 cursor-pointer">
                  {blockHero ? <ToggleRight size={32} className="text-[#d4af37]" /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#fbfaf7] border border-[#f3ede8] p-3.5">
                <div>
                  <p className="font-bold text-xs">Trending arrivals</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Displays real-time saree lists.</p>
                </div>
                <button type="button" onClick={() => setBlockTrending(!blockTrending)} className="shrink-0 cursor-pointer">
                  {blockTrending ? <ToggleRight size={32} className="text-[#d4af37]" /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#fbfaf7] border border-[#f3ede8] p-3.5">
                <div>
                  <p className="font-bold text-xs">Curated Occasions</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Browse sarees by occasion finder.</p>
                </div>
                <button type="button" onClick={() => setBlockOccasion(!blockOccasion)} className="shrink-0 cursor-pointer">
                  {blockOccasion ? <ToggleRight size={32} className="text-[#d4af37]" /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[#fbfaf7] border border-[#f3ede8] p-3.5">
                <div>
                  <p className="font-bold text-xs">Customer Testimonials</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Displays bride styling quotes.</p>
                </div>
                <button type="button" onClick={() => setBlockTestimonial(!blockTestimonial)} className="shrink-0 cursor-pointer">
                  {blockTestimonial ? <ToggleRight size={32} className="text-[#d4af37]" /> : <ToggleLeft size={32} className="text-muted-foreground" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f3ede8]">
              <button type="submit" className="rounded-xl bg-[#3a1d13] text-white px-5 py-3 text-xs font-bold hover:bg-[#4d2d22] flex items-center gap-1.5 cursor-pointer">
                <Save size={14} /> Toggle Layout Blocks
              </button>
            </div>
          </form>
        </div>

        {/* Homepage Banner Editorial Copy Settings (Database connected) */}
        <div className="rounded-2xl border border-[#e8dfd8] bg-white p-6 shadow-soft space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f3ede8] pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700">
              <Image size={20} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold">Homepage Banners & Editorial Copy</h3>
              <p className="text-[10px] text-muted-foreground">Modify promotional titles, subtitles and showpiece banners.</p>
            </div>
          </div>

          <form onSubmit={(e) => handleSaveSettings(e, "Homepage Banners")} className="space-y-4 text-sm text-[#2c2623]">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Hero Section Title</label>
              <input
                type="text"
                required
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. Draped in Timeless Elegance"
                className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] text-xs font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Hero Section Subtitle</label>
              <textarea
                rows={2}
                required
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                placeholder="Describe the main focal value proposition..."
                className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] text-xs resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6e5d53]">Promotional Wedding Offer Banner Text</label>
              <textarea
                rows={2}
                required
                value={offerBanner}
                onChange={(e) => setOfferBanner(e.target.value)}
                placeholder="Explain the active seasonal discount campaign..."
                className="w-full rounded-xl border border-[#e8dfd8] bg-[#fbfaf7] px-3.5 py-3 outline-none focus:border-[#d4af37] text-xs resize-none"
              />
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f3ede8]">
              <button
                type="submit"
                className="rounded-xl bg-[#3a1d13] text-white px-5 py-3 text-xs font-bold hover:bg-[#4d2d22] flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} /> Save Banner Content
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
