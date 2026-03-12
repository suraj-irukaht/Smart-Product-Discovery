const express = require("express");
const router = express.Router();

const discoveryRoutes = require("./product.discovery.routes");
const sellerRoutes = require("./product.seller.routes");
const reviewRoutes = require("./product.review.route");

const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  getProductController,
  getProductByIdController,
  getRecentlyViewedProductsController,
} = require("../controllers/product.controller");

router.get(
  "/",
  authMiddleware,
  roleMiddleware("BUYER", "ADMIN"),
  getProductController,
);

/**
 * ===============================
 * Discovery Routes
 * ===============================
 */

router.use("/", discoveryRoutes);

/**
 * ===============================
 * Product review Routes
 * ===============================
 */

router.use("/", reviewRoutes);

/**
 * ===============================
 * Recently viewed Routes
 * ===============================
 */

router.get(
  "/recently-viewed",
  authMiddleware,
  getRecentlyViewedProductsController,
);
/**
 * ===============================
 * Buyer Product Routes
 * ===============================
 */

router.get("/:id", authMiddleware, getProductByIdController);

/**
 * ===============================
 * Seller Routes
 * ===============================
 */

router.use("/", sellerRoutes);

module.exports = router;
