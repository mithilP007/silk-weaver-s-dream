const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const prisma = new PrismaClient();

async function runMigration() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseBucket = process.env.SUPABASE_BUCKET || "sri-kamatchi-images";

  console.log("====================================================");
  console.log("🚀 Starting Sri Kamatchi Silk Image Migration...");
  console.log("====================================================");

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ ERROR: Supabase environment variables are missing!");
    console.error("Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your env.");
    process.exit(1);
  }

  // 1. Migrate Products
  console.log("\n📦 Scanning Products...");
  const products = await prisma.product.findMany();
  let productsMigrated = 0;
  let productsSkipped = 0;
  let productsNeedsReupload = 0;

  for (const product of products) {
    const imageUrl = product.image;
    if (!imageUrl) {
      console.log(`- Product "${product.name}": No image associated. Skipping.`);
      productsSkipped++;
      continue;
    }

    if (imageUrl.startsWith("http")) {
      console.log(`- Product "${product.name}": Already hosted online (${imageUrl}). Skipping.`);
      productsSkipped++;
      continue;
    }

    if (imageUrl.startsWith("/uploads/")) {
      const filename = path.basename(imageUrl);
      const localPath = path.join(__dirname, "..", "uploads", "products", filename);

      if (fs.existsSync(localPath)) {
        console.log(`- Product "${product.name}": Found local file for ${filename}. Uploading to Supabase...`);
        try {
          const fileBuffer = fs.readFileSync(localPath);
          const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/products/${filename}`;

          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${supabaseServiceKey}`,
              "apikey": supabaseServiceKey,
              "Content-Type": getMimeType(filename),
            },
            body: fileBuffer,
          });

          const uploadData = await uploadResponse.json();

          if (!uploadResponse.ok) {
            throw new Error(uploadData.message || "Upload request rejected by Supabase");
          }

          const newImageUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/products/${filename}`;
          
          // Update DB
          await prisma.product.update({
            where: { id: product.id },
            data: { image: newImageUrl },
          });

          console.log(`  ✓ Success! Updated database record with: ${newImageUrl}`);
          productsMigrated++;
        } catch (err) {
          console.error(`  ❌ Failed to upload/update "${product.name}":`, err.message);
          productsNeedsReupload++;
        }
      } else {
        console.log(`  ⚠ Local file NOT found for "${product.name}" (${imageUrl}). Marked as 'Needs image re-upload'.`);
        productsNeedsReupload++;
      }
    } else {
      console.log(`- Product "${product.name}": Unknown image path structure (${imageUrl}). Skipping.`);
      productsSkipped++;
    }
  }

  // 2. Migrate Categories
  console.log("\n📁 Scanning Categories...");
  const categories = await prisma.category.findMany();
  let categoriesMigrated = 0;
  let categoriesSkipped = 0;
  let categoriesNeedsReupload = 0;

  for (const category of categories) {
    const imageUrl = category.image;
    if (!imageUrl) {
      console.log(`- Category "${category.name}": No image associated. Skipping.`);
      categoriesSkipped++;
      continue;
    }

    if (imageUrl.startsWith("http")) {
      console.log(`- Category "${category.name}": Already hosted online (${imageUrl}). Skipping.`);
      categoriesSkipped++;
      continue;
    }

    if (imageUrl.startsWith("/uploads/")) {
      const filename = path.basename(imageUrl);
      const localPath = path.join(__dirname, "..", "uploads", "categories", filename);

      if (fs.existsSync(localPath)) {
        console.log(`- Category "${category.name}": Found local file for ${filename}. Uploading to Supabase...`);
        try {
          const fileBuffer = fs.readFileSync(localPath);
          const uploadUrl = `${supabaseUrl}/storage/v1/object/${supabaseBucket}/categories/${filename}`;

          const uploadResponse = await fetch(uploadUrl, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${supabaseServiceKey}`,
              "apikey": supabaseServiceKey,
              "Content-Type": getMimeType(filename),
            },
            body: fileBuffer,
          });

          const uploadData = await uploadResponse.json();

          if (!uploadResponse.ok) {
            throw new Error(uploadData.message || "Upload request rejected by Supabase");
          }

          const newImageUrl = `${supabaseUrl}/storage/v1/object/public/${supabaseBucket}/categories/${filename}`;
          
          // Update DB
          await prisma.category.update({
            where: { id: category.id },
            data: { image: newImageUrl },
          });

          console.log(`  ✓ Success! Updated database record with: ${newImageUrl}`);
          categoriesMigrated++;
        } catch (err) {
          console.error(`  ❌ Failed to upload/update category "${category.name}":`, err.message);
          categoriesNeedsReupload++;
        }
      } else {
        console.log(`  ⚠ Local file NOT found for category "${category.name}" (${imageUrl}). Marked as 'Needs image re-upload'.`);
        categoriesNeedsReupload++;
      }
    } else {
      console.log(`- Category "${category.name}": Unknown image path structure (${imageUrl}). Skipping.`);
      categoriesSkipped++;
    }
  }

  console.log("\n====================================================");
  console.log("📊 Migration Summary:");
  console.log(`- Products: ${productsMigrated} migrated, ${productsSkipped} skipped, ${productsNeedsReupload} needs re-upload`);
  console.log(`- Categories: ${categoriesMigrated} migrated, ${categoriesSkipped} skipped, ${categoriesNeedsReupload} needs re-upload`);
  console.log("====================================================");

  await prisma.$disconnect();
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".jpg":
    case ".jpeg":
    default:
      return "image/jpeg";
  }
}

runMigration().catch((err) => {
  console.error("Migration execution failed:", err);
  process.exit(1);
});
