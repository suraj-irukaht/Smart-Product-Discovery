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
    brand: {
      type: String,
      trim: true,
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
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

// 🔎 search optimization
productSchema.index({ name: "text", brand: "text" });

// 📦 filter optimization
productSchema.index({ category_id: 1 });

// 💰 price filter optimization
productSchema.index({ price: 1 });

// 👤 seller dashboard optimization
productSchema.index({ seller_id: 1 });

// 📅 sorting optimization
productSchema.index({ createdAt: -1 });

const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
