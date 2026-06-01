const express = require("express");

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getSingleProduct);

router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;