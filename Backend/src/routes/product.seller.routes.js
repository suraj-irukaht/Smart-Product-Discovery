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

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.use(authMiddleware);
router.use(roleMiddleware("SELLER"));

/**
 * ===============================
 * Seller Product Routes
 * ===============================
 */

router.post(
  "/seller/create",
  upload.array("images", 10),
  createProductController,
);

router.get("/seller/my-products", getMyProductController);

router.put(
  "/seller/update/:id",
  upload.array("images", 10),
  updateProductController,
);

router.delete("/seller/delete/:id", deleteProductController);

module.exports = router;
