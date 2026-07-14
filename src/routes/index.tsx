import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, Quote, Instagram, HelpCircle } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SectionHeading } from "@/components/store/SectionHeading";
import { ProductCard } from "@/components/store/ProductCard";
import { StarRating } from "@/components/store/StarRating";
import { products } from "@/data/products";
import { subcategories } from "@/data/categories";
import { testimonials as staticTestimonials } from "@/data/store";
import { API_BASE } from "@/lib/api";
import { formatINR } from "@/lib/format";
import sriKamatchiSilksBanner from "@/assets/sri-kamatchi-silks-banner.png";
import saree2 from "@/assets/saree-2.jpg";
import saree5 from "@/assets/saree-5.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sri Kamatchi Silk — Premium Kanchipuram & Luxury Silk Sarees" },
      {
        name: "description",
        content:
          "Shop handcrafted luxury silk sarees — Kanchipuram, semi silk, cotton silk, luxury & celebrity collections for weddings and festivals.",
      },
      { property: "og:title", content: "Sri Kamatchi Silk — Premium Silk Sarees" },
      {
        property: "og:description",
        content: "Handcrafted luxury silk sarees for weddings, festivals and everyday elegance.",
      },
    ],
  }),
  component: HomePage,
});

const getIconByName = (name: string) => {
  const IconComponent = (Icons as any)[name];
  return IconComponent || HelpCircle;
};

function HomePage() {
  const [settings, setSettings] = useState<any>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings/home`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch((err) => console.error("Error fetching homepage settings:", err));

    fetch(`${API_BASE}/api/categories`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setDbCategories(res.data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Extraction of settings with fallback values
  const hero = settings?.hero || {
    eyebrow: "Heritage Weaves",
    title: "Draped in Timeless Elegance",
    subtitle:
      "Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury silk sarees, made for the moments you'll cherish forever.",
    primaryCtaText: "Explore Collection",
    primaryCtaLink: "/silk-sarees",
    secondaryCtaText: "Shop All Sarees",
    secondaryCtaLink: "/shop",
    imageUrl: "",
    ratingValue: "4.9/5",
    ratingText: "Rated by 12,000+ brides",
    stats: [
      { value: "25+", label: "Years of Heritage" },
      { value: "50k+", label: "Happy Customers" },
      { value: "100%", label: "Pure Silk" },
    ],
  };

  const toggles = settings?.toggles || {
    heroCarousel: true,
    trendingArrivals: true,
    curatedOccasions: true,
    customerTestimonials: true,
    featuredCollections: true,
    weddingBanner: true,
    festivalBanner: true,
    newArrivals: true,
    celebritySection: true,
    instagramGallery: true,
    newsletter: true,
  };

  const categoriesSection = settings?.categoriesSection || {
    eyebrow: "The House of Silk",
    title: "Silk Sarees",
    subtitle:
      "Handwoven heritage drapes crafted by master weavers — explore our signature collections.",
  };

  const trendingSections = settings?.trendingSections || {
    trendingTitle: "Trending Sarees",
    trendingEyebrow: "Most Loved",
    newArrivalsTitle: "New Arrivals",
    newArrivalsEyebrow: "Fresh Off the Loom",
    celebrityTitle: "Celebrity Inspired",
    celebrityEyebrow: "As Seen on Stars",
    maxProducts: 4,
  };

  const occasionFinder = settings?.occasionFinder || {
    eyebrow: "Curated for You",
    title: "Find Your Saree by Occasion",
    subtitle: "Whatever the moment, we have the perfect drape to match it.",
    items: [
      { name: "Wedding", icon: "Crown" },
      { name: "Reception", icon: "Sparkles" },
      { name: "Festival", icon: "PartyPopper" },
      { name: "Temple Visit", icon: "Landmark" },
      { name: "Daily Wear", icon: "Sun" },
      { name: "Gift", icon: "Gift" },
    ],
  };

  const promiseSection = settings?.promiseSection || {
    eyebrow: "The Promise",
    title: "Why Choose Sri Kamatchi Silk",
    cards: [
      {
        title: "Authentic Handloom",
        text: "Certified pure silk woven by master artisans.",
        icon: "Award",
      },
      {
        title: "Trusted Quality",
        text: "Each saree quality-checked & zari-tested.",
        icon: "ShieldCheck",
      },
      {
        title: "Pan-India Delivery",
        text: "Safe, insured shipping to your doorstep.",
        icon: "Truck",
      },
      {
        title: "Personal Styling",
        text: "Dedicated stylists to help you choose.",
        icon: "Headphones",
      },
    ],
  };

  const dbTestimonials = settings?.testimonials || staticTestimonials;

  const gallery = settings?.gallery || {
    eyebrow: "@srikamatchisilk",
    title: "Follow Our Journey",
    subtitle: "Tag us with #DrapedInKamatchi to be featured.",
    items: [],
  };

  const newsletter = settings?.newsletter || {
    title: "Join the Kamatchi Circle",
    subtitle: "Be the first to know about new weaves, private sales and styling tips.",
    buttonText: "Subscribe",
  };

  const banners = settings?.banners || [];
  const weddingBannerData = banners.find((b: any) => b.id === "wedding") || {
    label: "Limited Time",
    title: "Wedding Collection",
    description: "Up to 30% off on bridal Kanchipuram silks. Make your big day unforgettable.",
    ctaText: "Shop the Sale",
    ctaLink: "/shop",
    imageUrl: "",
  };
  const festivalBannerData = banners.find((b: any) => b.id === "festival") || {
    label: "New Season",
    title: "Festival Edit",
    description: "Radiant cotton silks & semi silks to light up every celebration.",
    ctaText: "Discover Now",
    ctaLink: "/shop",
    imageUrl: "",
  };

  // Products filtering based on catalog
  const limit = trendingSections.maxProducts || 4;
  const trending = products.filter((p) => p.trending).slice(0, limit);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, limit);
  const celebrity = products.filter((p) => p.subcategory === "Celebrity Silks").slice(0, limit);
  const todaysDeals = products.filter((p) => p.offer || (p.discountPrice && p.discountPrice < p.price));
  const bestSellers = products.filter((p) => p.bestSeller || p.trending);
  const pochampalliProducts = products.filter(
    (p) =>
      p.subcategory === "Pure Cotton Silks" ||
      p.subcategory === "Cotton Silks" ||
      p.fabric === "Cotton Silk" ||
      p.fabric === "Pure Cotton"
  );

  // Category sorting & selection if specified in settings, falling back to database categories, then local file categories
  const displayedCategories = useMemo(() => {
    const baseList =
      dbCategories.length > 0
        ? dbCategories.map((c) => {
            const localMatch = subcategories.find((s) => s.slug === c.slug);
            const rawImage = c.image || localMatch?.image || subcategories[0].image;
            return {
              id: c.id,
              name: c.name,
              slug: c.slug,
              image:
                typeof rawImage === "string" && rawImage.startsWith("/uploads")
                  ? `${API_BASE}${rawImage}`
                  : rawImage,
              description:
                c.description || localMatch?.description || "Handcrafted saree division.",
            };
          })
        : subcategories;

    if (categoriesSection.items && Array.isArray(categoriesSection.items)) {
      return categoriesSection.items
        .map((item: any) => {
          const match = baseList.find((b: any) => b.slug === item.slug || b.name === item.name);
          if (!match) return null;
          const rawImage = item.imageUrl || match.image;
          return {
            ...match,
            image:
              typeof rawImage === "string" && rawImage.startsWith("/uploads")
                ? `${API_BASE}${rawImage}`
                : rawImage,
            name: item.name || match.name,
          };
        })
        .filter(Boolean);
    }

    return baseList;
  }, [dbCategories, categoriesSection.items]);

  // Instagram gallery items
  const galleryImgs = products.slice(0, 6).map((p) => p.image);
  const galleryItemsToShow =
    gallery.items && Array.isArray(gallery.items) && gallery.items.length > 0
      ? gallery.items.map((item: any) => ({
          ...item,
          imageUrl:
            typeof item.imageUrl === "string" && item.imageUrl.startsWith("/uploads")
              ? `${API_BASE}${item.imageUrl}`
              : item.imageUrl,
        }))
      : galleryImgs.map((img) => ({ imageUrl: img, link: "#" }));

  // Helper to split hero title for gradient coloring
  const parseHeroTitle = (titleText: string) => {
    // If it contains "Timeless", highlight it
    if (titleText.includes("Timeless")) {
      const parts = titleText.split("Timeless");
      return (
        <>
          {parts[0]}
          <span className="text-gradient-gold">Timeless</span>
          {parts[1]}
        </>
      );
    }
    return titleText;
  };

  return (
    <StoreLayout>
      {/* Hero / Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full overflow-hidden rounded-[2rem] border border-gold/10 shadow-card bg-card"
        >
          <img
            src={sriKamatchiSilksBanner}
            alt="Sri Kamatchi Silks - Exquisite Kanchipuram & Pure Gold Zari Silk Sarees"
            className="w-full h-auto block"
          />
        </motion.div>
      </section>

      {/* Featured Categories (Circular grid) */}
      {toggles.featuredCollections !== false && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <SectionHeading
            eyebrow={categoriesSection.eyebrow}
            title={categoriesSection.title}
            subtitle={categoriesSection.subtitle}
          />
          <div className="mt-12 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-5 justify-center">
            {displayedCategories.map((s: any, i: number) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex flex-col items-center"
              >
                <Link
                  to="/category/$slug"
                  params={{ slug: s.slug }}
                  className="group block text-center"
                >
                  <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border border-gold/30 hover:border-gold shadow-md bg-card transition-all duration-300">
                    <img
                      src={s.image}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const localMatch = subcategories.find((sub) => sub.slug === s.slug);
                        (e.target as HTMLImageElement).src =
                          localMatch?.image || subcategories[0].image;
                      }}
                    />
                  </div>
                  <h3 className="mt-4 text-xs sm:text-sm font-semibold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors">
                    {s.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Today's Deal section */}
      {todaysDeals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Exclusive Offers</span>
              <h2 className="font-display text-2xl font-bold text-foreground mt-1">Today's Deals</h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
            {todaysDeals.map((p) => (
              <Link
                key={p.id}
                to="/product/$slug"
                params={{ slug: p.slug }}
                className="group min-w-[130px] sm:min-w-[170px] flex-shrink-0 text-center flex flex-col items-center"
              >
                <div className="relative aspect-square w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-border/80 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-gold">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="mt-3 text-xs font-medium text-foreground line-clamp-1 max-w-[120px] sm:max-w-[160px]">
                  {p.name}
                </h4>
                <div className="mt-1 flex items-center gap-1.5 justify-center">
                  <span className="text-xs font-bold text-primary">{formatINR(p.discountPrice ?? p.price)}</span>
                  {p.discountPrice && p.discountPrice < p.price && (
                    <span className="text-[10px] text-muted-foreground line-through">{formatINR(p.price)}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Best Selling section */}
      {bestSellers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Most Popular</span>
              <h2 className="font-display text-2xl font-bold text-foreground mt-1">Best Selling Sarees</h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {bestSellers.slice(0, 4).map((p, i) => (
              <div key={p.id} className="w-full max-w-[240px] sm:max-w-[260px] lg:max-w-[220px]">
                <ProductCard product={p} index={i} variant="square-compact" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pochampalli Pure Cotton Silk Sarees section */}
      {pochampalliProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Traditional Weaves</span>
              <h2 className="font-display text-2xl font-bold text-foreground mt-1">Pochampalli Pure Cotton Silk Sarees</h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 justify-items-center">
            {pochampalliProducts.slice(0, 4).map((p, i) => (
              <div key={p.id} className="w-full">
                <ProductCard product={p} index={i} variant="square" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category-wise rows */}
      {displayedCategories.map((cat: any) => {
        const catProducts = products.filter(
          (p) =>
            p.category === cat.name ||
            p.subcategory === cat.name ||
            p.subcategorySlug === cat.slug
        );
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.id} className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="flex items-end justify-between border-b border-border/40 pb-4 mb-8">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Collections</span>
                <h2 className="font-display text-2xl font-bold text-foreground mt-1">{cat.name}</h2>
              </div>
              <Link
                to="/category/$slug"
                params={{ slug: cat.slug }}
                className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 scroll-smooth">
              {catProducts.map((p) => (
                <div key={p.id} className="min-w-[180px] sm:min-w-[220px] flex-shrink-0">
                  <ProductCard product={p} variant="square" />
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {/* Offer banners */}
      {(toggles.weddingBanner !== false || toggles.festivalBanner !== false) && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div
            className={`grid gap-6 ${toggles.weddingBanner !== false && toggles.festivalBanner !== false ? "lg:grid-cols-2" : "grid-cols-1"}`}
          >
            {toggles.weddingBanner !== false && (
              <div className="relative overflow-hidden rounded-3xl bg-gradient-maroon p-8 text-primary-foreground sm:p-12">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
                  {weddingBannerData.label}
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                  {weddingBannerData.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
                  {weddingBannerData.description}
                </p>
                <Link
                  to={(weddingBannerData.ctaLink as any) || "/shop"}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-gold-foreground"
                >
                  {weddingBannerData.ctaText} <ArrowRight size={15} />
                </Link>
                <img
                  src={
                    weddingBannerData.imageUrl
                      ? weddingBannerData.imageUrl.startsWith("http")
                        ? weddingBannerData.imageUrl
                        : `${API_BASE}${weddingBannerData.imageUrl}`
                      : saree2
                  }
                  alt={weddingBannerData.title}
                  loading="lazy"
                  className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 rotate-6 rounded-2xl object-cover opacity-90 sm:h-56 sm:w-56"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = saree2;
                  }}
                />
              </div>
            )}
            {toggles.festivalBanner !== false && (
              <div className="relative overflow-hidden rounded-3xl bg-accent p-8 text-accent-foreground sm:p-12">
                <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
                  {festivalBannerData.label}
                </span>
                <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                  {festivalBannerData.title}
                </h3>
                <p className="mt-3 max-w-xs text-sm text-accent-foreground/80">
                  {festivalBannerData.description}
                </p>
                <Link
                  to={(festivalBannerData.ctaLink as any) || "/shop"}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  {festivalBannerData.ctaText} <ArrowRight size={15} />
                </Link>
                <img
                  src={
                    festivalBannerData.imageUrl
                      ? festivalBannerData.imageUrl.startsWith("http")
                        ? festivalBannerData.imageUrl
                        : `${API_BASE}${festivalBannerData.imageUrl}`
                      : saree5
                  }
                  alt={festivalBannerData.title}
                  loading="lazy"
                  className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 -rotate-6 rounded-2xl object-cover opacity-90 sm:h-56 sm:w-56"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = saree5;
                  }}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* New Products section */}
      {toggles.newArrivals !== false && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold">Fresh Off the Loom</span>
              <h2 className="font-display text-2xl font-bold text-foreground mt-1">New Products</h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 justify-items-center">
            {newArrivals.slice(0, 4).map((p, i) => (
              <div key={p.id} className="w-full">
                <ProductCard product={p} index={i} variant="square" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Policy/Service Strip */}
      <section className="bg-card border-y border-border/40 py-8 mb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <Link to="/terms" className="flex flex-col items-center gap-2 group">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary group-hover:bg-gold group-hover:text-gold-foreground transition-all">
                <Icons.ShieldCheck size={18} />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary">Terms & Conditions</span>
              <span className="text-[10px] text-muted-foreground">Fair & clear terms</span>
            </Link>
            <Link to="/return-policy" className="flex flex-col items-center gap-2 group">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary group-hover:bg-gold group-hover:text-gold-foreground transition-all">
                <Icons.RefreshCw size={18} />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary">Return Policy</span>
              <span className="text-[10px] text-muted-foreground">Easy returns within 7 days</span>
            </Link>
            <Link to="/shipping-policy" className="flex flex-col items-center gap-2 group">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary group-hover:bg-gold group-hover:text-gold-foreground transition-all">
                <Icons.Truck size={18} />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary">Shipping Policy</span>
              <span className="text-[10px] text-muted-foreground">Pan-India insured delivery</span>
            </Link>
            <a href="https://wa.me/919443210987" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2 group">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary group-hover:bg-gold group-hover:text-gold-foreground transition-all">
                <Icons.Headphones size={18} />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary">Customer Support</span>
              <span className="text-[10px] text-muted-foreground">24/7 WhatsApp support</span>
            </a>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
