const express = require("express");
const router = express.Router();

const {
  createCategoryController,
  getCategoriesController,
} = require("../controllers/category.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.post(
  "/create",
  authMiddleware,
  roleMiddleware("ADMIN"),
  createCategoryController,
);
router.get("/get", getCategoriesController);

module.exports = router;
