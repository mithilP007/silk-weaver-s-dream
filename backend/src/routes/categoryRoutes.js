const express = require("express");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createCategoryBulk,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, adminOnly, createCategory);
router.post("/bulk", protect, adminOnly, createCategoryBulk);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

module.exports = router;