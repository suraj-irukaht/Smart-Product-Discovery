// src/middlewares/setRole.middleware.js
const setRole = (role) => (req, res, next) => {
  req.registrationRole = role;
  next();
};

module.exports = setRole;
