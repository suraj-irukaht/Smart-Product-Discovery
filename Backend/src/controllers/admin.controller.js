const orderModel = require("../models/order.model");
const orderItemModel = require("../models/orderItem.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const { getPagination, getPaginationMeta } = require("../utils/pagination");

const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      revenueResult,
    ] = await Promise.all([
      userModel.countDocuments({ role: "BUYER" }),
      userModel.countDocuments({ role: "SELLER" }),
      productModel.countDocuments(),
      orderModel.countDocuments(),
      orderModel.aggregate([
        { $match: { status: { $in: ["PAID", "DELIVERED"] } } },
        { $group: { _id: null, total: { $sum: "$total_amount" } } },
      ]),
    ]);

    res.status(200).json({
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueResult[0]?.total ?? 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { page, limit, skip } = getPagination(req);

    const filter = { role: role.toUpperCase() };

    const [users, total] = await Promise.all([
      userModel.find(filter).select("-password").skip(skip).limit(limit),
      userModel.countDocuments(filter),
    ]);

    res.status(200).json({
      ...getPaginationMeta(total, page, limit),
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const toggleLockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.is_locked = !user.is_locked;
    await user.save();

    res.status(200).json({
      message: `User ${user.is_locked ? "locked" : "unlocked"} successfully`,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle user lock" });
  }
};

const deleteProductByAdmin = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};

const toggleProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.status = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await product.save();

    res.status(200).json({ message: `Product ${product.status}`, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to toggle product status" });
  }
};

module.exports = {
  getAdminStats,
  getUsersByRole,
  toggleLockUser,
  deleteProductByAdmin,
  toggleProductStatus,
};
