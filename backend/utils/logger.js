
  const jwt = require("jsonwebtoken");
  const { CustomError } = require("../../utils/errorHandler");

  const auth = async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) {
        throw new CustomError("Authentication required", 401);
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
      next();
    } catch (error) {
      next(new CustomError("Invalid or expired token", 401));
    }
  };

  module.exports = auth;