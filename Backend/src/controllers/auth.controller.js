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
  const { name, email, password, role, is_locked } = req.body;

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
  });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
  res.cookie("token", token);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
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

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Email or password is incorrect",
    });
  }

  const isValidpassword = await user.comparePassword(password);

  if (!isValidpassword) {
    return res.status(401).json({
      message: "Email or password is incorrect",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "2d",
  });
  res.cookie("token", token);
  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token,
  });
}

module.exports = {
  registerUserController,
  loginUserController,
};
