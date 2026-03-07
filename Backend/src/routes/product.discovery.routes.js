const express = require("express");
const router = express.Router();

const {
  getProductSuggestionsController,
  getPopularProductsController,
  getTrendingProductsController,
  getRecentProductsController,
  getRecommendedProductsController,
  getRelatedProductsController,
} = require("../controllers/product.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

/**
 * ===============================
 * Product Discovery Routes
 * ===============================
 */

/**
 * Autocomplete suggestions
 */
router.get("/suggestions", getProductSuggestionsController);

/**
 * Popular products
 */
router.get("/popular", getPopularProductsController);

/**
 * Trending products
 */
router.get("/trending", getTrendingProductsController);

/**
 * Recently added products
 */
router.get("/recent", getRecentProductsController);

/**
 * Recommended products
 */
router.get("/recommended", authMiddleware, getRecommendedProductsController);

/**
 * Related products
 */
router.get("/related/:productId", getRelatedProductsController);

module.exports = router;
