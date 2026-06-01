import type { Subcategory } from "./types";
import saree1 from "@/assets/saree-1.jpg";
import saree3 from "@/assets/saree-3.jpg";
import saree4 from "@/assets/saree-4.jpg";
import saree5 from "@/assets/saree-5.jpg";
import saree6 from "@/assets/saree-6.jpg";

export const MAIN_CATEGORY = {
  name: "Silk Sarees",
  slug: "silk-sarees",
  description:
    "Handwoven heritage silk sarees crafted by master weavers — the soul of Sri Kamatchi Silk.",
};

export const subcategories: Subcategory[] = [
  {
    id: "sc1",
    name: "Semi Silks",
    slug: "semi-silks",
    description: "Lightweight elegance with a silken sheen — perfect for everyday grace.",
    image: saree6,
  },
  {
    id: "sc2",
    name: "Cotton Silks",
    slug: "cotton-silks",
    description: "The breathable comfort of cotton meets the luxury of silk.",
    image: saree1,
  },
  {
    id: "sc3",
    name: "Pure Cotton Silks",
    slug: "pure-cotton-silks",
    description: "Soft, pure and refined — handwoven for timeless comfort.",
    image: saree4,
  },
  {
    id: "sc4",
    name: "Luxury Silks",
    slug: "luxury-silks",
    description: "Opulent zari, regal motifs and unmatched craftsmanship.",
    image: saree5,
  },
  {
    id: "sc5",
    name: "Celebrity Silks",
    slug: "celebrity-silks",
    description: "Red-carpet inspired drapes loved by the stars.",
    image: saree3,
  },
];

export const collections = [
  { name: "Wedding Sarees", slug: "wedding", filter: "Wedding" },
  { name: "Festival Collection", slug: "festival", filter: "Festival" },
  { name: "New Arrivals", slug: "new-arrivals", filter: "new" },
  { name: "Best Sellers", slug: "best-sellers", filter: "best" },
  { name: "Bridal Collection", slug: "bridal", filter: "Wedding" },
];

export const occasions = [
  { name: "Wedding", slug: "wedding", icon: "Crown" },
  { name: "Reception", slug: "reception", icon: "Sparkles" },
  { name: "Festival", slug: "festival", icon: "PartyPopper" },
  { name: "Temple Visit", slug: "temple-visit", icon: "Landmark" },
  { name: "Daily Wear", slug: "daily-wear", icon: "Sun" },
  { name: "Gift", slug: "gift", icon: "Gift" },
];

export const FABRICS = ["Pure Silk", "Semi Silk", "Cotton Silk", "Pure Cotton", "Soft Silk"];
export const COLORS = [
  "Maroon",
  "Gold",
  "Lavender",
  "Pink",
  "Green",
  "Teal",
  "Cream",
  "Red",
];
export const OCCASION_LIST = [
  "Wedding",
  "Reception",
  "Festival",
  "Temple Visit",
  "Daily Wear",
  "Gift",
];
