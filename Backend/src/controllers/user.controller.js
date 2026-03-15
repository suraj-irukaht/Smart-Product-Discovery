const userModel = require("../models/user.model");

/**
 * updateProfileController
 *
 * Allows any authenticated user to update their own profile.
 * Supports updating email, phone, shopName (sellers only).
 * Password update is optional — only hashed and saved if provided.
 * Email uniqueness is checked before updating.
 *
 * Route: PUT /api/users/profile
 * Access: Any authenticated user (BUYER, SELLER, ADMIN)
 */
const updateProfileController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { email, phone, shopName, currentPassword, newPassword } = req.body;

    const user = await userModel.findById(userId).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check email uniqueness if changing email
    if (email && email !== user.email) {
      const exists = await userModel.findOne({ email });
      if (exists)
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }

    if (phone) user.phone = phone;
    if (shopName && user.role === "SELLER") user.shopName = shopName;

    // Password change
    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required" });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      user.password = newPassword; // pre-save hook will hash it
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shopName: user.shopName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * getProfileController
 *
 * Returns the authenticated user's profile data.
 *
 * Route: GET /api/users/profile
 * Access: Any authenticated user
 */
const getProfileController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

module.exports = { updateProfileController, getProfileController };
