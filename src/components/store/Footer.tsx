import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { subcategories } from "@/data/categories";

const policyLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Shipping Policy", to: "/shipping-policy" },
  { label: "Return Policy", to: "/return-policy" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Shop All", to: "/shop" },
  { label: "Contact", to: "/contact" },
  { label: "My Orders", to: "/orders" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-2xl font-bold text-gold">Sri Kamatchi Silk</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sidebar-foreground/70">
              Weaving heritage into every drape. Sri Kamatchi Silk brings you handcrafted
              Kanchipuram and luxury silk sarees, made by master artisans for life's most
              treasured moments.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sidebar-foreground/80 transition-colors hover:bg-gold hover:text-gold-foreground"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Shop</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {subcategories.map((s) => (
                <li key={s.id}>
                  <Link
                    to="/category/$slug"
                    params={{ slug: s.slug }}
                    className="text-sidebar-foreground/70 transition-colors hover:text-gold"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">Company</h4>
            <ul className="mt-5 space-y-3 text-sm">
              {companyLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sidebar-foreground/70 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {policyLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sidebar-foreground/70 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">
              Get in Touch
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-sidebar-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                <span>No. 24, Silk Bazaar Road, Kanchipuram, Tamil Nadu 631502</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-gold" />
                <span>+91 98400 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-gold" />
                <span>care@srikamatchisilk.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sidebar-border pt-8 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Sri Kamatchi Silk. All rights reserved.</p>
          <p>Handwoven with love in Kanchipuram, India.</p>
        </div>
      </div>
    </footer>
  );
}
