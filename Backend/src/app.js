const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

/**
 * - Routes required
 */
const authroutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const categoryRoutes = require("./routes/category.route");
const productRoutes = require("./routes/product.route");
const favouriteRoutes = require("./routes/favourite.route");
const cartRoutes = require("./routes/cart.route");
const orderRoutes = require("./routes/order.route");
const adminRoutes = require("./routes/admin.route");
const discoveryRoutes = require("./routes/discovery.route");
const notificaitonRoutes = require("./routes/notification.routes");
//const reviewRoutes = require("./routes/product.review.route");

/**
 * - Routes used
 */
app.use("/api/auth", authroutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favouriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/discovery", discoveryRoutes);
app.use("/api/admin/notifications", notificaitonRoutes);

module.exports = app;
