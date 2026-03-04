const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

//categorySchema.index({ name: 1 }, { unique: true });

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;
