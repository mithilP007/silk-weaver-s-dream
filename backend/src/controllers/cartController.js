const prisma = require("../config/prisma");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const qty = parseInt(quantity.toString());
    if (qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // Check product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check existing cart item
    const existingItem = await prisma.cart.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    const targetQty = existingItem ? existingItem.quantity + qty : qty;

    if (product.stock < targetQty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock} items available.`,
      });
    }

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: targetQty },
        include: { product: true },
      });
    } else {
      cartItem = await prisma.cart.create({
        data: { userId, productId, quantity: qty },
        include: { product: true },
      });
    }

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
};

const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cart.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total cost
    let total = 0;
    for (const item of cartItems) {
      const price =
        item.product.discountPrice !== null ? item.product.discountPrice : item.product.price;
      total += price * item.quantity;
    }

    res.status(200).json({
      success: true,
      data: cartItems,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
      error: error.message,
    });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const qty = parseInt(quantity.toString());

    // Find cart item
    const cartItem = await prisma.cart.findUnique({
      where: { id },
      include: { product: true },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cartItem.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This cart item does not belong to you.",
      });
    }

    if (qty <= 0) {
      await prisma.cart.delete({ where: { id } });
      return res.status(200).json({
        success: true,
        message: "Cart item deleted because quantity was 0 or less",
      });
    }

    // Check stock availability
    if (cartItem.product.stock < qty) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${cartItem.product.stock} items available.`,
      });
    }

    const updated = await prisma.cart.update({
      where: { id },
      data: { quantity: qty },
      include: { product: true },
    });

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update cart quantity",
      error: error.message,
    });
  }
};

const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const cartItem = await prisma.cart.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cartItem.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. This cart item does not belong to you.",
      });
    }

    await prisma.cart.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Cart item removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove cart item",
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await prisma.cart.deleteMany({
      where: { userId },
    });

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
      error: error.message,
    });
  }
};

module.exports = {
  addToCart,
  getMyCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
};
