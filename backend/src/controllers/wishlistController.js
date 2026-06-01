const prisma = require("../config/prisma");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check duplicate
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    const newItem = await prisma.wishlist.create({
      data: { userId, productId },
      include: { product: true },
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: newItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
      error: error.message,
    });
  }
};

const getMyWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
};

const removeWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const item = await prisma.wishlist.findUnique({
      where: { id },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    if (item.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This wishlist item does not belong to you.",
      });
    }

    await prisma.wishlist.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Wishlist item removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove wishlist item",
      error: error.message,
    });
  }
};

const removeWishlistByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const item = await prisma.wishlist.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found for this product",
      });
    }

    await prisma.wishlist.delete({
      where: {
        id: item.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Wishlist item removed by product ID",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove wishlist item by product ID",
      error: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.wishlist.deleteMany({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear wishlist",
      error: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getMyWishlist,
  removeWishlistItem,
  removeWishlistByProductId,
  clearWishlist,
};
