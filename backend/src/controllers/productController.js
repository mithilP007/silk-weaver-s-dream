const prisma = require("../config/prisma");

const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product creation failed",
      error: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Products fetch failed",
      error: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product fetch failed",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product update failed",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product delete failed",
      error: error.message,
    });
  }
};

const createProductBulk = async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body) ? req.body : req.body.products;
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Payload must be a non-empty array of product rows",
      });
    }

    // Fetch existing categories for mapping
    const existingCategories = await prisma.category.findMany();
    const categoryMap = new Map();
    existingCategories.forEach((cat) => {
      categoryMap.set(cat.name.trim().toLowerCase(), cat);
    });

    // Fetch existing product slugs to prevent collisions
    const existingProducts = await prisma.product.findMany({ select: { slug: true } });
    const usedSlugs = new Set(existingProducts.map((p) => p.slug));

    const validationErrors = [];
    const processedProducts = [];

    const toBool = (val) => {
      if (typeof val === "boolean") return val;
      if (typeof val === "number") return val === 1;
      if (typeof val === "string") {
        const clean = val.trim().toLowerCase();
        return clean === "true" || clean === "1" || clean === "yes";
      }
      return false;
    };

    for (let i = 0; i < rawItems.length; i++) {
      const row = rawItems[i] || {};
      const rowNum = i + 1;

      const name = (row.name || row["Product Name"] || row.productName || "").toString().trim();
      const categoryName = (row.categoryName || row["Category Name"] || row.category || "").toString().trim();
      const rawPrice = row.price ?? row["Price"];
      const rawDiscount = row.discountPrice ?? row["Discount Price"];
      const rawStock = row.stock ?? row["Stock"];
      const fabric = (row.fabric || row["Fabric"] || "").toString().trim() || null;
      const color = (row.color || row["Color"] || "").toString().trim() || null;
      const occasion = (row.occasion || row["Occasion"] || "").toString().trim() || null;
      const description = (row.description || row["Description"] || "").toString().trim();
      const rawSlug = (row.slug || row["Slug"] || "").toString().trim();
      const image = (row.image || row["Image URL"] || row.imageUrl || "").toString().trim() || null;

      const isTrending = toBool(row.isTrending ?? row["Is Trending"]);
      const isFeatured = toBool(row.isFeatured ?? row["Is Featured"]);
      const isOffer = toBool(row.isOffer ?? row["Is Offer"]);

      // 1. Validate Product Name
      if (!name) {
        validationErrors.push(`Row ${rowNum}: Product Name is required.`);
      }

      // 2. Validate Category
      if (!categoryName) {
        validationErrors.push(`Row ${rowNum}: Category Name is required.`);
      }

      const matchedCategory = categoryName ? categoryMap.get(categoryName.toLowerCase()) : null;
      if (categoryName && !matchedCategory) {
        validationErrors.push(`Row ${rowNum}: Category '${categoryName}' does not exist in database.`);
      }

      // 3. Validate Price
      const price = parseFloat(rawPrice);
      if (rawPrice === undefined || rawPrice === null || rawPrice === "" || isNaN(price) || price <= 0) {
        validationErrors.push(`Row ${rowNum}: Price must be a valid positive number.`);
      }

      // 4. Validate Stock
      const stock = parseInt(rawStock, 10);
      if (rawStock === undefined || rawStock === null || rawStock === "" || isNaN(stock) || stock < 0) {
        validationErrors.push(`Row ${rowNum}: Stock must be a valid non-negative integer.`);
      }

      // 5. Validate Description
      if (!description) {
        validationErrors.push(`Row ${rowNum}: Description is required.`);
      }

      // Optional discount price validation
      let discountPrice = null;
      if (rawDiscount !== undefined && rawDiscount !== null && rawDiscount !== "") {
        const parsedDiscount = parseFloat(rawDiscount);
        if (!isNaN(parsedDiscount) && parsedDiscount >= 0) {
          discountPrice = parsedDiscount;
        }
      }

      // Skip row processing if errors exist
      if (!name || !categoryName || !matchedCategory || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0 || !description) {
        continue;
      }

      // Slug generation and uniqueness check
      let baseSlug = rawSlug
        ? rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      if (!baseSlug) {
        baseSlug = `saree-${Date.now()}-${rowNum}`;
      }

      let finalSlug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(finalSlug);

      processedProducts.push({
        name,
        slug: finalSlug,
        description,
        price,
        discountPrice,
        stock,
        fabric,
        color,
        occasion,
        isTrending,
        isFeatured,
        isOffer,
        image,
        categoryId: matchedCategory.id,
      });
    }

    // Return 400 if validation errors and no valid products
    if (validationErrors.length > 0 && processedProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Bulk upload validation failed",
        errors: validationErrors,
      });
    }

    if (processedProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid product rows to insert",
        errors: validationErrors,
      });
    }

    // Bulk insert using Prisma
    const insertResult = await prisma.product.createMany({
      data: processedProducts,
    });

    res.status(201).json({
      success: true,
      message: `Successfully imported ${insertResult.count} products`,
      count: insertResult.count,
      failedCount: rawItems.length - insertResult.count,
      errors: validationErrors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk product creation failed due to server error",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductBulk,
};

