const favoriteModel = require("../models/favorite.model");
const productModel = require("../models/product.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

/**
 * Add product to favorites
 */
const addToFavoritesController = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // check if already favorited
    const existingFavorite = await favoriteModel.findOne({
      user_id: userId,
      product_id: productId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "Product already in favorites",
      });
    }

    const favorite = await favoriteModel.create({
      user_id: userId,
      product_id: productId,
    });

    res.status(201).json({
      message: "Product added to favorites",
      favorite,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add favorite",
    });
  }
};

/**
 * Remove product from favorites
 */
const removeFromFavoritesController = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const favorite = await favoriteModel.findOneAndDelete({
      user_id: userId,
      product_id: productId,
    });

    if (!favorite) {
      return res.status(404).json({
        message: "Favorite not found",
      });
    }

    res.status(200).json({
      message: "Product removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove favorite",
    });
  }
};

/**
 * Get all favorites for a user
 */
const getFavoritesController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { page, limit, skip } = getPagination(req);

    const filter = { user_id: userId };

    const favorites = await favoriteModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .populate("product_id");

    const totalFavorites = await favoriteModel.countDocuments(filter);

    res.status(200).json({
      ...getPaginationMeta(totalFavorites, page, limit),
      favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch favorites",
    });
  }
};

module.exports = {
  addToFavoritesController,
  removeFromFavoritesController,
  getFavoritesController,
};
