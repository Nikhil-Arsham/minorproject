const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controllers/Leaderboard");
const auth = require("../middleware/auth");

router.get("/", getLeaderboard);

module.exports = router;