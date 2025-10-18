const express = require("express");
const router = express.Router();
const { 
  getUserContestParticipation, 
  getContestLeaderboard 
} = require("../controllers/ContestParticipation");
const auth = require("../middleware/auth");

router.get("/:contestId", auth, getUserContestParticipation);
router.get("/:contestId/leaderboard", getContestLeaderboard);

module.exports = router;