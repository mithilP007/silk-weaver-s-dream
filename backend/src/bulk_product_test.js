const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const API_BASE = "http://localhost:5000/api";

async function runBulkTest() {
  console.log("========================================");
  console.log("▶ Testing Bulk Product Upload API & DB Persistence");
  console.log("========================================");

  const timestamp = Date.now();
  const adminEmail = `bulk_admin_${timestamp}@example.com`;
  let adminToken = "";

  try {
    // 1. Setup Admin Account
    console.log("1. Creating & Promoting Admin Account...");
    await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bulk Admin Tester",
        email: adminEmail,
        password: "adminpassword123",
        phone: "9999900000",
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
    console.log("   [✓] Admin logged in successfully");

    // 2. Ensure at least 1 Category exists in DB
    console.log("2. Ensuring category exists in DB...");
    let existingCats = await prisma.category.findMany();
    let testCategoryName = "";

    if (existingCats.length === 0) {
      const cat = await prisma.category.create({
        data: {
          name: "Pure Silk Sarees",
          slug: `pure-silk-sarees-${timestamp}`,
          description: "Authentic pure silk sarees",
        },
      });
      testCategoryName = cat.name;
    } else {
      testCategoryName = existingCats[0].name;
    }
    console.log(`   [✓] Using existing Category Name: "${testCategoryName}"`);

    // 3. Test Bulk Creation with Valid & Invalid Rows
    console.log("3. Sending Bulk Products Payload to POST /api/products/bulk...");
    const payload = [
      {
        "Product Name": `Bulk Kanchi Zari Saree ${timestamp}`,
        "Category Name": testCategoryName,
        "Price": 16500,
        "Discount Price": 14000,
        "Stock": 10,
        "Fabric": "Pure Silk",
        "Color": "Ruby Red",
        "Occasion": "Wedding",
        "Is Trending": "TRUE",
        "Is Featured": "TRUE",
        "Is Offer": "TRUE",
        "Description": "Authentic handwoven Kanchipuram zari drape.",
      },
      {
        "Product Name": `Bulk Mysuru Silk Drape ${timestamp}`,
        "Slug": `bulk-mysuru-${timestamp}`,
        "Category Name": testCategoryName,
        "Price": 9800,
        "Discount Price": 8500,
        "Stock": 15,
        "Fabric": "Crepe Silk",
        "Color": "Mustard Yellow",
        "Occasion": "Festive",
        "Is Trending": "FALSE",
        "Is Featured": "FALSE",
        "Is Offer": "TRUE",
        "Description": "Pure Karnataka Mysore crepe silk saree.",
      },
      {
        "Product Name": "Invalid Row Unknown Category",
        "Category Name": "Non-Existent Category 999",
        "Price": 5000,
        "Stock": 5,
        "Description": "This row should be rejected due to category mismatch.",
      },
    ];

    const bulkRes = await fetch(`${API_BASE}/products/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });

    const bulkData = await bulkRes.json();
    console.log("   Bulk Import Response:", bulkData);

    if (bulkRes.status === 201 && bulkData.success) {
      console.log(`   [✓] Successfully created ${bulkData.count} products!`);
      console.log(`   [✓] Recorded ${bulkData.errors.length} expected row-level validation errors.`);
    } else {
      console.log("   [✗] Bulk import failed unexpectedly:", bulkData);
      process.exit(1);
    }

    // 4. Verify DB Records
    console.log("4. Verifying Products in Database...");
    const createdProducts = await prisma.product.findMany({
      where: {
        name: { contains: `Bulk` },
      },
    });

    if (createdProducts.length >= 2) {
      console.log(`   [✓] Database contains ${createdProducts.length} imported bulk products!`);
      createdProducts.forEach((p) => {
        console.log(`       - "${p.name}" (Slug: ${p.slug}, Price: ₹${p.price}, CategoryId: ${p.categoryId})`);
      });
    } else {
      console.log("   [✗] Expected products not found in DB");
      process.exit(1);
    }

    // 5. Cleanup
    console.log("5. Cleaning up test data...");
    await prisma.product.deleteMany({
      where: { name: { contains: `Bulk` } },
    });
    await prisma.user.delete({ where: { email: adminEmail } });
    console.log("   [✓] Test data cleaned up successfully!");

    console.log("\n========================================");
    console.log("🎉 BULK PRODUCT UPLOAD FUNCTIONAL VERIFICATION PASSED!");
    console.log("========================================");
    process.exit(0);
  } catch (err) {
    console.error("   [✗] Error during bulk product verification:", err);
    process.exit(1);
  }
}

runBulkTest();
