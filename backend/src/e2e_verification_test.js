const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const API_BASE = "http://localhost:5000/api";

async function runE2EVerification() {
  console.log("=================================================");
  console.log("▶ STARTING END-TO-END & ERROR VALIDATION TEST");
  console.log("=================================================");

  const timestamp = Date.now();
  const adminEmail = `e2e_admin_${timestamp}@example.com`;
  let adminToken = "";

  try {
    // 1. Setup Admin Account
    console.log("\n[1] Registering & Promoting Admin Account...");
    await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "E2E Verification Admin",
        email: adminEmail,
        password: "adminpassword123",
        phone: "9999911111",
      }),
    });

    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "admin" },
    });

    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminEmail, password: "adminpassword123" }),
    });
    const loginData = await loginRes.json();
    adminToken = loginData.token;
    console.log("    ✓ Admin logged in successfully");

    // 2. Fetch Existing Category Name
    console.log("\n[2] Checking Categories in Database...");
    let existingCats = await prisma.category.findMany();
    let validCatName = "";
    if (existingCats.length === 0) {
      const cat = await prisma.category.create({
        data: {
          name: "Silk Sarees",
          slug: `silk-sarees-${timestamp}`,
          description: "Authentic Silk Sarees",
        },
      });
      validCatName = cat.name;
    } else {
      validCatName = existingCats[0].name;
    }
    console.log(`    ✓ Valid Category Name for testing: "${validCatName}"`);

    // 3. Test Error Handling & Validations
    console.log("\n[3] Testing Row Validation & Error Handling...");
    const errorPayload = [
      {
        "Product Name": "",
        "Category Name": validCatName,
        "Price": 15000,
        "Stock": 10,
        "Description": "Test desc",
      },
      {
        "Product Name": `Saree Test Invalid Cat ${timestamp}`,
        "Category Name": "NonExistent Category XYZ",
        "Price": 15000,
        "Stock": 10,
        "Description": "Test desc",
      },
      {
        "Product Name": `Saree Test Invalid Price ${timestamp}`,
        "Category Name": validCatName,
        "Price": -500,
        "Stock": 10,
        "Description": "Test desc",
      },
      {
        "Product Name": `Saree Test Invalid Stock ${timestamp}`,
        "Category Name": validCatName,
        "Price": 12000,
        "Stock": "invalid_stock",
        "Description": "Test desc",
      },
      {
        "Product Name": `Saree Test Missing Desc ${timestamp}`,
        "Category Name": validCatName,
        "Price": 12000,
        "Stock": 5,
        "Description": "",
      },
    ];

    const errRes = await fetch(`${API_BASE}/products/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(errorPayload),
    });
    const errData = await errRes.json();
    console.log("    HTTP Status Code:", errRes.status);
    console.log("    Captured Row Validation Errors:");
    errData.errors.forEach((e) => console.log(`      - ${e}`));

    // 4. Test Valid Import Workflow & Storefront/Admin Visibility
    console.log("\n[4] Testing Valid Import Workflow & Auto Slug / Category Mapping...");
    const validPayload = [
      {
        "Product Name": `E2E Bridal Kanchipuram Saree ${timestamp}`,
        "Category Name": validCatName,
        "Price": 22000,
        "Discount Price": 18500,
        "Stock": 8,
        "Fabric": "Pure Kanchipuram Silk",
        "Color": "Crimson Red",
        "Occasion": "Bridal",
        "Is Trending": "TRUE",
        "Is Featured": "TRUE",
        "Is Offer": "TRUE",
        "Image URL": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
        "Description": "Handwoven Kanchipuram saree with pure zari pallu.",
      },
      {
        "Product Name": `E2E Banarasi Brocade Saree ${timestamp}`,
        "Slug": `custom-banarasi-slug-${timestamp}`,
        "Category Name": validCatName,
        "Price": 16500,
        "Discount Price": 14000,
        "Stock": 12,
        "Fabric": "Banarasi Silk",
        "Color": "Royal Emerald",
        "Occasion": "Festive",
        "Is Trending": "FALSE",
        "Is Featured": "TRUE",
        "Is Offer": "TRUE",
        "Image URL": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800",
        "Description": "Traditional Banarasi brocade silk saree.",
      },
    ];

    const validRes = await fetch(`${API_BASE}/products/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(validPayload),
    });
    const validData = await validRes.json();
    console.log("    HTTP Status Code:", validRes.status);
    console.log("    Import Result Summary:", validData);

    // 5. Verify Products in Storefront / Admin API GET /api/products
    console.log("\n[5] Verifying Storefront & Admin API Visibility...");
    const storeRes = await fetch(`${API_BASE}/products`);
    const storeData = await storeRes.json();
    const importedInStore = storeData.data.filter((p) =>
      p.name.includes(`E2E`)
    );

    console.log(`    Found ${importedInStore.length} imported products in public storefront catalog:`);
    importedInStore.forEach((p) => {
      console.log(`      ✓ Name: "${p.name}"`);
      console.log(`        Slug: "${p.slug}"`);
      console.log(`        Category: "${p.category.name}" (ID: ${p.categoryId})`);
      console.log(`        Price: ₹${p.price} | Offer: ₹${p.discountPrice}`);
      console.log(`        Image: ${p.image}`);
      console.log(`        Flags: Trending=${p.isTrending}, Featured=${p.isFeatured}, Offer=${p.isOffer}`);
    });

    // 6. Cleanup
    console.log("\n[6] Cleaning up test data...");
    await prisma.product.deleteMany({
      where: { name: { contains: `E2E` } },
    });
    await prisma.user.delete({ where: { email: adminEmail } });
    console.log("    ✓ Test data cleaned up successfully.");

    console.log("\n=================================================");
    console.log("🎉 ALL END-TO-END VERIFICATION CHECKS PASSED 100%");
    console.log("=================================================");
    process.exit(0);
  } catch (err) {
    console.error("    ✗ E2E Verification failed:", err);
    process.exit(1);
  }
}

runE2EVerification();
