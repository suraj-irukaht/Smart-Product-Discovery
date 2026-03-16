const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendPasswordResetEmail,
  sendRegistrationEmail,
} = require("../services/email.service");
const { createNotification } = require("./notification.controller");

function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
}

/**
 * REGISTER
 */
async function registerUserController(req, res) {
  const { name, email, password, is_locked, shopName, preferences } = req.body;
  const role = req.registrationRole || "BUYER";

  const existing = await userModel.findOne({ email });

  if (existing) {
    return res.status(422).json({
      message: "User already exists with this email",
    });
  }

  const user = await userModel.create({
    email,
    name,
    password,
    role,
    is_locked,
    shopName,
    preferences,
  });

  // Welcome email
  sendRegistrationEmail(user.email, user.name).catch(console.error);

  // Admin notification
  createNotification({
    type: role === "SELLER" ? "NEW_SELLER" : "NEW_USER",
    title: role === "SELLER" ? "New Seller Joined" : "New Buyer Registered",
    message: `${name} (${email}) just signed up`,
    link: role === "SELLER" ? "/admin/sellers" : "/admin/users",
  });

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(201).json({
    user: {
      _id: user._id,
      name,
      email,
      role,
      shopName,
      preferences: user.preferences,
    },
    token,
  });
}

/**
 * LOGIN
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      message: "Email or password is incorrect",
    });
  }

  const token = generateToken(user._id);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email,
      role: user.role,
      preferences: user.preferences,
    },
    token,
  });
}

/**
 * LOGOUT
 */
async function logoutUserController(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}

/**
 * FORGOT PASSWORD
 */
async function forgotPasswordController(req, res) {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res
      .status(200)
      .json({ message: "If that email exists, a reset link has been sent." });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  user.resetToken = hashedToken;
  user.resetTokenExpiry = Date.now() + 60 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  sendPasswordResetEmail(user.email, user.name, resetLink).catch(console.error);

  res
    .status(200)
    .json({ message: "If that email exists, a reset link has been sent." });
}

/**
 * RESET PASSWORD
 */
async function resetPasswordController(req, res) {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel
    .findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    })
    .select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired reset link",
    });
  }

  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  res.status(200).json({
    message: "Password reset successfully",
  });
}

module.exports = {
  registerUserController,
  loginUserController,
  forgotPasswordController,
  resetPasswordController,
  logoutUserController,
};
