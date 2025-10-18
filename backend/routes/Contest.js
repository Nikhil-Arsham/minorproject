const express = require("express");
const router = express.Router();
const {
  getAllContests,
  getContestById,
  createContest,
  updateContest,
  deleteContest,
  getContestLeaderboard,
} = require("../controllers/Contest");
const { validate, contestValidationRules, idValidationRules } = require("../middleware/validator");
const auth = require("../middleware/auth");

router.get("/", getAllContests);
router.get("/:id", auth, validate(idValidationRules), getContestById);
router.post("/", auth, validate(contestValidationRules), createContest);
router.put("/:id", auth, validate(idValidationRules), updateContest);
router.delete("/:id", auth, validate(idValidationRules), deleteContest);
router.get("/:id/leaderboard", validate(idValidationRules), getContestLeaderboard);

module.exports = router;