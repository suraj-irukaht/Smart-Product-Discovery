const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  createProductController,
  getMyProductController,
  updateProductController,
  deleteProductController,
} = require("../controllers/product.controller");

/**
 * ===============================
 * Seller Product Routes
 * ===============================
 */

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("SELLER"),
  createProductController,
);

router.get(
  "/my-products",
  authMiddleware,
  roleMiddleware("SELLER"),
  getMyProductController,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("SELLER"),
  updateProductController,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("SELLER"),
  deleteProductController,
);

module.exports = router;
