const orderModel = require("../models/order.model");
const orderItemModel = require("../models/orderItem.model");
const productModel = require("../models/product.model");
const cartModel = require("../models/cart.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");
const { createNotification } = require("./notification.controller"); // ← new

const createOrderController = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await cartModel
      .find({ user_id: userId })
      .populate("product_id");

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    // Check stock
    for (const item of cartItems) {
      const product = item.product_id;
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product: ${product.name}`,
        });
      }
      total += product.price * item.quantity;
    }

    // Create order
    const order = await orderModel.create({
      user_id: userId,
      total_amount: total,
    });

    const orderItems = [];

    // Reduce stock safely and prepare order items
    for (const item of cartItems) {
      const product = item.product_id;

      const updatedProduct = await productModel.findOneAndUpdate(
        { _id: product._id, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
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

    // Insert order items into separate collection
    await orderItemModel.insertMany(orderItems);

    // ── Also embed items in order document ───────────────────
    // Discovery engine ($unwind: "$items") reads from the order
    // document directly — without this trending/popular stay empty
    await orderModel.findByIdAndUpdate(order._id, {
      $set: {
        items: orderItems.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
        })),
      },
    });
    // ─────────────────────────────────────────────────────────

    // Clear cart
    await cartModel.deleteMany({ user_id: userId });

    // ── Notify admin ──────────────────────────────────────────
    // Fire-and-forget — don't await, don't let it block the response
    createNotification({
      type: "NEW_ORDER",
      title: "New Order Placed",
      message: `Order #${String(order._id).slice(-6).toUpperCase()} · $${total.toFixed(2)} from ${req.user.name ?? req.user.email}`,
      link: "/admin/orders",
    });
    // ─────────────────────────────────────────────────────────

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

const getOrderController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, skip } = getPagination(req);
    const filter = { user_id: userId };
    const orders = await orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalOrders = await orderModel.countDocuments(filter);
    res.status(200).json({
      ...getPaginationMeta(totalOrders, page, limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

const getAllOrderController = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req);
    const orders = await orderModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id");
    const totalOrders = await orderModel.countDocuments();
    res.status(200).json({
      ...getPaginationMeta(totalOrders, page, limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getOrderDetailsController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId).populate("user_id");
    if (!order) return res.status(404).json({ message: "Order not found" });
    const items = await orderItemModel
      .find({ order_id: orderId })
      .populate("product_id");
    res.status(200).json({ order, items });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

const cancelOrderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user_id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to cancel this order" });
    }
    if (order.status !== "PENDING") {
      return res
        .status(400)
        .json({ message: "Order cannot be cancelled after shipping" });
    }
    const orderItems = await orderItemModel.find({ order_id: orderId });
    for (const item of orderItems) {
      await productModel.updateOne(
        { _id: item.product_id },
        { $inc: { stock: item.quantity } },
      );
    }
    order.status = "CANCELLED";
    await order.save();
    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

const getSellerOrdersController = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page, limit, skip } = getPagination(req);
    const { status } = req.query;
    const sellerItems = await orderItemModel
      .find()
      .populate({ path: "product_id", match: { seller_id: sellerId } });
    const filtered = sellerItems.filter((i) => i.product_id !== null);
    const orderIds = [...new Set(filtered.map((i) => String(i.order_id)))];
    const filter = { _id: { $in: orderIds } };
    if (status && status !== "ALL") filter.status = status;
    const total = await orderModel.countDocuments(filter);
    const orders = await orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "name email");
    const result = await Promise.all(
      orders.map(async (order) => {
        const items = await orderItemModel
          .find({ order_id: order._id })
          .populate({ path: "product_id", match: { seller_id: sellerId } });
        const sellerOnlyItems = items.filter((i) => i.product_id !== null);
        return { order, items: sellerOnlyItems };
      }),
    );
    res
      .status(200)
      .json({ ...getPaginationMeta(total, page, limit), orders: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch seller orders" });
  }
};

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
  getSellerOrdersController,
  updateSellerOrderStatusController,
};
