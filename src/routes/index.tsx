import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Crown,
  Sparkles,
  PartyPopper,
  Landmark,
  Sun,
  Gift,
  ShieldCheck,
  Truck,
  Award,
  Headphones,
  ArrowRight,
  Quote,
  Instagram,
} from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SectionHeading } from "@/components/store/SectionHeading";
import { ProductCard } from "@/components/store/ProductCard";
import { StarRating } from "@/components/store/StarRating";
import { products } from "@/data/products";
import { subcategories } from "@/data/categories";
import { testimonials } from "@/data/store";
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

const occasionItems = [
  { name: "Wedding", icon: Crown },
  { name: "Reception", icon: Sparkles },
  { name: "Festival", icon: PartyPopper },
  { name: "Temple Visit", icon: Landmark },
  { name: "Daily Wear", icon: Sun },
  { name: "Gift", icon: Gift },
];

const whyUs = [
  { icon: Award, title: "Authentic Handloom", text: "Certified pure silk woven by master artisans." },
  { icon: ShieldCheck, title: "Trusted Quality", text: "Each saree quality-checked & zari-tested." },
  { icon: Truck, title: "Pan-India Delivery", text: "Safe, insured shipping to your doorstep." },
  { icon: Headphones, title: "Personal Styling", text: "Dedicated stylists to help you choose." },
];

const galleryImgs = products.slice(0, 6).map((p) => p.image);

function HomePage() {
  const trending = products.filter((p) => p.trending).slice(0, 4);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 4);
  const celebrity = products.filter((p) => p.subcategory === "Celebrity Silks").slice(0, 4);

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-champagne">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              <Sparkles size={13} /> Heritage Weaves
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              Draped in <span className="text-gradient-gold">Timeless</span> Elegance
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury
              silk sarees, made for the moments you'll cherish forever.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/silk-sarees"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card px-7 py-3.5 text-sm font-medium text-foreground transition-colors hover:border-gold"
              >
                Shop All Sarees
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-8">
              <div>
                <p className="font-display text-2xl font-bold text-primary">25+</p>
                <p className="text-xs text-muted-foreground">Years of Heritage</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-bold text-primary">50k+</p>
                <p className="text-xs text-muted-foreground">Happy Customers</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="font-display text-2xl font-bold text-primary">100%</p>
                <p className="text-xs text-muted-foreground">Pure Silk</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-[2rem] shadow-card">
              <img
                src={heroSaree}
                alt="Model wearing a deep maroon Kanchipuram silk saree"
                width={1080}
                height={1440}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-2 rounded-2xl border border-border bg-card/95 p-4 shadow-card backdrop-blur sm:left-4">
              <div className="flex items-center gap-3">
                <StarRating rating={5} />
                <span className="text-sm font-semibold">4.9/5</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Rated by 12,000+ brides</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main category highlight */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading
          eyebrow="The House of Silk"
          title="Silk Sarees"
          subtitle="Handwoven heritage drapes crafted by master weavers — explore our signature collections."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-5">
          {subcategories.map((s, i) => (
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

      {/* Trending */}
      <section className="bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between">
            <SectionHeading eyebrow="Most Loved" title="Trending Sarees" align="left" />
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

      {/* Offer banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-maroon p-8 text-primary-foreground sm:p-12">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
              Limited Time
            </span>
            <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Wedding Collection
            </h3>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
              Up to 30% off on bridal Kanchipuram silks. Make your big day unforgettable.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-gold-foreground"
            >
              Shop the Sale <ArrowRight size={15} />
            </Link>
            <img
              src={saree2}
              alt="Wedding saree"
              loading="lazy"
              className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 rotate-6 rounded-2xl object-cover opacity-90 sm:h-56 sm:w-56"
            />
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-accent p-8 text-accent-foreground sm:p-12">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-primary">
              New Season
            </span>
            <h3 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Festival Edit
            </h3>
            <p className="mt-3 max-w-xs text-sm text-accent-foreground/80">
              Radiant cotton silks & semi silks to light up every celebration.
            </p>
            <Link
              to="/shop"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              Discover Now <ArrowRight size={15} />
            </Link>
            <img
              src={saree5}
              alt="Festival saree"
              loading="lazy"
              className="pointer-events-none absolute -bottom-6 -right-6 h-44 w-44 -rotate-6 rounded-2xl object-cover opacity-90 sm:h-56 sm:w-56"
            />
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <SectionHeading
          eyebrow="Fresh Off the Loom"
          title="New Arrivals"
          subtitle="The latest weaves to grace our boutique, just for you."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {newArrivals.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Find by occasion */}
      <section className="bg-secondary/40 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Curated for You"
            title="Find Your Saree by Occasion"
            subtitle="Whatever the moment, we have the perfect drape to match it."
          />
          <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-6 lg:grid-cols-6">
            {occasionItems.map((o, i) => (
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
                    <o.icon size={24} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{o.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Celebrity inspired */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="flex items-end justify-between">
          <SectionHeading
            eyebrow="As Seen on Stars"
            title="Celebrity Inspired"
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

      {/* Why choose us */}
      <section className="bg-gradient-champagne py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="The Promise"
            title="Why Choose Sri Kamatchi Silk"
          />
          <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {whyUs.map((w, i) => (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft"
              >
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
                  <w.icon size={24} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{w.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <SectionHeading eyebrow="Loved by Thousands" title="What Our Customers Say" />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
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
              <StarRating rating={t.rating} className="mt-4" />
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Instagram gallery */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <SectionHeading
          eyebrow="@srikamatchisilk"
          title="Follow Our Journey"
          subtitle="Tag us with #DrapedInKamatchi to be featured."
        />
        <div className="mt-12 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {galleryImgs.map((img, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <img
                src={img}
                alt="Instagram post"
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

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-maroon px-6 py-14 text-center text-primary-foreground sm:px-12">
          <Sparkles className="mx-auto text-gold" size={28} />
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Join the Kamatchi Circle
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">
            Be the first to know about new weaves, private sales and styling tips.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address"
              className="flex-1 rounded-full border border-primary-foreground/20 bg-card/10 px-5 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 outline-none focus:border-gold"
            />
            <button className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-gold-foreground transition-transform hover:-translate-y-0.5">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </StoreLayout>
  );
}
