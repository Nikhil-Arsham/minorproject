const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getUserSubmissions,
  getUserStats,
  getUserBadges,
  getUserContests,
  makeUserAdmin,
  makeFirstUserAdmin,
} = require("../controllers/User");

// Temporarily remove validation to test if that's the issue
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", updateUserProfile);
router.put("/:id", updateUserProfile);
router.get("/:id/submissions", getUserSubmissions);
router.get("/:id/stats", getUserStats);
router.get("/:id/badges", getUserBadges);
router.get("/:id/contests", getUserContests);
router.put("/:userId/make-admin", makeUserAdmin);
router.get("/make-first-admin", makeFirstUserAdmin);

module.exports = router;
