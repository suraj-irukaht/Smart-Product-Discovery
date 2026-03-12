const express = require("express");
const {
  registerUserController,
  loginUserController,
  logoutUserController,
} = require("../controllers/auth.controller");

const setRole = require("../middlewares/setRole.middleware");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 *  */

router.post("/register", setRole("BUYER"), registerUserController);

router.post("/seller/register", setRole("SELLER"), registerUserController);

router.post("/login", loginUserController);
router.post("/logout", authMiddleware, logoutUserController);

module.exports = router;
