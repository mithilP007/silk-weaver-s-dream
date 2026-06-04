const prisma = require("../config/prisma");

const createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, gallery } = req.body;

    const category = await prisma.category.create({
      data: { name, slug, description, image, gallery },
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Category creation failed",
      error: error.message,
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, image, description, gallery } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, image, description, gallery },
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Category update failed",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because it has ${productCount} related products. Please reassign or delete these products first.`,
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Category deletion failed",
      error: error.message,
    });
  }
};

const createCategoryBulk = async (req, res) => {
  try {
    const categories = req.body;
    if (!Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: "Payload must be an array of categories",
      });
    }

    const validationErrors = [];
    const slugsInPayload = new Set();
    const processedCategories = [];

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const rowNum = i + 1;

      if (!cat.name || !cat.name.trim()) {
        validationErrors.push(`Row ${rowNum}: Category Name is required.`);
        continue;
      }

      let slug = cat.slug ? cat.slug.trim() : "";
      if (!slug) {
        // Auto-generate slug
        slug = cat.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }

      if (!slug) {
        validationErrors.push(`Row ${rowNum}: Could not generate a valid slug from Category Name.`);
        continue;
      }

      if (slugsInPayload.has(slug)) {
        validationErrors.push(`Row ${rowNum}: Duplicate slug '${slug}' in the input list.`);
      } else {
        slugsInPayload.add(slug);
      }

      processedCategories.push({
        name: cat.name.trim(),
        slug,
        image: cat.image ? cat.image.trim() : null,
        description: cat.description ? cat.description.trim() : null,
        gallery: cat.gallery || null,
      });
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    if (processedCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No category rows to insert",
      });
    }

    // Check database for existing slugs
    const slugsToCheck = Array.from(slugsInPayload);
    const existingCategories = await prisma.category.findMany({
      where: {
        slug: { in: slugsToCheck },
      },
      select: { slug: true },
    });

    if (existingCategories.length > 0) {
      const existingSlugs = existingCategories.map((c) => c.slug);
      return res.status(400).json({
        success: false,
        message: `Slug(s) already exist in database: ${existingSlugs.join(", ")}`,
        errors: existingSlugs.map((s) => `Slug '${s}' already exists in database.`),
      });
    }

    // Safe bulk insert
    const result = await prisma.category.createMany({
      data: processedCategories,
    });

    // Fetch the created categories to return them
    const createdCategories = await prisma.category.findMany({
      where: {
        slug: { in: slugsToCheck },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(201).json({
      success: true,
      message: "Bulk categories created successfully",
      count: result.count,
      data: createdCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Bulk category creation failed",
      error: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createCategoryBulk,
};