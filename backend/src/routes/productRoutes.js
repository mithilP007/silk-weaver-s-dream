const express = require("express");

const {
  createProduct,
  createProductBulk,
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
router.post("/bulk", protect, adminOnly, createProductBulk);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
