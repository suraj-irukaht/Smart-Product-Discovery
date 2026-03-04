const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function getProfileController(req, res) {
  try {
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
}

module.exports = {
  getProfileController,
};
