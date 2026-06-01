import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Heart, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { SectionHeading } from "@/components/store/SectionHeading";
import heroSaree from "@/assets/hero-saree.jpg";
import saree2 from "@/assets/saree-2.jpg";
import saree3 from "@/assets/saree-3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Sri Kamatchi Silk" },
      { name: "description", content: "The heritage, craft and passion behind Sri Kamatchi Silk sarees." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <StoreLayout>
      {/* Hero Section */}
      <section className="bg-gradient-champagne relative overflow-hidden py-20 text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <nav className="mb-4 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link> / <span className="text-foreground">About Us</span>
          </nav>
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-gold mb-6">
            <Sparkles size={13} /> Our Legacy
          </span>
          <h1 className="font-display text-4xl font-bold text-foreground sm:text-6xl leading-tight">
            The Legend of <span className="text-gradient-gold">Sri Kamatchi Silk</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Weaving stories of grace, purity, and heritage for over twenty-five years. Handcrafted silk sarees direct from the sacred handlooms of Kanchipuram.
          </p>
          <div className="gold-divider mx-auto mt-8 w-32" />
        </div>
      </section>

      {/* Story Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] shadow-card mx-auto">
              <img
                src={heroSaree}
                alt="Crafting pure silk"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-2 rounded-2xl border border-border bg-card p-6 shadow-card max-w-[200px] text-center hidden sm:block">
              <span className="font-display text-3xl font-bold text-primary block">100%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pure Mulberry Silk</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <span className="text-xs uppercase tracking-widest text-gold font-semibold">The Sacred Loom</span>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Born in the Temple Town of Kanchipuram</h2>
            <p className="text-muted-foreground leading-relaxed">
              Every saree from Sri Kamatchi Silk carries the blessing of centuries-old weaving traditions. Our journey began with a simple mission: to preserve the unparalleled majesty of authentic Kanchipuram handloom silk while making it accessible to global connoisseurs.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From selecting the finest grade mulberry silk threads to testing the purity of gold and silver zari motifs, our master weavers dedicate up to 200 hours to weave a single masterwork. Each motif—be it the royal peacock, the sacred temple border, or the intricate floral vine—tells a story of divine craftsmanship.
            </p>
            <div className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Zari Tested Purity</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">Tested pure gold and silver threads.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Silk Mark Certified</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">100% authentic handloom fabrics.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Weaver Spotlight */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="The Master Craftsmen"
            title="Weaving the Soul of Sri Kamatchi Silk"
            subtitle="Meet the legendary weavers whose dedicated hands turn pure raw silk into liquid poetry."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Ramanathan Chettiar",
                role: "Master Kanchipuram Weaver",
                experience: "40+ Years of Craftsmanship",
                image: saree2,
                quote: "To me, weaving is not just a profession; it is a sacred prayer of colors, gold zari, and pure thread."
              },
              {
                name: "Lakshmi Narayanan",
                role: "Bridal Collection Specialist",
                experience: "25+ Years of Dedication",
                image: saree3,
                quote: "Creating a bridal saree requires more than skill. It requires the blessing of design and absolute patience."
              },
              {
                name: "Subramaniam Devadoss",
                role: "Traditional Jacquard Master",
                experience: "35+ Years of Legacy",
                image: heroSaree,
                quote: "Each thread that crosses the shuttle carries the weight of Kanchipuram's glorious, living heritage."
              }
            ].map((weaver, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover-lift"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={weaver.image}
                    alt={weaver.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-gold uppercase tracking-wider">{weaver.role}</span>
                  <h3 className="font-display text-xl font-bold text-foreground mt-1">{weaver.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{weaver.experience}</p>
                  <p className="text-sm italic text-muted-foreground mt-4 border-l-2 border-gold pl-3">
                    "{weaver.quote}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 text-center">
        <SectionHeading
          eyebrow="Our Pillars"
          title="What Defines Sri Kamatchi Silk"
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Award,
              title: "Heritage Preservation",
              desc: "We ensure traditional handloom weaving techniques are supported, protected, and properly compensated."
            },
            {
              icon: Heart,
              title: "Unmatched Purity",
              desc: "Zero compromises on mulberry silk thread quality, pure zari compositions, and traditional color dyes."
            },
            {
              icon: Sparkles,
              title: "Modern Luxury",
              desc: "Marrying centuries-old artistry with contemporary pastel shades and celebrity-inspired silhouettes."
            }
          ].map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-card border border-border p-8 rounded-2xl shadow-soft"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground mb-5">
                <val.icon size={24} />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground">{val.title}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-gradient-maroon px-6 py-14 text-center text-primary-foreground sm:px-12">
          <Sparkles className="mx-auto text-gold" size={28} />
          <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Experience Handloom Luxury
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-primary-foreground/80">
            Browse our curated collections of pure bridal silks, daily cotton silks, and award-winning handwoven pieces.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-gold-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore Saree Boutique <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}
