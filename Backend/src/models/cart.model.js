const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appUser",
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
);

cartSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
