const express = require("express");
const {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/pageController");

const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Public route to get all published pages
router.get("/", getPages);

// Public route to get details of a page by slug
router.get("/:slug", getPageBySlug);

// Admin-only protected CRUD routes
router.post("/", protect, adminOnly, createPage);
router.put("/:id", protect, adminOnly, updatePage);
router.delete("/:id", protect, adminOnly, deletePage);

module.exports = router;
