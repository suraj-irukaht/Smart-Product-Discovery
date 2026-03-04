const express = require("express");
const router = express.Router();

const {
  createProductController,
  getProductController,
  getMyProductController,
} = require("../controllers/product.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// only sellers can create products
router.post(
  "/create",
  authMiddleware,
  roleMiddleware("SELLER"),
  createProductController,
);
router.get("/get", getProductController);
// only sellers can get his/her own products
router.get(
  "/my-products",
  authMiddleware,
  roleMiddleware("SELLER"),
  getMyProductController,
);

module.exports = router;
