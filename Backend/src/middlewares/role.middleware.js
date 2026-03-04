const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(401).json({
        message: "You are not allowed to perform this action",
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
