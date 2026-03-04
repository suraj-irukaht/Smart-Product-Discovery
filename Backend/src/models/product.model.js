const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    image_url: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    seller_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppUser",
      required: true,
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
