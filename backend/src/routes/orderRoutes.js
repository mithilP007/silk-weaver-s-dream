const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrders,
  getSingleOrder,
  updateOrderStatus,
  updatePaymentStatus,
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Customer/Any Authenticated User Routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin Only Routes
router.get("/", protect, adminOnly, getOrders);
router.get("/:id", protect, adminOnly, getSingleOrder);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.put("/:id/payment", protect, adminOnly, updatePaymentStatus);

module.exports = router;
