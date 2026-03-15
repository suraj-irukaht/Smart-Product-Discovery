const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel
      .findById(decoded.userId || decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.is_locked) {
      return res.status(403).json({ message: "Account is locked" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}

/**
 * optionalAuth
 * Used for discovery routes that work for guests but
 * improve for logged-in users.
 *
 * FIX 1: Now checks cookies too (not just headers)
 * FIX 2: Uses correct env var JWT_SECRET_KEY
 * FIX 3: Loads full user object so req.user._id is always available
 */
const optionalAuth = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) return next(); // guest — continue without user

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel
      .findById(decoded.userId || decoded.id)
      .select("-password");

    if (user && !user.is_locked) {
      req.user = user;
    }
  } catch (_) {
    // invalid token — treat as guest, don't block
  }

  next();
};

module.exports = { authMiddleware, optionalAuth };
