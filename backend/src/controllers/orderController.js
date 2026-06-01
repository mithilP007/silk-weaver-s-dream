const prisma = require("../config/prisma");

const createOrder = async (req, res) => {
  try {
    const {
      items,
      paymentMethod,
      customerName,
      customerPhone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found with ID ${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}. Available: ${product.stock}, Ordered: ${item.quantity}`);
        }

        // Calculate price (use discountPrice if available, else standard price)
        const price = product.discountPrice !== null ? product.discountPrice : product.price;
        totalAmount += price * item.quantity;

        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: price,
        });

        // Reduce stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });
      }

      // Create order
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount,
          paymentMethod,
          customerName,
          customerPhone,
          address,
          city,
          state,
          pincode,
          orderItems: {
            create: orderItemsData,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

      return order;
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Order creation failed",
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch your orders",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { orderStatus },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const allowedPaymentStatuses = ["Pending", "Paid", "Failed", "Refunded"];

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Allowed: ${allowedPaymentStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  updatePaymentStatus,
};
