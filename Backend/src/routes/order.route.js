const express = require("express");
const router = express.Router();

const {
  createOrderController,
  getOrderController,
  updateOrderStatusController,
  getAllOrderController,
  getOrderDetailsController,
  cancelOrderController,
  getSellerOrdersController,
  updateSellerOrderStatusController,
} = require("../controllers/order.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

/**
 * - Checkout all the orders
 */
router.post("/checkout", authMiddleware, createOrderController);

/**
 * - Get all the checkout orders
 */
router.get("/", authMiddleware, getOrderController);

/**
 * - Orders status controller by admin
 */
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllOrderController,
);

router.get(
  "/admin/:orderId",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getOrderDetailsController,
);
router.patch(
  "/admin/:orderId/status",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateOrderStatusController,
);

/**
 * - cancel order by buyer
 */
router.patch(
  "/:orderId/cancel",
  authMiddleware,
  roleMiddleware("BUYER"),
  cancelOrderController,
);

router.get(
  "/seller",
  authMiddleware,
  roleMiddleware("SELLER"),
  getSellerOrdersController,
);

module.exports = router;
