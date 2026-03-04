const express = require("express");
const router = express.Router();

const {
  createProductController,
  getProductController,
  getMyProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} = require("../controllers/product.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

/**
 * - Seller Routes
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

/**
 * - Buyer Routes
 */
router.get("/get", getProductController);
router.get("/:id", getProductByIdController);

module.exports = router;
