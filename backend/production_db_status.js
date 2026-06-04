const { PrismaClient } = require("@prisma/client");

async function main() {
  const dbUrl = "postgresql://neondb_owner:npg_dwsmxGkbj37y@ep-dark-frog-aopoieav-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl
      }
    }
  });

  console.log("Analyzing Neon production database counts...");

  const usersCount = await prisma.user.count();
  const productsCount = await prisma.product.count();
  const categoriesCount = await prisma.category.count();
  const ordersCount = await prisma.order.count();
  const pagesCount = await prisma.page.count();
  const shippingCount = await prisma.shippingSettings.count();
  const paymentCount = await prisma.paymentSettings.count();
  const homeCount = await prisma.homeSettings.count();
  const cartCount = await prisma.cart.count();
  const wishlistCount = await prisma.wishlist.count();

  // Fetch some sample data to verify real content
  const sampleCategories = await prisma.category.findMany({ select: { name: true, slug: true } });
  const sampleProducts = await prisma.product.findMany({ select: { name: true, price: true }, take: 3 });

  console.log("NEON_DB_ANALYSIS_START");
  console.log(JSON.stringify({
    counts: {
      users: usersCount,
      products: productsCount,
      categories: categoriesCount,
      orders: ordersCount,
      cmsPages: pagesCount,
      shippingSettings: shippingCount,
      paymentSettings: paymentCount,
      homeSettings: homeCount,
      cartItems: cartCount,
      wishlistItems: wishlistCount
    },
    sampleData: {
      categories: sampleCategories,
      products: sampleProducts
    }
  }, null, 2));
  console.log("NEON_DB_ANALYSIS_END");

  await prisma.$disconnect();
}

main().catch(err => {
  console.error("DB_ANALYSIS_FAILED:", err.message || err);
  process.exit(1);
});
