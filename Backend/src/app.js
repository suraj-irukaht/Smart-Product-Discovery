const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

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
//app.use("/api/products", reviewRoutes);

module.exports = app;
