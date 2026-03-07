const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");

/**
 * Add product to cart
 */
const addToCartController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, quantity } = req.body;

    const product = await productModel.findById(product_id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Quantity exceeds available stock",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const existingCartItem = await cartModel.findOne({
      user_id: userId,
      product_id: product_id,
    });

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({
          message: "Cannot exceed stock limit",
        });
      }

      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();

      return res.status(200).json({
        message: "Cart updated",
        cart: existingCartItem,
      });
    }

    const cartItem = await cartModel.create({
      user_id: userId,
      product_id,
      quantity,
    });

    res.status(201).json({
      message: "Product added to cart",
      cart: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add to cart",
    });
  }
};

/**
 * Get user cart
 */
const getCartController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await cartModel
      .find({ user_id: userId })
      .populate("product_id");

    let total = 0;

    cartItems.forEach((item) => {
      total += item.product_id.price * item.quantity;
    });

    res.status(200).json({
      cart: cartItems,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
};

/**
 * Update cart quantity
 */
const updateCartItemController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const cartItem = await cartModel.findOne({
      user_id: userId,
      product_id: productId,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: "Quantity exceeds available stock",
      });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({
      message: "Cart updated",
      cart: cartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update cart",
    });
  }
};

/**
 * Remove item from cart
 */
const removeCartItemController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    await cartModel.findOneAndDelete({
      user_id: userId,
      product_id: productId,
    });

    res.status(200).json({
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove cart item",
    });
  }
};

module.exports = {
  addToCartController,
  getCartController,
  updateCartItemController,
  removeCartItemController,
};
