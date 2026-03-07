const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const authOptionalMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split("")[1];
  if (!token) {
    return res.status(401).json({
      message: " Unauthorized access, token is missing",
    });
  }
  try {
    console.log("auth");
    // const authHeader = req.headers.authorization;

    // if (!authHeader) {
    //   return next();
    // }

    //const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.id);
    console.log("auth", decoded);
    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    next();
  }
};

module.exports = authOptionalMiddleware;
