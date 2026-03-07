const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

const {
  addReviewController,
  getProductReviewsController,
} = require("../controllers/review.controller");

/**
 * Add review
 */
router.post(
  "/:id/review",
  authMiddleware,
  roleMiddleware("BUYER"),
  addReviewController,
);

/**
 * Get reviews
 */
router.get("/:id/reviews", getProductReviewsController);

module.exports = router;
