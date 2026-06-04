import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import {
  ArrowRight,
  Quote,
  Instagram,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SectionHeading } from "@/components/store/SectionHeading";
import { ProductCard } from "@/components/store/ProductCard";
import { StarRating } from "@/components/store/StarRating";
import { products } from "@/data/products";
import { subcategories } from "@/data/categories";
import { testimonials as staticTestimonials } from "@/data/store";
import { API_BASE } from "@/lib/api";
import heroSaree from "@/assets/hero-saree.jpg";
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
    subtitle: "Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury silk sarees, made for the moments you'll cherish forever.",
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
      { value: "100%", label: "Pure Silk" }
    ]
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
    newsletter: true
  };

  const categoriesSection = settings?.categoriesSection || {
    eyebrow: "The House of Silk",
    title: "Silk Sarees",
    subtitle: "Handwoven heritage drapes crafted by master weavers — explore our signature collections."
  };

  const trendingSections = settings?.trendingSections || {
    trendingTitle: "Trending Sarees",
    trendingEyebrow: "Most Loved",
    newArrivalsTitle: "New Arrivals",
    newArrivalsEyebrow: "Fresh Off the Loom",
    celebrityTitle: "Celebrity Inspired",
    celebrityEyebrow: "As Seen on Stars",
    maxProducts: 4
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
      { name: "Gift", icon: "Gift" }
    ]
  };

  const promiseSection = settings?.promiseSection || {
    eyebrow: "The Promise",
    title: "Why Choose Sri Kamatchi Silk",
    cards: [
      { title: "Authentic Handloom", text: "Certified pure silk woven by master artisans.", icon: "Award" },
      { title: "Trusted Quality", text: "Each saree quality-checked & zari-tested.", icon: "ShieldCheck" },
      { title: "Pan-India Delivery", text: "Safe, insured shipping to your doorstep.", icon: "Truck" },
      { title: "Personal Styling", text: "Dedicated stylists to help you choose.", icon: "Headphones" }
    ]
  };

  const dbTestimonials = settings?.testimonials || staticTestimonials;

  const gallery = settings?.gallery || {
    eyebrow: "@srikamatchisilk",
    title: "Follow Our Journey",
    subtitle: "Tag us with #DrapedInKamatchi to be featured.",
    items: []
  };

  const newsletter = settings?.newsletter || {
    title: "Join the Kamatchi Circle",
    subtitle: "Be the first to know about new weaves, private sales and styling tips.",
    buttonText: "Subscribe"
  };

  const banners = settings?.banners || [];
  const weddingBannerData = banners.find((b: any) => b.id === "wedding") || {
    label: "Limited Time",
    title: "Wedding Collection",
    description: "Up to 30% off on bridal Kanchipuram silks. Make your big day unforgettable.",
    ctaText: "Shop the Sale",
    ctaLink: "/shop",
    imageUrl: ""
  };
  const festivalBannerData = banners.find((b: any) => b.id === "festival") || {
    label: "New Season",
    title: "Festival Edit",
    description: "Radiant cotton silks & semi silks to light up every celebration.",
    ctaText: "Discover Now",
    ctaLink: "/shop",
    imageUrl: ""
  };

  // Products filtering based on catalog
  const limit = trendingSections.maxProducts || 4;
  const trending = products.filter((p) => p.trending).slice(0, limit);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, limit);
  const celebrity = products.filter((p) => p.subcategory === "Celebrity Silks").slice(0, limit);

  // Category sorting & selection if specified in settings, falling back to database categories, then local file categories
  const displayedCategories = useMemo(() => {
    const baseList = dbCategories.length > 0
      ? dbCategories.map((c) => {
          const localMatch = subcategories.find((s) => s.slug === c.slug);
          return {
            id: c.id,
            name: c.name,
            slug: c.slug,
            image: c.image || localMatch?.image || subcategories[0].image,
            description: c.description || localMatch?.description || "Handcrafted saree division.",
          };
        })
      : subcategories;

    if (categoriesSection.items && Array.isArray(categoriesSection.items)) {
      return categoriesSection.items
        .map((item: any) => {
          const match = baseList.find((b: any) => b.slug === item.slug || b.name === item.name);
          if (!match) return null;
          return {
            ...match,
            image: item.imageUrl || match.image,
            name: item.name || match.name
          };
        })
        .filter(Boolean);
    }

    return baseList;
  }, [dbCategories, categoriesSection.items]);

  // Instagram gallery items
  const galleryImgs = products.slice(0, 6).map((p) => p.image);
  const galleryItemsToShow = gallery.items && Array.isArray(gallery.items) && gallery.items.length > 0
    ? gallery.items
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-champagne border-b border-border/40">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {hero.eyebrow && (
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                <Sparkles size={13} /> {hero.eyebrow}
              </span>
            )}
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              {parseHeroTitle(hero.title)}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {hero.primaryCtaText && (
                <Link
                  to={hero.primaryCtaLink as any || "/silk-sarees"}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  {hero.primaryCtaText} <ArrowRight size={16} />
                </Link>
              )}
              {hero.secondaryCtaText && (
                <Link
                  to={hero.secondaryCtaLink as any || "/shop"}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-gold"
                >
                  {hero.secondaryCtaText}
                </Link>
              )}
            </div>
            {hero.stats && Array.isArray(hero.stats) && hero.stats.length > 0 && (
              <div className="mt-10 flex items-center gap-8">
                {hero.stats.map((stat: any, index: number) => (
                  <div key={index} className="flex items-center gap-8">
                    {index > 0 && <div className="h-10 w-px bg-border" />}
                    <div>
                      <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] shadow-card">
              <img
                src={hero.imageUrl || heroSaree}
                alt={hero.altText || "Model wearing a deep maroon Kanchipuram silk saree"}
                width={1080}
                height={1440}
                className="h-full w-full object-cover"
              />
            </div>
            {hero.ratingValue && (
              <div className="absolute -bottom-5 -left-2 rounded-2xl border border-border bg-card/95 p-4 shadow-card backdrop-blur sm:left-4">
                <div className="flex items-center gap-3">
                  <StarRating rating={5} />
                  <span className="text-sm font-semibold">{hero.ratingValue}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{hero.ratingText}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Main category highlight */}
      {toggles.featuredCollections !== false && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
          <SectionHeading
            eyebrow={categoriesSection.eyebrow}
            title={categoriesSection.title}
            subtitle={categoriesSection.subtitle}
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
            {displayedCategories.map((s: any, i: number) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  to="/category/$slug"
                  params={{ slug: s.slug }}
                  className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover-lift"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary">
                      {s.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {toggles.trendingArrivals !== false && (
        <section className="bg-secondary/20 border-y border-border/45 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between">
              <SectionHeading
                eyebrow={trendingSections.trendingEyebrow}
                title={trendingSections.trendingTitle}
                align="left"
              />
              <Link
                to="/shop"
                className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 sm:inline-flex"
              >
                View all <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {trending.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Offer banners */}
      {(toggles.weddingBanner !== false || toggles.festivalBanner !== false) && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <div className={`grid gap-5 ${toggles.weddingBanner !== false && toggles.festivalBanner !== false ? "lg:grid-cols-2" : "grid-cols-1"}`}>
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
                  to={weddingBannerData.ctaLink as any || "/shop"}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-gold-foreground"
                >
                  {weddingBannerData.ctaText} <ArrowRight size={15} />
                </Link>
                <img
                  src={weddingBannerData.imageUrl || saree2}
                  alt={weddingBannerData.title}
                  loading="lazy"
                  className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 rotate-6 rounded-2xl object-cover opacity-90 sm:h-56 sm:w-56"
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
                  to={festivalBannerData.ctaLink as any || "/shop"}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
                >
                  {festivalBannerData.ctaText} <ArrowRight size={15} />
                </Link>
                <img
                  src={festivalBannerData.imageUrl || saree5}
                  alt={festivalBannerData.title}
                  loading="lazy"
                  className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 -rotate-6 rounded-2xl object-cover opacity-90 sm:h-56 sm:w-56"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* New arrivals */}
      {toggles.newArrivals !== false && (
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:pb-32">
          <SectionHeading
            eyebrow={trendingSections.newArrivalsEyebrow}
            title={trendingSections.newArrivalsTitle}
            subtitle="The latest weaves to grace our boutique, just for you."
          />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Find by occasion */}
      {toggles.curatedOccasions !== false && (
        <section className="bg-secondary/20 border-y border-border/45 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow={occasionFinder.eyebrow}
              title={occasionFinder.title}
              subtitle={occasionFinder.subtitle}
            />
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6 lg:grid-cols-6">
              {occasionFinder.items && occasionFinder.items.map((o: any, i: number) => {
                const IconComponent = getIconByName(o.icon);
                return (
                  <motion.div
                    key={o.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link
                      to="/shop"
                      className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-all hover:border-gold hover:shadow-card"
                    >
                      <div className="grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                        <IconComponent size={24} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{o.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Celebrity inspired */}
      {toggles.celebritySection !== false && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="flex items-end justify-between">
            <SectionHeading
              eyebrow={trendingSections.celebrityEyebrow}
              title={trendingSections.celebrityTitle}
              align="left"
            />
            <Link
              to="/category/$slug"
              params={{ slug: "celebrity-silks" }}
              className="hidden items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 sm:inline-flex"
            >
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {celebrity.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Why choose us / Promise */}
      {toggles.heroCarousel !== false && (
        <section className="bg-gradient-champagne border-y border-border/45 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow={promiseSection.eyebrow}
              title={promiseSection.title}
            />
            <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
              {promiseSection.cards && promiseSection.cards.map((w: any, i: number) => {
                const IconComponent = getIconByName(w.icon);
                return (
                  <motion.div
                    key={w.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
                  >
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-foreground">{w.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {toggles.customerTestimonials !== false && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:py-32">
          <SectionHeading eyebrow="Loved by Thousands" title="What Our Customers Say" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {dbTestimonials.map((t: any, i: number) => (
              <motion.div
                key={t.id || i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <Quote className="text-gold" size={26} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  "{t.text}"
                </p>
                <StarRating rating={t.rating || 5} className="mt-4" />
                <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                  {t.avatar && t.avatar.length <= 3 ? (
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {t.avatar}
                    </div>
                  ) : (
                    <img
                      src={t.avatar || "/uploads/avatar-placeholder.png"}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover border border-border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || "User")}&background=800020&color=fff`;
                      }}
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Instagram gallery */}
      {toggles.instagramGallery !== false && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <SectionHeading
            eyebrow={gallery.eyebrow}
            title={gallery.title}
            subtitle={gallery.subtitle}
          />
          <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
            {galleryItemsToShow.map((item: any, i: number) => (
              <a
                key={i}
                href={item.link || "#"}
                target={item.link && item.link !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-border"
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption || "Instagram post"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 grid place-items-center bg-primary/0 opacity-0 transition-all group-hover:bg-primary/40 group-hover:opacity-100">
                  <Instagram className="text-primary-foreground" size={24} />
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      {toggles.newsletter !== false && (
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
          <div className="overflow-hidden rounded-3xl bg-gradient-maroon px-6 py-14 text-center text-primary-foreground sm:px-12">
            <Sparkles className="mx-auto text-gold" size={28} />
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              {newsletter.title}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">
              {newsletter.subtitle}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing to our newsletter!");
              }}
              className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 rounded-full border border-primary-foreground/20 bg-card/10 px-5 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none focus:border-gold"
              />
              <button className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-gold-foreground transition-transform hover:-translate-y-0.5">
                {newsletter.buttonText || "Subscribe"}
              </button>
            </form>
          </div>
        </section>
      )}
    </StoreLayout>
  );
}
