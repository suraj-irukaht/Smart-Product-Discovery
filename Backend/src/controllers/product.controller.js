const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");

const createProductController = async (req, res) => {
  try {
    const { name, description, price, image_url, category_id } = req.body;

    // check if category exists
    const category = await categoryModel.findById(category_id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      image_url,
      category_id,
      seller_id: req.user._id, // seller comes from auth middleware
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

async function getProductController(req, res) {
  try {
    const products = await productModel.find();
    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(401).json({
      message: "Failed to fetch categories",
    });
  }
}

async function getMyProductController(req, res) {
  try {
    const products = await productModel.find({
      seller_id: req.user._id,
    });

    res.json({
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

async function getProductByIdController(req, res) {
  try {
    const { id } = req.params;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await productModel
      .findById(id)
      .populate("category_id", "name")
      .populate("seller_id", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
}

const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category_id } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // check ownership (very important)
    if (product.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this product",
      });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        image_url,
        category_id,
      },
      { new: true },
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // check ownership
    if (product.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this product",
      });
    }

    await productModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};

module.exports = {
  createProductController,
  getProductController,
  getMyProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
};
