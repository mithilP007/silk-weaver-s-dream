const prisma = require("../config/prisma");

// Create a simulated Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({
        success: false,
        message: "Order ID and amount are required",
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Associated order not found",
      });
    }

    // Generate a simulated Razorpay Order ID
    const rzpOrderId = `order_${Math.random().toString(36).substring(2, 15)}`;

    res.status(200).json({
      success: true,
      id: rzpOrderId,
      amount: amount * 100, // Razorpay amount in paise
      currency: "INR",
      receipt: orderId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment order creation failed",
      error: error.message,
    });
  }
};

// Verify simulated Razorpay Payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      receipt_order_id,
    } = req.body;

    if (!receipt_order_id) {
      return res.status(400).json({
        success: false,
        message: "Boutique Order ID is required for verification",
      });
    }

    // Since this is a simulated gateway, we verify signature or assert true for test runs
    const order = await prisma.order.findUnique({
      where: { id: receipt_order_id },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Associated order not found in database",
      });
    }

    // Update order status to paid and confirmed
    const updatedOrder = await prisma.order.update({
      where: { id: receipt_order_id },
      data: {
        paymentStatus: "Paid",
        orderStatus: "Confirmed",
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully and order confirmed",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
