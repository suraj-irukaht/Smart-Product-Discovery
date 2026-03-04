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

const getMyProductController = async (req, res) => {
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
};

module.exports = {
  createProductController,
  getProductController,
  getMyProductController,
};
