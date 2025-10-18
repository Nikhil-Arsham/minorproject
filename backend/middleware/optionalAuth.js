const jwt = require("jsonwebtoken");

// Middleware that attempts to authenticate but doesn't fail if no token provided
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };
    }
    next();
  } catch (error) {
    // Log the error but don't fail - user remains unauthenticated
    console.warn('Optional auth error (this is normal for unauthenticated requests):', error.message);
    req.user = null;
    next();
  }
};

module.exports = optionalAuth;