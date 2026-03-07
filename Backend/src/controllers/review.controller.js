const reviewModel = require("../models/review.model");

/**
 * Add product review
 * POST /products/:id/review
 */
const addReviewController = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user._id;

    const { rating, comment } = req.body;

    const review = await reviewModel.create({
      product_id: productId,
      user_id: userId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already reviewed this product",
      });
    }

    res.status(500).json({
      message: "Failed to add review",
    });
  }
};

/**
 * Get product reviews
 * GET /products/:id/reviews
 */
const getProductReviewsController = async (req, res) => {
  try {
    const productId = req.params.id;

    const reviews = await reviewModel
      .find({ product_id: productId })
      .populate("user_id", "name");

    res.status(200).json({
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

module.exports = {
  addReviewController,
  getProductReviewsController,
};
