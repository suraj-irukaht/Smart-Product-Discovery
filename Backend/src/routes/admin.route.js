const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");
const {
  getAdminStats,
  getUsersByRole,
  toggleLockUser,
  deleteProductByAdmin,
  toggleProductStatus,
} = require("../controllers/admin.controller");
const {
  getAllOrderController,
  getOrderDetailsController,
  updateOrderStatusController,
} = require("../controllers/order.controller");

router.use(authMiddleware);
router.use(roleMiddleware("ADMIN"));

router.get("/stats", getAdminStats);
router.get("/orders", getAllOrderController);
router.get("/orders/:orderId", getOrderDetailsController);
router.patch("/orders/:orderId/status", updateOrderStatusController);
router.get("/users/:role", getUsersByRole);
router.delete("/products/:productId", deleteProductByAdmin);
router.patch("/users/:userId/lock", toggleLockUser);
router.patch("/products/:productId/status", toggleProductStatus);

module.exports = router;
