const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const recentlyViewedModel = require("../models/recentlyViewed.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");
const uploadFile = require("../services/storage.service");

/**
 * ============================================================
 * Create Product
 * POST /products
 * Auth: Required (seller)
 * ============================================================
 */
const createProductController = async (req, res) => {
  try {
    const { name, description, price, brand, stock, category_id } = req.body;

    const category = await categoryModel.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const mainIndex = Number(req.body.mainImage || 0);
    const files = req.files || [];

    const uploadedImages = await Promise.all(
      files.map(async (file) => await uploadFile(file)),
    );

    const image_urls = uploadedImages.map((img) => img.url);

    const product = await productModel.create({
      name,
      description,
      price,
      brand,
      stock,
      category_id,
      image_url: image_urls,
      mainImage: image_urls[mainIndex] || image_urls[0] || null,
      seller_id: req.user._id,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create product" });
  }
};

/**
 * ============================================================
 * Get All Products
 * GET /products
 * Supports: search, category filter, price range, sort, pagination
 * Auth: Not required
 * ============================================================
 */
const getProductController = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    const { page, limit, skip } = getPagination(req);

    let match = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      match.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { brand: { $regex: safeSearch, $options: "i" } },
      ];
    }

    if (category) {
      match.category_id = new mongoose.Types.ObjectId(category);
    }

    if (minPrice || maxPrice) {
      match.price = {};
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min)) match.price.$gte = min;
      if (!isNaN(max)) match.price.$lte = max;
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const products = await productModel.aggregate([
      { $match: match },

      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "appusers",
          localField: "seller_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          name: 1,
          price: 1,
          brand: 1,
          stock: 1,
          status: 1,
          image_url: 1,
          mainImage: 1,
          category: { name: 1 },
          seller: { name: 1, email: 1 },
          createdAt: 1,
        },
      },

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
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * ============================================================
 * Get My Products (Seller's own listings)
 * GET /products/me
 * Auth: Required (seller)
 * ============================================================
 */
const getMyProductController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = { seller_id: req.user._id };

    const products = await productModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalProducts = await productModel.countDocuments(filter);

    res.json({
      ...getPaginationMeta(totalProducts, page, limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * ============================================================
 * Get Product By ID
 * GET /products/:id
 * Also: increments view count + tracks recently viewed
 * Auth: Optional (tracks views only if logged in)
 * ============================================================
 */
const getProductByIdController = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productModel
      .findById(productId)
      .populate("category_id", "name")
      .populate("seller_id", "name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Increment view count
    await productModel.updateOne({ _id: productId }, { $inc: { views: 1 } });

    // Track recently viewed (only if logged in)
    if (req.user) {
      await recentlyViewedModel.findOneAndUpdate(
        { user_id: req.user._id, product_id: productId },
        { $set: { viewed_at: new Date() } },
        { upsert: true, returnDocument: "after" },
      );
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/**
 * ============================================================
 * Update Product
 * PATCH /products/:id
 * Auth: Required (must be the seller who owns this product)
 * ============================================================
 */
const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const {
      name,
      description,
      price,
      brand,
      stock,
      category_id,
      discountPrice,
    } = req.body;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this product",
      });
    }

    const updateData = {
      name,
      description,
      price,
      brand,
      stock,
      category_id,
      discountPrice,
    };

    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((file) => uploadFile(file)),
      );
      const urls = uploaded.map((r) => r.url);
      updateData.image_url = urls;
      updateData.mainImage = urls[Number(req.body.mainImage) || 0];
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

/**
 * ============================================================
 * Delete Product
 * DELETE /products/:id
 * Auth: Required (must be the seller who owns this product)
 * ============================================================
 */
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this product",
      });
    }

    await productModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/**
 * ============================================================
 * Get Recently Viewed Products
 * GET /products/recently-viewed
 * Auth: Required
 * ============================================================
 */
const getRecentlyViewedProductsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const viewedProducts = await recentlyViewedModel
      .find({ user_id: userId })
      .sort({ viewed_at: -1 })
      .limit(10)
      .populate("product_id");

    const products = viewedProducts.map((item) => item.product_id);

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch recently viewed products" });
  }
};

module.exports = {
  createProductController,
  getProductController,
  getMyProductController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  getRecentlyViewedProductsController,
};
