const express = require("express");
const {
  getShippingSettings,
  updateShippingSettings,
  getPaymentSettings,
  updatePaymentSettings,
  getHomeSettings,
  updateHomeSettings,
} = require("../controllers/settingsController");

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Shipping settings routes
router.get("/shipping", getShippingSettings);
router.put("/shipping", protect, adminOnly, updateShippingSettings);

// Payment settings routes
router.get("/payment", protect, adminOnly, getPaymentSettings);
router.put("/payment", protect, adminOnly, updatePaymentSettings);

// Home layout settings routes
router.get("/home", getHomeSettings);
router.put("/home", protect, adminOnly, updateHomeSettings);

module.exports = router;
