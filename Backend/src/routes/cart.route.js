const express = require("express");
const router = express.Router();

const {
  addToCartController,
  getCartController,
  updateCartItemController,
  removeCartItemController,
} = require("../controllers/cart.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/", authMiddleware, addToCartController);

router.get("/", authMiddleware, getCartController);

router.patch("/:productId", authMiddleware, updateCartItemController);

router.delete("/:productId", authMiddleware, removeCartItemController);

module.exports = router;
