const express = require("express");
const router = express.Router();

const {
  createCategoryController,
  getCategoriesController,
  getTopCategoriesController,
} = require("../controllers/category.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategoryController,
);
router.get("/get", getCategoriesController);

/**
 * Get most popular categories based on product sales
 * GET /categories/top
 */
router.get("/top", getTopCategoriesController);

module.exports = router;
