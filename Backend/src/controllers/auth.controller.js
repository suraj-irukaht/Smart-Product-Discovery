const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { sendRegistrationEmail } = require("../services/email.service");

/**
 * - user registration controller
 * - @route   POST /api/auth/register
 * @access  Public
 * @desc    Register a new user
 * @body    { name, email, password }
 * @returns { user }
 */

async function registerUserController(req, res) {
  //const { name, email, password, role, is_locked } = req.body;
  const { name, email, password, is_locked, shopName } = req.body;
  const role = req.registrationRole || "BUYER";

  const isExists = await userModel.findOne({ email });

  if (isExists) {
    return res.status(422).json({
      message: "User already exists with this email",
      status: "failed",
    });
  }
  const user = await userModel.create({
    email,
    name,
    password,
    role,
    is_locked,
    shopName,
  });

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
  //await sendRegistrationEmail(user.email, user.name);
}

/**
 * - user login controller
 * - @route   POST /api/auth/login
 * @access  Public
 * @desc    Login a user
 * @body    { email, password }
 * @returns { user }
 */

async function loginUserController(req, res) {
  const { email, password } = req.body;

  //console.log(email, password);

  const user = await userModel.findOne({ email }).select("+password");

  console.log(user);

  if (!user) {
    return res.status(401).json({
      message: "Email or password is incorrect",
    });
  }

  if (!(await user.comparePassword(password))) {
    return res.status(401).json({
      message: "Email or password is incorrect",
    });
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

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
};

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
};
