const express = require("express");
const {
  updateProfileController,
  getProfileController,
} = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 *  */

router.get("/profile", authMiddleware, getProfileController);
router.put("/profile", authMiddleware, updateProfileController);

module.exports = router;
