const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const settings = await prisma.homeSettings.findFirst();
  if (settings) {
    await prisma.homeSettings.update({
      where: { id: settings.id },
      data: {
        heroTitle: "Draped in Timeless Elegance",
        heroSubtitle: "Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury silk sarees, made for the moments you'll cherish forever.",
        heroImage: "/uploads/products/hero-saree.jpg",
        hero: {
          eyebrow: "Heritage Weaves",
          title: "Draped in Timeless Elegance",
          subtitle: "Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury silk sarees, made for the moments you'll cherish forever.",
          primaryCtaText: "Explore Collection",
          primaryCtaLink: "/shop",
          secondaryCtaText: "Shop All Sarees",
          secondaryCtaLink: "/shop",
          imageUrl: "/uploads/products/hero-saree.jpg",
          ratingValue: "4.9/5",
          ratingText: "Rated by 12,000+ brides",
          stats: [
            { value: "25+", label: "Years of Heritage" },
            { value: "50k+", label: "Happy Customers" },
            { value: "100%", label: "Pure Silk" }
          ]
        }
      }
    });
    console.log("Database settings reset successfully!");
  } else {
    // Create one if it doesn't exist
    await prisma.homeSettings.create({
      data: {
        heroTitle: "Draped in Timeless Elegance",
        heroSubtitle: "Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury silk sarees, made for the moments you'll cherish forever.",
        heroImage: "/uploads/products/hero-saree.jpg",
        hero: {
          eyebrow: "Heritage Weaves",
          title: "Draped in Timeless Elegance",
          subtitle: "Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury silk sarees, made for the moments you'll cherish forever.",
          primaryCtaText: "Explore Collection",
          primaryCtaLink: "/shop",
          secondaryCtaText: "Shop All Sarees",
          secondaryCtaLink: "/shop",
          imageUrl: "/uploads/products/hero-saree.jpg",
          ratingValue: "4.9/5",
          ratingText: "Rated by 12,000+ brides",
          stats: [
            { value: "25+", label: "Years of Heritage" },
            { value: "50k+", label: "Happy Customers" },
            { value: "100%", label: "Pure Silk" }
          ]
        }
      }
    });
    console.log("Database settings created successfully!");
  }
}

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
