const orderModel = require("../models/order.model");
const orderItemModel = require("../models/orderItem.model");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const createOrderController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await cartModel
      .find({ user_id: userId })
      .populate("product_id");

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let total = 0;

    // ✅ Check stock
    for (const item of cartItems) {
      const product = item.product_id;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}`,
        });
      }

      total += product.price * item.quantity;
    }

    // ✅ Create order
    const order = await orderModel.create({
      user_id: userId,
      total_amount: total,
    });

    const orderItems = [];

    // ✅ Reduce stock and prepare order items
    // for (const item of cartItems) {
    //   const product = item.product_id;

    //   await productModel.updateOne(
    //     { _id: product._id },
    //     { $inc: { stock: -item.quantity } },
    //   );

    //   orderItems.push({
    //     order_id: order._id,
    //     product_id: product._id,
    //     quantity: item.quantity,
    //     price: product.price,
    //   });
    // }

    // ✅ Reduce stock safely and prepare order items
    for (const item of cartItems) {
      const product = item.product_id;

      const updatedProduct = await productModel.findOneAndUpdate(
        {
          _id: product._id,
          stock: { $gte: item.quantity }, // ensure enough stock
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true },
      );

      if (!updatedProduct) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.name}`,
        });
      }

      orderItems.push({
        order_id: order._id,
        product_id: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // ✅ Insert order items
    await orderItemModel.insertMany(orderItems);

    // ✅ Clear cart
    await cartModel.deleteMany({ user_id: userId });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create order",
    });
  }
};

const getOrderController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, skip } = getPagination(req);

    const filter = { user_id: userId };

    const orders = await orderModel.find(filter).skip(skip).limit(limit);
    const totalOrders = await orderModel.countDocuments(filter);
    res.status(200).json({
      ...getPaginationMeta(totalOrders, page, limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

/**
 * - See all order ADMIN
 */
const getAllOrderController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const orders = await orderModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate("user_id");

    const totalOrders = await orderModel.countDocuments();

    res.status(200).json({
      ...getPaginationMeta(totalOrders, page, limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

/**
 * - See individual order details by ADMIN
 */
const getOrderDetailsController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await orderModel.findById(orderId).populate("user_id");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const items = await orderItemModel
      .find({ order_id: orderId })
      .populate("product_id");

    res.status(200).json({
      order,
      items,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch order details",
    });
  }
};

/**
 * - cancle the order from buyer
 */

const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // check if order belongs to buyer
    if (order.user_id.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to cancel this order",
      });
    }

    // only allow cancellation when pending
    if (order.status !== "PENDING") {
      return res.status(400).json({
        message: "Order cannot be cancelled after shipping",
      });
    }

    // get order items
    const orderItems = await orderItemModel.find({ order_id: orderId });

    // restore stock
    for (const item of orderItems) {
      await productModel.updateOne(
        { _id: item.product_id },
        { $inc: { stock: item.quantity } },
      );
    }

    // update order status
    order.status = "CANCELLED";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to cancel order",
    });
  }
};

/**
 * GET /seller/orders
 * Returns all orders that contain at least one of the seller's products.
 */
const getSellerOrdersController = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page, limit, skip } = getPagination(req);
    const { status } = req.query;

    // Find all order items belonging to this seller's products
    const sellerItems = await orderItemModel
      .find()
      .populate({ path: "product_id", match: { seller_id: sellerId } });

    // Keep only items whose product belongs to this seller
    const filtered = sellerItems.filter((i) => i.product_id !== null);

    // Get unique order IDs
    const orderIds = [...new Set(filtered.map((i) => String(i.order_id)))];

    // Build filter
    const filter = { _id: { $in: orderIds } };
    if (status && status !== "ALL") filter.status = status;

    const total = await orderModel.countDocuments(filter);
    const orders = await orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "name email");

    // Attach only this seller's items to each order
    const result = await Promise.all(
      orders.map(async (order) => {
        const items = await orderItemModel
          .find({ order_id: order._id })
          .populate({ path: "product_id", match: { seller_id: sellerId } });
        const sellerOnlyItems = items.filter((i) => i.product_id !== null);
        return { order, items: sellerOnlyItems };
      }),
    );

    res.status(200).json({
      ...getPaginationMeta(total, page, limit),
      orders: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch seller orders" });
  }
};

/**
 * PATCH /seller/orders/:orderId/status
 * Seller can update status to SHIPPED or DELIVERED only.
 */
const updateSellerOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowed = ["SHIPPED", "DELIVERED"];
    if (!allowed.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status. Allowed: SHIPPED, DELIVERED" });
    }

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

module.exports = {
  createOrderController,
  getOrderController,
  updateOrderStatusController,
  getAllOrderController,
  getOrderDetailsController,
  cancelOrderController,
  getSellerOrdersController, // ← add
  updateSellerOrderStatusController, // ← add
};
