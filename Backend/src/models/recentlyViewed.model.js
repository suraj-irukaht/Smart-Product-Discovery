const mongoose = require("mongoose");

const recentlyViewedSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppUser",
      required: true,
    },

    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    viewed_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// prevent duplicate entries
recentlyViewedSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model("RecentlyViewed", recentlyViewedSchema);
