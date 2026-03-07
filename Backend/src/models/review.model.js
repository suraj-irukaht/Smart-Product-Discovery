const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppUser",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ product_id: 1, user_id: 1 }, { unique: true });

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
