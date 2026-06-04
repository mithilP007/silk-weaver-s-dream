import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { subcategories } from "@/data/categories";
import { API_BASE } from "@/lib/api";

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
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_BASE}/api/settings/home`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings(res.data);
        }
      })
      .catch((err) => console.error("Error fetching footer settings:", err));
  }, []);

  const footer = settings?.footer;
  const description = footer?.description || "Weaving heritage into every drape. Sri Kamatchi Silk brings you handcrafted Kanchipuram and luxury silk sarees, made by master artisans for life's most treasured moments.";
  const address = footer?.address || "No. 24, Silk Bazaar Road, Kanchipuram, Tamil Nadu 631502";
  const phone = footer?.phone || "+91 98400 12345";
  const email = footer?.email || "care@srikamatchisilk.com";
  const copyright = footer?.copyright || "Sri Kamatchi Silk. All rights reserved.";
  const bottomNote = footer?.bottomNote || "Handwoven with love in Kanchipuram, India.";
  const brandName = settings?.header?.brandName || "Sri Kamatchi Silk";

  const socialLinks = footer?.socialLinks || {
    instagram: "#",
    facebook: "#",
    youtube: "#",
    twitter: "#"
  };

  const socials = [
    { Icon: Instagram, link: socialLinks.instagram, name: "Instagram" },
    { Icon: Facebook, link: socialLinks.facebook, name: "Facebook" },
    { Icon: Youtube, link: socialLinks.youtube, name: "YouTube" },
    { Icon: Twitter, link: socialLinks.twitter, name: "Twitter" }
  ].filter(s => s.link);

  return (
    <footer className="mt-24 bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-2xl font-bold text-gold">{brandName}</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-sidebar-foreground/70">
              {description}
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socials.map(({ Icon, link, name }, i) => (
                  <a
                    key={i}
                    href={link}
                    aria-label={`${name} link`}
                    className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sidebar-foreground/80 transition-colors hover:bg-gold hover:text-gold-foreground"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
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
              {address && (
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-gold" />
                  <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <Mail size={16} className="shrink-0 text-gold" />
                  <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sidebar-border pt-8 text-xs text-sidebar-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {copyright}</p>
          <p>{bottomNote}</p>
        </div>
      </div>
    </footer>
  );
}
