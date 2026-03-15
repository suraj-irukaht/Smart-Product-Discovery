const mongoose = require("mongoose");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const orderModel = require("../models/order.model");
const recentlyViewedModel = require("../models/recentlyViewed.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * ============================================================
 * BEHAVIORAL INTEREST ENGINE
 * ============================================================
 *
 * Builds a dynamic interest profile for a user based on behavior.
 *
 * Signal weights:
 *   Purchase  → 10 pts  (from order.items — embedded in Order model)
 *   View      →  1 pt   (from RecentlyViewed, recency-decayed)
 *   Prefs     →  3 pts  (fallback only if no behavioral data)
 *
 * NOTE: Items are embedded in Order (order.items[]),
 * NOT in a separate OrderItem collection.
 *
 * @param {ObjectId} userId
 * @returns {{ rankedCategories: ObjectId[], seenProductIds: ObjectId[] }}
 */
async function buildUserInterestProfile(userId) {
  const categoryScores = {};

  // ── Signal 1: Purchase history via embedded order.items (weight: 10) ──
  const orders = await orderModel
    .find({ user_id: userId })
    .select("items")
    .populate("items.product_id", "category_id")
    .lean();

  for (const order of orders) {
    for (const item of order.items || []) {
      const catId = item.product_id?.category_id?.toString();
      if (catId) {
        categoryScores[catId] = (categoryScores[catId] || 0) + 10;
      }
    }
  }

  // ── Signal 2: Recently viewed (weight: 1 with recency decay) ──────────
  const viewedItems = await recentlyViewedModel
    .find({ user_id: userId })
    .sort({ viewed_at: -1 })
    .limit(30)
    .populate("product_id", "category_id")
    .lean();

  const seenProductIds = [];

  viewedItems.forEach((item, index) => {
    const product = item.product_id;
    if (!product) return;

    seenProductIds.push(product._id);

    const catId = product.category_id?.toString();
    if (!catId) return;

    // More recent views score higher
    const recencyWeight = 1 / (1 + index * 0.1);
    categoryScores[catId] = (categoryScores[catId] || 0) + recencyWeight;
  });

  // ── Signal 3: Explicit preferences (fallback only) ────────────────────
  const user = await userModel.findById(userId).select("preferences").lean();
  if (user?.preferences?.length) {
    for (const catId of user.preferences) {
      const key = catId.toString();
      if (!categoryScores[key]) {
        categoryScores[key] = 3;
      }
    }
  }

  // Rank categories by score descending
  const rankedCategories = Object.entries(categoryScores)
    .sort(([, a], [, b]) => b - a)
    .map(([catId]) => new mongoose.Types.ObjectId(catId));

  return { rankedCategories, seenProductIds };
}

/**
 * ============================================================
 * GET /discovery/for-you
 * ============================================================
 * Master personalised feed.
 * Auth: Optional (degrades to popular for guests)
 */
const getForYouController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    // ── Guest fallback ───────────────────────────────────────
    if (!req.user) {
      const products = await productModel
        .find({ status: "ACTIVE" })
        .sort({ views: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category_id", "name")
        .lean();

      const total = await productModel.countDocuments({ status: "ACTIVE" });

      return res.status(200).json({
        source: "popular_fallback",
        ...getPaginationMeta(total, page, limit),
        products,
      });
    }

    const { rankedCategories, seenProductIds } = await buildUserInterestProfile(
      req.user._id,
    );

    // ── Cold start: no behavior yet ──────────────────────────
    if (rankedCategories.length === 0) {
      const products = await productModel
        .find({ status: "ACTIVE" })
        .sort({ views: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category_id", "name")
        .lean();

      const total = await productModel.countDocuments({ status: "ACTIVE" });

      return res.status(200).json({
        source: "cold_start",
        message: "Browse more or set preferences to get personalised picks",
        ...getPaginationMeta(total, page, limit),
        products,
      });
    }

    // ── Personalised feed ────────────────────────────────────
    const result = await productModel.aggregate([
      {
        $match: {
          status: "ACTIVE",
          category_id: { $in: rankedCategories },
          _id: { $nin: seenProductIds },
        },
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              {
                $multiply: [
                  {
                    $switch: {
                      branches: rankedCategories.map((catId, index) => ({
                        case: { $eq: ["$category_id", catId] },
                        then: rankedCategories.length - index,
                      })),
                      default: 0,
                    },
                  },
                  10,
                ],
              },
              { $ifNull: ["$views", 0] },
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1 } },
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
        $project: {
          name: 1,
          price: 1,
          brand: 1,
          mainImage: 1,
          image_url: 1,
          stock: 1,
          views: 1,
          relevanceScore: 1,
          category: { name: 1 },
          createdAt: 1,
        },
      },
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);

    const items = result[0].products;
    const total = result[0].totalCount[0]?.total || 0;

    res.status(200).json({
      source: "personalised",
      ...getPaginationMeta(total, page, limit),
      products: items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch personalised feed" });
  }
};

/**
 * ============================================================
 * GET /discovery/trending
 * ============================================================
 * FIX: Rewritten to use order.items (embedded) instead of
 * separate orderItem collection.
 * Auth: Optional (personalised if logged in)
 */
const getPersonalizedTrendingController = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let categoryFilter = null;

    if (req.user) {
      const { rankedCategories } = await buildUserInterestProfile(req.user._id);
      if (rankedCategories.length > 0) {
        categoryFilter = rankedCategories.slice(0, 5);
      }
    }

    // Aggregate from orders using embedded items array
    const pipeline = [
      // Only orders from last 7 days
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $in: ["PAID", "SHIPPED", "DELIVERED"] },
        },
      },

      // Unwind the embedded items array
      { $unwind: "$items" },

      // Group by product and sum quantity
      {
        $group: {
          _id: "$items.product_id",
          totalSold: { $sum: "$items.quantity" },
        },
      },

      { $sort: { totalSold: -1 } },

      // Join product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.status": "ACTIVE" } },
    ];

    // Inject category filter for personalised trending
    if (categoryFilter) {
      pipeline.push({
        $match: { "product.category_id": { $in: categoryFilter } },
      });
    }

    pipeline.push(
      { $limit: 10 },
      {
        $project: {
          totalSold: 1,
          product: {
            _id: 1,
            name: 1,
            price: 1,
            brand: 1,
            mainImage: 1,
            image_url: 1,
            category_id: 1,
          },
        },
      },
    );

    const products = await orderModel.aggregate(pipeline);

    res.status(200).json({
      source: categoryFilter ? "personalised_trending" : "global_trending",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trending products" });
  }
};

/**
 * ============================================================
 * GET /discovery/popular
 * ============================================================
 * FIX: Rewritten to use order.items (embedded).
 */
const getPopularController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);

    const result = await orderModel.aggregate([
      // Only count completed orders
      {
        $match: {
          status: { $in: ["PAID", "SHIPPED", "DELIVERED"] },
        },
      },

      // Unwind embedded items
      { $unwind: "$items" },

      // Group by product
      {
        $group: {
          _id: "$items.product_id",
          totalSold: { $sum: "$items.quantity" },
        },
      },

      { $sort: { totalSold: -1 } },

      // Join product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.status": "ACTIVE" } },

      {
        $project: {
          totalSold: 1,
          product: {
            _id: 1,
            name: 1,
            price: 1,
            brand: 1,
            mainImage: 1,
            image_url: 1,
          },
        },
      },
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);

    const products = result[0].products;
    const total = result[0].totalCount[0]?.total || 0;

    res.status(200).json({
      source: "popular",
      ...getPaginationMeta(total, page, limit),
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch popular products" });
  }
};

/**
 * ============================================================
 * GET /discovery/frequently-bought/:productId
 * ============================================================
 * FIX: Rewritten to use order.items (embedded).
 * Finds products that appear in the same orders as productId.
 */
const getFrequentlyBoughtTogetherController = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const productObjId = new mongoose.Types.ObjectId(productId);

    const results = await orderModel.aggregate([
      // Step 1: Orders that contain this product
      {
        $match: {
          "items.product_id": productObjId,
          status: { $in: ["PAID", "SHIPPED", "DELIVERED"] },
        },
      },

      // Step 2: Unwind all items in those orders
      { $unwind: "$items" },

      // Step 3: Exclude the original product
      {
        $match: {
          "items.product_id": { $ne: productObjId },
        },
      },

      // Step 4: Count co-purchase frequency
      {
        $group: {
          _id: "$items.product_id",
          boughtTogetherCount: { $sum: 1 },
        },
      },

      { $sort: { boughtTogetherCount: -1 } },
      { $limit: 8 },

      // Step 5: Join product details
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.status": "ACTIVE" } },

      {
        $project: {
          boughtTogetherCount: 1,
          product: {
            _id: 1,
            name: 1,
            price: 1,
            brand: 1,
            mainImage: 1,
            image_url: 1,
          },
        },
      },
    ]);

    res.status(200).json({ products: results });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch frequently bought together" });
  }
};

/**
 * ============================================================
 * GET /discovery/re-engage
 * ============================================================
 * Viewed but not purchased. Auth required.
 */
const getReEngageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all product IDs the user has purchased
    const orders = await orderModel
      .find({ user_id: userId })
      .select("items.product_id")
      .lean();

    const purchasedIds = orders.flatMap((o) =>
      o.items.map((i) => i.product_id.toString()),
    );

    // Viewed but never purchased
    const viewedNotBought = await recentlyViewedModel
      .find({
        user_id: userId,
        product_id: {
          $nin: purchasedIds.map((id) => new mongoose.Types.ObjectId(id)),
        },
      })
      .sort({ viewed_at: -1 })
      .limit(20)
      .populate({
        path: "product_id",
        match: { status: "ACTIVE" },
        populate: { path: "category_id", select: "name" },
      })
      .lean();

    const products = viewedNotBought
      .filter((item) => item.product_id)
      .map((item) => ({
        ...item.product_id,
        lastViewed: item.viewed_at,
        hasPriceDrop: !!item.product_id.discountPrice,
      }));

    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch re-engagement products" });
  }
};

/**
 * ============================================================
 * GET /discovery/because-you-viewed/:productId
 * ============================================================
 * Same category + similar price range, sorted by views.
 * Auth: Optional
 */
const getBecauseYouViewedController = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const product = await productModel.findById(productId).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const priceMin = product.price * 0.7;
    const priceMax = product.price * 1.3;

    const products = await productModel
      .find({
        _id: { $ne: product._id },
        category_id: product.category_id,
        status: "ACTIVE",
        price: { $gte: priceMin, $lte: priceMax },
      })
      .sort({ views: -1 })
      .limit(10)
      .populate("category_id", "name")
      .lean();

    res.status(200).json({
      basedOn: { _id: product._id, name: product.name },
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch similar products" });
  }
};

/**
 * ============================================================
 * GET /discovery/users-also-viewed/:productId
 * ============================================================
 * Collaborative filtering via recentlyViewed.
 * Auth: Not required
 */
const getUsersAlsoViewedController = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const productObjId = new mongoose.Types.ObjectId(productId);

    const results = await recentlyViewedModel.aggregate([
      { $match: { product_id: productObjId } },
      {
        $lookup: {
          from: "recentlyvieweds",
          localField: "user_id",
          foreignField: "user_id",
          as: "otherViews",
        },
      },
      { $unwind: "$otherViews" },
      { $match: { "otherViews.product_id": { $ne: productObjId } } },
      {
        $group: {
          _id: "$otherViews.product_id",
          viewedByCount: { $sum: 1 },
        },
      },
      { $sort: { viewedByCount: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $match: { "product.status": "ACTIVE" } },
      {
        $project: {
          viewedByCount: 1,
          product: {
            _id: 1,
            name: 1,
            price: 1,
            brand: 1,
            mainImage: 1,
            image_url: 1,
          },
        },
      },
    ]);

    res.status(200).json({ products: results });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch collaborative recommendations" });
  }
};

/**
 * ============================================================
 * GET /discovery/recent
 * ============================================================
 */
const getRecentController = async (req, res) => {
  try {
    const products = await productModel
      .find({ status: "ACTIVE" })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("category_id", "name")
      .populate("seller_id", "name")
      .lean();

    res.status(200).json({ source: "recent", products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recent products" });
  }
};

/**
 * ============================================================
 * GET /discovery/suggestions?q=keyword
 * ============================================================
 */
const getSmartSuggestionsController = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({ suggestions: [] });
    }

    const safeQ = escapeRegex(q);
    let preferredCategories = [];

    if (req.user) {
      const { rankedCategories } = await buildUserInterestProfile(req.user._id);
      preferredCategories = rankedCategories.slice(0, 3);
    }

    const products = await productModel
      .find({
        $or: [
          { name: { $regex: `^${safeQ}`, $options: "i" } },
          { brand: { $regex: `^${safeQ}`, $options: "i" } },
        ],
        status: "ACTIVE",
      })
      .limit(20)
      .select("name brand category_id")
      .lean();

    const sorted = products.sort((a, b) => {
      const aInPref = preferredCategories.some(
        (c) => c.toString() === a.category_id?.toString(),
      );
      const bInPref = preferredCategories.some(
        (c) => c.toString() === b.category_id?.toString(),
      );
      return bInPref - aInPref;
    });

    const suggestions = [
      ...new Set(sorted.flatMap((p) => [p.name, p.brand]).filter(Boolean)),
    ].slice(0, 10);

    res.status(200).json({ suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
};

module.exports = {
  getForYouController,
  getBecauseYouViewedController,
  getUsersAlsoViewedController,
  getFrequentlyBoughtTogetherController,
  getPersonalizedTrendingController,
  getReEngageController,
  getSmartSuggestionsController,
  getPopularController,
  getRecentController,
};
