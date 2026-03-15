const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/email.service");
const { createNotification } = require("./notification.controller");

/**
 * @route   POST /api/auth/register
 * @access  Public
 */
async function registerUserController(req, res) {
  const { name, email, password, is_locked, shopName } = req.body;
  const role = req.registrationRole || "BUYER";

  const isExists = await userModel.findOne({ email });
  if (isExists) {
    return res.status(422).json({
      message: "User already exists with this email",
      status: "failed",
    });
  }

  // ── Create user ──────────────────────────────────────────
  const user = await userModel.create({
    email,
    name,
    password,
    role,
    is_locked,
    shopName,
  });

  // ── Notify admin (fire-and-forget) ───────────────────────
  createNotification({
    type: role === "SELLER" ? "NEW_SELLER" : "NEW_USER",
    title: role === "SELLER" ? "New Seller Joined" : "New Buyer Registered",
    message: `${name} (${email}) just signed up`,
    link: role === "SELLER" ? "/admin/sellers" : "/admin/users",
  });
  // ────────────────────────────────────────────────────────

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
  res.cookie("token", token, { httpOnly: true });

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      shopName: user.shopName,
      is_locked: user.is_locked,
    },
    token,
  });
}

/**
 * @route   POST /api/auth/login
 * @access  Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  if (!(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Email or password is incorrect" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });

  res.cookie("token", token);

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
}

async function logoutUserController(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}

/**
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
async function forgotPasswordController(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await userModel.findOne({ email });

  // Always respond 200 — don't reveal whether email exists
  if (!user) {
    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  }

  // Generate token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  user.resetToken = token;
  user.resetTokenExpiry = expires;
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  // Send email (fire-and-forget — don't fail the request if email fails)
  sendPasswordResetEmail(user.email, user.name, resetLink).catch(console.error);

  res
    .status(200)
    .json({ message: "If that email exists, a reset link has been sent." });
}

/**
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
async function resetPasswordController(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token and new password are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  const user = await userModel
    .findOne({ resetToken: token })
    .select("+resetToken +resetTokenExpiry +password");

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired reset link" });
  }

  if (user.resetTokenExpiry < new Date()) {
    return res
      .status(400)
      .json({ message: "Reset link has expired. Please request a new one." });
  }

  // Update password — pre-save hook will hash it
  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res
    .status(200)
    .json({ message: "Password reset successfully. You can now sign in." });
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  forgotPasswordController,
  resetPasswordController,
};
