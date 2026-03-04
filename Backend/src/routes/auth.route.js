const express = require("express");
const {
  registerUserController,
  loginUserController,
} = require("../controllers/auth.controller");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 *  */

router.post("/register", registerUserController);
router.post("/login", loginUserController);

module.exports = router;
