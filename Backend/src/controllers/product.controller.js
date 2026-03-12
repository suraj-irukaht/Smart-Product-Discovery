const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const categoryModel = require("../models/category.model");
const userModel = require("../models/user.model");
const recentlyViewedModel = require("../models/recentlyViewed.model");
const orderItemModel = require("../models/orderItem.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");
const uploadFile = require("../services/storage.service");

const createProductController = async (req, res) => {
  try {
    const { name, description, price, brand, stock, category_id, mainImage } =
      req.body;

    // check if category exists
    const category = await categoryModel.findById(category_id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const mainIndex = Number(req.body.mainImage || 0);

    const files = req.files || [];

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        return await uploadFile(file);
      }),
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
      mainImage: image_urls[mainIndex],
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
      {
        $lookup: {
          from: "appusers", // ← was "users"
          localField: "seller_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $unwind: {
          path: "$appusers",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      // join seller
      {
        $lookup: {
          from: "appusers",
          localField: "seller_id",
          foreignField: "_id",
          as: "seller",
        },
      },

      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true,
        },
      },
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

/**
 * Get single product by ID
 * Also tracks:
 * - product view count
 * - recently viewed products
 *
 * GET /products/:id
 */
const getProductByIdController = async (req, res) => {
  try {
    const productId = req.params.id;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    // find product
    const product = await productModel
      .findById(productId)
      .populate("category_id", "name")
      .populate("seller_id", "name email");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    /**
     * Increment product view count
     */
    await productModel.updateOne({ _id: productId }, { $inc: { views: 1 } });

    /**
     * Save recently viewed (only if user logged in)
     */

    if (req.user) {
      await recentlyViewedModel.findOneAndUpdate(
        {
          user_id: req.user._id,
          product_id: productId,
        },
        {
          $set: { viewed_at: new Date() },
        },
        {
          upsert: true,
          //new: true,
          returnDocument: "after",
        },
      );
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
};

const updateProductController = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      brand,
      stock,
      category_id,
      discountPrice,
    } = req.body;

    console.log(
      name,
      description,
      price,
      brand,
      stock,
      category_id,
      discountPrice,
    );

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
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

/**
 * Get Popular Products
 *
 * Description:
 * Returns the most popular products based on the total quantity sold.
 * The popularity is calculated from the orderItems collection by grouping
 * products and summing the quantity of each product sold.
 *
 * Steps:
 * 1. Group order items by product_id
 * 2. Sum the total quantity sold for each product
 * 3. Sort products by highest sales
 * 4. Limit results to top products
 * 5. Join product details using $lookup
 *
 * Endpoint:
 * GET /products/popular
 *
 * Response:
 * List of top selling products with basic product information.
 */

const getPopularProductsController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const result = await orderItemModel.aggregate([
      // group orders by product
      {
        $group: {
          _id: "$product_id",
          totalSold: { $sum: "$quantity" },
        },
      },

      // sort by most sold
      {
        $sort: { totalSold: -1 },
      },

      // join product data
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      {
        $unwind: "$product",
      },

      // return product fields
      {
        $project: {
          totalSold: 1,
          product: {
            _id: "$product._id",
            name: "$product.name",
            price: "$product.price",
            brand: "$product.brand",
            image_url: "$product.image_url",
            views: "$product.views",
            category_id: "$product.category_id",
          },
        },
      },
      /**
       * FACET → split into two pipelines
       */
      {
        $facet: {
          /**
           * paginated products
           */
          products: [{ $skip: skip }, { $limit: limit }],

          /**
           * total count
           */
          totalCount: [{ $count: "total" }],
        },
      },
    ]);

    const products = result[0].products;
    const total = result[0].totalCount[0]?.total || 0;

    res.status(200).json({
      ...getPaginationMeta(total, page, limit),
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch popular products",
    });
  }
};

/**
 * Get Related Products
 *
 * Description:
 * Returns products that belong to the same category as the given product.
 * The current product is excluded from the results.
 *
 * Endpoint:
 * GET /products/related/:productId
 *
 * Use Case:
 * Display "Related Products" on the product detail page.
 */
const getRelatedProductsController = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const relatedProducts = await productModel
      .find({
        category_id: product.category_id,
        _id: { $ne: productId }, // exclude current product
      })
      .limit(10)
      .populate("category_id", "name");

    res.status(200).json({
      products: relatedProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch related products",
    });
  }
};

/**
 * Get Recommended Products For User
 *
 * Description:
 * Returns personalized product recommendations based on the user's preferred
 * categories stored in the user profile.
 *
 * Pagination:
 * Supports pagination using query parameters:
 * ?page=1&limit=10
 *
 * Endpoint:
 * GET /products/recommended
 *
 * Authorization:
 * Requires authenticated user
 */
const getRecommendedProductsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { page, limit, skip } = getPagination(req);

    const user = await userModel.findById(userId);

    if (!user || !user.preferences || user.preferences.length === 0) {
      return res.status(200).json({
        products: [],
        message: "No preferences found for user",
      });
    }

    const filter = {
      category_id: { $in: user.preferences },
      status: "ACTIVE",
    };

    const products = await productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .populate("category_id", "name")
      .populate("seller_id", "name");

    const totalProducts = await productModel.countDocuments(filter);

    res.status(200).json({
      ...getPaginationMeta(totalProducts, page, limit),
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch recommended products",
    });
  }
};

/**
 * Get Trending Products
 *
 * Description:
 * Returns products that have the highest sales in the last 7 days.
 * Uses orderItems collection to calculate recent purchase activity.
 *
 * Endpoint:
 * GET /products/trending
 *
 * Use Case:
 * Display "Trending Now" products on homepage.
 */
const getTrendingProductsController = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const products = await orderItemModel.aggregate([
      // join orders to get order date
      {
        $lookup: {
          from: "orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },

      { $unwind: "$order" },

      // filter orders within last 7 days
      {
        $match: {
          "order.createdAt": { $gte: sevenDaysAgo },
        },
      },

      // group by product
      {
        $group: {
          _id: "$product_id",
          totalSold: { $sum: "$quantity" },
        },
      },

      // sort most sold
      {
        $sort: { totalSold: -1 },
      },

      // top products
      {
        $limit: 10,
      },

      // join product info
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },

      { $unwind: "$product" },

      {
        $project: {
          totalSold: 1,
          product: {
            _id: 1,
            name: 1,
            price: 1,
            brand: 1,
            image_url: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch trending products",
    });
  }
};

/**
 * Get Recently Added Products
 *
 * Description:
 * Returns the most recently added products based on the createdAt timestamp.
 * Products are sorted by newest first.
 *
 * Endpoint:
 * GET /products/recent
 *
 * Use Case:
 * Display "Recently Added Products" on homepage.
 */
const getRecentProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("category_id", "name")
      .populate("seller_id", "name");

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recent products",
    });
  }
};

/**
 * Get Product Search Suggestions
 *
 * Description:
 * Returns autocomplete suggestions for product search based on
 * product name or brand. Removes duplicates and sorts results.
 *
 * Endpoint:
 * GET /products/suggestions?q=keyword
 */
const getProductSuggestionsController = async (req, res) => {
  try {
    const { q } = req.query;

    // prevent unnecessary queries
    if (!q || q.length < 2) {
      return res.status(200).json({
        suggestions: [],
      });
    }

    const products = await productModel
      .find({
        $or: [
          { name: { $regex: `^${q}`, $options: "i" } },
          { brand: { $regex: `^${q}`, $options: "i" } },
        ],
      })
      .limit(10)
      .select("name brand");

    // collect suggestions
    const suggestions = products.map((p) => p.name);

    // remove duplicates
    const uniqueSuggestions = [...new Set(suggestions)];

    // sort alphabetically
    uniqueSuggestions.sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      suggestions: uniqueSuggestions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch suggestions",
    });
  }
};

/**
 * Get recently viewed products
 * GET /products/recently-viewed
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

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recently viewed products",
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
  getPopularProductsController,
  getRelatedProductsController,
  getRecommendedProductsController,
  getTrendingProductsController,
  getRecentProductsController,
  getProductSuggestionsController,
  getRecentlyViewedProductsController,
};
