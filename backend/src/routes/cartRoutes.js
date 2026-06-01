const express = require("express");

const {
  addToCart,
  getMyCart,
  updateCartQuantity,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All cart routes require user authentication
router.use(protect);

router.post("/", addToCart);
router.get("/", getMyCart);
router.put("/:id", updateCartQuantity);
router.delete("/:id", removeCartItem);
router.delete("/", clearCart);

module.exports = router;
