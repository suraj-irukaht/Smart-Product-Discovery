const express = require("express");
const { getProfileController } = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 *  */

router.get("/profile", authMiddleware, getProfileController);

module.exports = router;

module.exports = router;
