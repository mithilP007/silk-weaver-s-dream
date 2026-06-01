const express = require("express");

const {
  addToWishlist,
  getMyWishlist,
  removeWishlistItem,
  removeWishlistByProductId,
  clearWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.post("/", addToWishlist);
router.get("/", getMyWishlist);
router.delete("/product/:productId", removeWishlistByProductId);
router.delete("/:id", removeWishlistItem);
router.delete("/", clearWishlist);

module.exports = router;
