const prisma = require("../config/prisma");

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const category = await prisma.category.create({
      data: { name, slug },
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
    const { name, slug, image } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, image },
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

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};