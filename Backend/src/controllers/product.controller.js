const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const createProductController = async (req, res) => {
  try {
    const { name, description, price, image_url, brand, stock, category_id } =
      req.body;

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
      brand,
      stock,
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
/** old will recplace it later
async function getProductController(req, res) {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    let filter = {};
    // 🔎 search by product name OR brand OR category
    if (search) {
      // find categories that match search
      const categories = await categoryModel.find({
        name: { $regex: search, $options: "i" },
      });
      const categoryIds = categories.map((cat) => cat._id);
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category_id: { $in: categoryIds } },
      ];
    }
    // const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || 10;
    const { page, limit, skip } = getPagination(req);

    //const skip = (page - 1) * limit;

    // 📦 filter by category
    if (category) {
      filter.category_id = category;
    }

    // 💰 price filter
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) filter.price.$gte = Number(minPrice);

      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // create query
    let query = productModel
      .find(filter)
      .populate("category_id", "name")
      .populate("seller_id", "name");

    // 🔄 sorting
    if (sort === "price_asc") query = query.sort({ price: 1 });

    if (sort === "price_desc") query = query.sort({ price: -1 });

    if (sort === "newest") query = query.sort({ createdAt: -1 });

    if (sort === "oldest") query = query.sort({ createdAt: 1 });

    const products = await query.skip(skip).limit(limit);

    const totalProducts = await productModel.countDocuments(filter);

    res.status(200).json({
      //total: products.length,
      ...getPaginationMeta(totalProducts, page, limit),
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}
  */

async function getProductController(req, res) {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;

    const { page, limit, skip } = getPagination(req);

    let match = {};

    // 🔎 search
    if (search) {
      match.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // 📦 category filter
    if (category) {
      match.category_id = new mongoose.Types.ObjectId(category);
    }

    // 💰 price filter
    if (minPrice || maxPrice) {
      match.price = {};

      if (minPrice) match.price.$gte = Number(minPrice);
      if (maxPrice) match.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const products = await productModel.aggregate([
      { $match: match },

      // join category
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },

      { $unwind: "$category" },

      // join seller
      {
        $lookup: {
          from: "users",
          localField: "seller_id",
          foreignField: "_id",
          as: "seller",
        },
      },

      { $unwind: "$seller" },

      { $sort: sortOption },

      { $skip: skip },
      { $limit: limit },
    ]);

    const totalProducts = await productModel.countDocuments(match);

    res.status(200).json({
      ...getPaginationMeta(totalProducts, page, limit),
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
}

async function getMyProductController(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = {
      seller_id: req.user._id,
    };
    const products = await productModel.find(filter).skip(skip).limit(limit);
    const totalProducts = await productModel.countDocuments(filter);

    res.json({
      //count: products.length,
      ...getPaginationMeta(totalProducts, page, limit),
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
