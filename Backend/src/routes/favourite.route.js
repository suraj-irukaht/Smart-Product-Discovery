const express = require("express");
const router = express.Router();
const {
  addToFavoritesController,
  removeFromFavoritesController,
  getFavoritesController,
} = require("../controllers/favorite.controller");

const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/:productId", authMiddleware, addToFavoritesController);
router.delete("/:productId", authMiddleware, removeFromFavoritesController);
router.get("/", authMiddleware, getFavoritesController);

module.exports = router;
