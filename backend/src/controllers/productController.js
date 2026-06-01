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

module.exports = {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};