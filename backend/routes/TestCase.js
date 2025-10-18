const express = require("express");
const router = express.Router();
const {
  getTestCasesByChallenge,
  getTestCasesByContest,
  createTestCase,
  createContestTestCase,
  updateTestCase,
  deleteTestCase,
} = require("../controllers/TestCase");
const { validate, testCaseValidationRules, idValidationRules } = require("../middleware/validator");
const auth = require("../middleware/auth");

router.get("/challenge/:id", validate(idValidationRules), getTestCasesByChallenge);
router.get("/contest/:id", validate(idValidationRules), getTestCasesByContest);
router.post("/challenge/:id", auth, validate([...idValidationRules, ...testCaseValidationRules]), createTestCase);
router.post("/contest/:id", auth, validate([...idValidationRules, ...testCaseValidationRules]), createContestTestCase);
router.put("/:testCaseId", auth, validate(idValidationRules), updateTestCase);
router.delete("/:testCaseId", auth, validate(idValidationRules), deleteTestCase);

module.exports = router;