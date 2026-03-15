const orderModel = require("../models/order.model");
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

/**
 * GET /admin/charts
 *
 * Returns all data needed for dashboard graphs:
 *
 * 1. revenueByMonth   — revenue per month for the last 6 months (line chart)
 * 2. ordersByStatus   — count of orders grouped by status (pie/bar chart)
 * 3. topProducts      — top 5 most sold products by quantity (bar chart)
 * 4. newUsersByMonth  — new buyer registrations per month (bar chart)
 */
const getAdminCharts = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [
      revenueByMonth,
      ordersByStatus,
      topProducts,
      newUsersByMonth,
      recentOrders,
    ] = await Promise.all([
      // ── 1. Revenue per month (last 6 months) ──────────────
      orderModel.aggregate([
        {
          $match: {
            status: { $in: ["PAID", "DELIVERED"] },
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$total_amount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            _id: 0,
            month: {
              $dateToString: {
                format: "%b %Y",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: 1,
                  },
                },
              },
            },
            revenue: 1,
            orders: 1,
          },
        },
      ]),

      // ── 2. Orders by status ────────────────────────────────
      orderModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            count: 1,
          },
        },
        { $sort: { count: -1 } },
      ]),

      // ── 3. Top 5 most sold products ────────────────────────
      orderModel.aggregate([
        {
          $match: {
            status: { $in: ["PAID", "SHIPPED", "DELIVERED"] },
          },
        },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product_id",
            totalSold: { $sum: "$items.quantity" },
            revenue: {
              $sum: { $multiply: ["$items.quantity", "$items.price"] },
            },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
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
            _id: 0,
            name: { $substr: ["$product.name", 0, 20] }, // truncate for chart
            totalSold: 1,
            revenue: 1,
          },
        },
      ]),

      // ── 4. New buyers per month (last 6 months) ────────────
      userModel.aggregate([
        {
          $match: {
            role: "BUYER",
            createdAt: { $gte: sixMonthsAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            newUsers: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        {
          $project: {
            _id: 0,
            month: {
              $dateToString: {
                format: "%b %Y",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: 1,
                  },
                },
              },
            },
            newUsers: 1,
          },
        },
      ]),

      // ── 5. Recent 5 orders ─────────────────────────────────
      orderModel
        .find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user_id", "name email")
        .lean()
        .then((orders) =>
          orders.map((o) => ({
            id: o._id.toString().slice(-8).toUpperCase(),
            status: o.status,
            amount: o.total_amount,
            itemCount: o.items?.length ?? 0,
            buyer: o.user_id?.name ?? "Unknown",
            email: o.user_id?.email ?? "",
            date: o.createdAt,
          })),
        ),
    ]);

    res.status(200).json({
      revenueByMonth,
      ordersByStatus,
      topProducts,
      newUsersByMonth,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch chart data" });
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
    res.status(200).json({ ...getPaginationMeta(total, page, limit), users });
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
  getAdminCharts,
  getUsersByRole,
  toggleLockUser,
  deleteProductByAdmin,
  toggleProductStatus,
};
