const express = require("express");
const router = express.Router();

const {
  createCategoryController,
  getCategoriesController,
  getTopCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} = require("../controllers/category.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategoryController,
);
router.get("/", getCategoriesController);

/**
 * Get most popular categories based on product sales
 * GET /categories/top
 */
router.get("/top", getTopCategoriesController);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateCategoryController,
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("ADMIN"),
  deleteCategoryController,
);

module.exports = router;
