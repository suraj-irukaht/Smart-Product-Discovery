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

/**
 * - Routes used
 */
app.use("/api/auth", authroutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

module.exports = app;
