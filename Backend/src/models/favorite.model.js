const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
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
  },
  { timestamps: true },
);

favoriteSchema.index({ user_id: 1 });
favoriteSchema.index({ product_id: 1 });
favoriteSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const favoriteModel = mongoose.model("Favourite", favoriteSchema);
module.exports = favoriteModel;
