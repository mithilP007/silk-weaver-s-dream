const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const API_BASE = "http://localhost:5000/api";

// Helper function to print headers nicely
const section = (name) => {
  console.log(`\n========================================`);
  console.log(`▶ Testing Flow: ${name}`);
  console.log(`========================================`);
};

// Helper function to print checklist items
const check = (desc, success) => {
  if (success) {
    console.log(`  [✓] ${desc}`);
  } else {
    console.log(`  [✗] ${desc}`);
    process.exit(1);
  }
};

async function runTests() {
  console.log("Starting Sri Kamatchi Silk Full Functional Verification Test...");
  const timestamp = Date.now();
  const customerEmail = `customer_${timestamp}@example.com`;
  const adminEmail = `admin_${timestamp}@example.com`;
  let customerToken = "";
  let adminToken = "";
  let selectedProductId = "";
  let selectedCategoryId = "";
  let createdOrderId = "";
  let newProductId = "";
  let newCategoryId = "";
  let newPageId = "";

  // ----------------------------------------
  // Flow 1: Customer Register & Login
  // ----------------------------------------
  section("1. Customer Register & Login");
  try {
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Customer",
        email: customerEmail,
        password: "customer123",
        phone: "9876543210"
      })
    });
    const regData = await regRes.json();
    check("Customer successfully registered dynamically in DB", regRes.ok && regData.success);

    const logRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customerEmail,
        password: "customer123"
      })
    });
    const logData = await logRes.json();
    customerToken = logData.token;
    check("Customer login successfully returned Bearer JWT token", logRes.ok && customerToken);
  } catch (err) {
    check(`Customer Register & Login failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 2: Browse Products & Categories
  // ----------------------------------------
  section("2. Browse Products & Categories");
  try {
    const catRes = await fetch(`${API_BASE}/categories`);
    const catData = await catRes.json();
    check("Browse Categories: categories catalog returned", catRes.ok && catData.success && catData.data.length > 0);
    selectedCategoryId = catData.data[0].id;

    const prodRes = await fetch(`${API_BASE}/products`);
    const prodData = await prodRes.json();
    check("Browse Products: product catalog returned", prodRes.ok && prodData.success && prodData.data.length > 0);
    selectedProductId = prodData.data[0].id;
    console.log(`  Selected Product: "${prodData.data[0].name}" (ID: ${selectedProductId})`);
  } catch (err) {
    check(`Browse Products failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 3: Add to Cart
  // ----------------------------------------
  section("3. Add to Cart Persistence");
  try {
    const addRes = await fetch(`${API_BASE}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        productId: selectedProductId,
        quantity: 2
      })
    });
    const addData = await addRes.json();
    check("Add to Cart: item persisted to DB cart successfully", addRes.ok && addData.success);

    const getRes = await fetch(`${API_BASE}/cart`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${customerToken}` }
    });
    const getData = await getRes.json();
    const cartHasItem = getData.data.some(item => item.productId === selectedProductId && item.quantity === 2);
    check("Get Cart: verified persisted item and quantity match database", getRes.ok && cartHasItem);
  } catch (err) {
    check(`Add to Cart failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 4: Add to Wishlist
  // ----------------------------------------
  section("4. Add to Wishlist Persistence");
  try {
    const addRes = await fetch(`${API_BASE}/wishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        productId: selectedProductId
      })
    });
    const addData = await addRes.json();
    check("Add to Wishlist: item persisted to DB wishlist successfully", addRes.ok && addData.success);

    const getRes = await fetch(`${API_BASE}/wishlist`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${customerToken}` }
    });
    const getData = await getRes.json();
    const wishlistHasItem = getData.data.some(item => item.productId === selectedProductId);
    check("Get Wishlist: verified persisted item matches database", getRes.ok && wishlistHasItem);
  } catch (err) {
    check(`Add to Wishlist failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 5: Checkout with COD
  // ----------------------------------------
  section("5. Transactional Checkout with COD");
  try {
    // Check initial stock
    const beforeProduct = await prisma.product.findUnique({ where: { id: selectedProductId } });
    const initialStock = beforeProduct.stock;

    const checkRes = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        customerName: "Test Buyer",
        customerPhone: "9876543210",
        address: "12, Sannidhi Street, Kanchipuram Showroom",
        city: "Kanchipuram",
        state: "Tamil Nadu",
        pincode: "631501",
        paymentMethod: "Cash on Delivery",
        items: [
          {
            productId: selectedProductId,
            quantity: 2
          }
        ]
      })
    });
    const checkData = await checkRes.json();
    check("Checkout: COD order successfully generated in database", checkRes.ok && checkData.success);
    createdOrderId = checkData.data.id;
    console.log(`  Generated Order ID: ${createdOrderId}`);

    // Verify stock decrement in database
    const afterProduct = await prisma.product.findUnique({ where: { id: selectedProductId } });
    const stockDecremented = afterProduct.stock === initialStock - 2;
    check(`Checkout Stock Deduction: verified stock successfully decremented by 2 in DB (${initialStock} -> ${afterProduct.stock})`, stockDecremented);
  } catch (err) {
    check(`Checkout with COD failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 6: Admin Login Promotion & Verification
  // ----------------------------------------
  section("6. Admin Login Promotion");
  try {
    // 1. Register new user for admin
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Admin",
        email: adminEmail,
        password: "adminpassword123",
        phone: "9999988888"
      })
    });
    const regData = await regRes.json();
    check("Registered test administrator profile in database", regRes.ok && regData.success);

    // 2. Programmatically promote the user to admin role using Prisma Client directly!
    await prisma.user.update({
      where: { email: adminEmail },
      data: { role: "admin" }
    });
    console.log("  [✓] Direct Prisma Injection: Elevated test user role to 'admin' successfully");

    // 3. Login as admin
    const logRes = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: adminEmail,
        password: "adminpassword123"
      })
    });
    const logData = await logRes.json();
    adminToken = logData.token;
    check("Admin logged in successfully and obtained Admin role token", logRes.ok && adminToken);
  } catch (err) {
    check(`Admin Login failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 7 & 8: Admin Add, Edit, Delete Product
  // ----------------------------------------
  section("7 & 8. Admin Catalog Product CRUD");
  try {
    // 1. Add Product
    const addRes = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Dynamic Gold Saree ${timestamp}`,
        slug: `dynamic-gold-${timestamp}`,
        description: "Exquisite handwoven luxury saree crafted in pure Kanchipuram style.",
        price: 18500,
        discountPrice: 15000,
        stock: 15,
        categoryId: selectedCategoryId,
        fabric: "Pure Silk",
        color: "Golden Yellow"
      })
    });
    const addData = await addRes.json();
    check("Admin: Product successfully created in catalog", addRes.ok && addData.success);
    newProductId = addData.data.id;
    console.log(`  Created Product: "${addData.data.name}" (ID: ${newProductId})`);

    // 2. Edit Product
    const editRes = await fetch(`${API_BASE}/products/${newProductId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        price: 19500,
        description: "Exquisite handwoven luxury saree crafted in pure Kanchipuram style (Updated description text)."
      })
    });
    const editData = await editRes.json();
    check("Admin: Product details edited successfully", editRes.ok && editData.success && editData.data.price === 19500);

    // 3. Delete Product
    const delRes = await fetch(`${API_BASE}/products/${newProductId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    const delData = await delRes.json();
    check("Admin: Product deleted from catalog successfully", delRes.ok && delData.success);
  } catch (err) {
    check(`Catalog Product CRUD failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 9: Admin Category CRUD
  // ----------------------------------------
  section("9. Admin Category CRUD");
  try {
    // 1. Create Category
    const addRes = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Bridal Banarasi ${timestamp}`,
        slug: `bridal-banarasi-${timestamp}`
      })
    });
    const addData = await addRes.json();
    check("Admin: Category created successfully", addRes.ok && addData.success);
    newCategoryId = addData.data.id;

    // 2. Edit Category
    const editRes = await fetch(`${API_BASE}/categories/${newCategoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        name: `Bridal Banarasi (Updated) ${timestamp}`
      })
    });
    const editData = await editRes.json();
    check("Admin: Category renamed successfully", editRes.ok && editData.success && editData.data.name.includes("Updated"));

    // 3. Delete Category
    const delRes = await fetch(`${API_BASE}/categories/${newCategoryId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    const delData = await delRes.json();
    check("Admin: Category deleted successfully from catalog", delRes.ok && delData.success);
  } catch (err) {
    check(`Category CRUD failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 10: Admin View & Update Orders
  // ----------------------------------------
  section("10. Admin Orders Management");
  try {
    // 1. View Orders
    const listRes = await fetch(`${API_BASE}/orders`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    const listData = await listRes.json();
    const orderFound = listData.data.some(o => o.id === createdOrderId);
    check("Admin: Verified customer's checkout order is listed in administrative log", listRes.ok && orderFound);

    // 2. Update Order Status to Shipped
    const statRes = await fetch(`${API_BASE}/orders/${createdOrderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        orderStatus: "Shipped"
      })
    });
    const statData = await statRes.json();
    check("Admin: Order delivery status updated to 'Shipped' successfully", statRes.ok && statData.success && statData.data.orderStatus === "Shipped");

    // 3. Update Order Payment Status to Paid
    const payRes = await fetch(`${API_BASE}/orders/${createdOrderId}/payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        paymentStatus: "Paid"
      })
    });
    const payData = await payRes.json();
    check("Admin: Order payment status updated to 'Paid' successfully", payRes.ok && payData.success && payData.data.paymentStatus === "Paid");
  } catch (err) {
    check(`Orders Management failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 11: Admin CMS Pages Manager
  // ----------------------------------------
  section("11. Admin CMS Pages Editor");
  try {
    // 1. Create Page
    const addRes = await fetch(`${API_BASE}/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        title: `Heritage Care Guide ${timestamp}`,
        slug: `heritage-care-${timestamp}`,
        content: "Always store pure silk sarees folded inside cotton wraps and dry clean only.",
        isPublished: true
      })
    });
    const addData = await addRes.json();
    check("Admin: CMS Page published successfully in database", addRes.ok && addData.success);
    newPageId = addData.data.id;

    // 2. Edit Page
    const editRes = await fetch(`${API_BASE}/pages/${newPageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        content: "Always store pure silk sarees folded inside cotton wraps, dry clean only, and air out every six months."
      })
    });
    const editData = await editRes.json();
    check("Admin: CMS Page editorial body updated successfully", editRes.ok && editData.success && editData.data.content.includes("six months"));

    // 3. Delete Page
    const delRes = await fetch(`${API_BASE}/pages/${newPageId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${adminToken}` }
    });
    const delData = await delRes.json();
    check("Admin: CMS Page deleted from database successfully", delRes.ok && delData.success);
  } catch (err) {
    check(`CMS Pages Editor failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Flow 12: Admin Boutique Configurations
  // ----------------------------------------
  section("12. Admin Boutique Settings & Copy");
  try {
    // 1. Shipping Settings
    const shipRes = await fetch(`${API_BASE}/settings/shipping`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        freeShippingAbove: 5999,
        shippingCharge: 120,
        codEnabled: true,
        deliveryDays: 4
      })
    });
    const shipData = await shipRes.json();
    check("Admin: Shipping rules (Logistics charges, delivery days) updated live in DB", shipRes.ok && shipData.success && shipData.data.freeShippingAbove === 5999);

    // 2. Payment Settings
    const payRes = await fetch(`${API_BASE}/settings/payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        razorpayKeyId: "rzp_test_modified999",
        razorpaySecret: "secretkey999",
        razorpayEnabled: true
      })
    });
    const payData = await payRes.json();
    check("Admin: Razorpay credentials and status configuration successfully persisted", payRes.ok && payData.success && payData.data.razorpayKeyId === "rzp_test_modified999");

    // 3. Homepage Settings
    const homeRes = await fetch(`${API_BASE}/settings/home`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        heroTitle: "Elegance of Silk Handlooms",
        heroSubtitle: "Handcrafted pure Kanchipuram bridal drapes for your special events.",
        offerBanner: "Flat 25% Off on Wedding Silk Sarees"
      })
    });
    const homeData = await homeRes.json();
    check("Admin: Dynamic homepage banners and editorial copy updated successfully in DB", homeRes.ok && homeData.success && homeData.data.heroTitle === "Elegance of Silk Handlooms");
  } catch (err) {
    check(`Boutique Settings failed: ${err.message}`, false);
  }

  // ----------------------------------------
  // Clean Up Customer Data from DB
  // ----------------------------------------
  section("Verification Cleanup");
  try {
    await prisma.orderItem.deleteMany({ where: { orderId: createdOrderId } });
    await prisma.order.delete({ where: { id: createdOrderId } });
    await prisma.cart.deleteMany({ where: { userId: logData?.user?.id } });
    await prisma.wishlist.deleteMany({ where: { userId: logData?.user?.id } });
    await prisma.user.delete({ where: { email: customerEmail } });
    await prisma.user.delete({ where: { email: adminEmail } });
    console.log("  [✓] Database sandbox logs successfully cleaned up!");
  } catch (err) {
    console.log(`  [!] Warning during cleanup: ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`🎉 ALL 12 FUNCTIONAL FLOWS SUCCESSFULLY VERIFIED!`);
  console.log(`========================================`);
  
  process.exit(0);
}

runTests();
